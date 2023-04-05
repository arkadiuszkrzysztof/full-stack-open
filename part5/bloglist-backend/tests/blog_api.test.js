const mongoose = require('mongoose')
const supertest = require('supertest')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const Blog = require('../models/blog')
const User = require('../models/user')
const { listWithManyBlogs, blogsInDb, nonExistingId } = require('./test_helper')
const app = require('../app')

const api = supertest(app)

const getToken = async () => {
    const user = await User.findOne()

    const userForToken = {
        username: user.username,
        id: user._id,
    }

    return jwt.sign(userForToken, process.env.SECRET, { expiresIn: 60*60 })
}

beforeEach(async () => {
    await User.deleteMany({})

    const user = new User({
        username: 'test',
        name: 'Test Test',
        passwordHash: await bcrypt.hash('1234', 10)
    })

    const savedUser = await user.save()

    await Blog.deleteMany({})

    const blogObjects = listWithManyBlogs.map(blog => new Blog({ ...blog, user: savedUser._id }))
    const promioseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promioseArray)
})

describe('when there is initially some notes saved', () => {
    test('blogs are returned as json', async () => {
        await api
            .get('/api/blogs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('there are blogs added to the database', async () => {
        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(listWithManyBlogs.length)
    })

    test('blogs objects are properly structured', async () => {
        const blogs = await blogsInDb()

        expect(blogs[0].id).toBeDefined()
        expect(blogs[0]._id).not.toBeDefined()
    })

    test('there is a blog title called React patterns', async () => {
        const response = await api.get('/api/blogs')
        const titles = response.body.map(blog => blog.title)

        expect(titles).toContain('React patterns')
    })
})

describe('viewing a specific blog', () => {
    test('succeeds with a valid id', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToView = blogsAtStart[0]

        const resultBlog = await api
            .get(`/api/blogs/${blogToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(resultBlog.body.title).toEqual(blogToView.title)
    })

    test('fails with statuscode 404 if blog does not exist', async () => {
        const validNonexistingId = await nonExistingId()

        await api
            .get(`/api/blogs/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with statuscode 400 if id is invalid', async () => {
        const invalidId = '5a3d5da59070081a82a3445'

        await api
            .get(`/api/blogs/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new blog', () => {
    test('a valid blog can be added', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Life',
            url: 'http://some.url',
            likes: 11
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${await getToken()}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const response = await api.get('/api/blogs')

        const contents = response.body.map(r => r.title)

        expect(response.body).toHaveLength(listWithManyBlogs.length + 1)
        expect(contents).toContain('async/await simplifies making async calls')
    })

    test('blog without likes has default value of 0', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Life',
            url: 'http://some.url'
        }

        const response = await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${await getToken()}`)
            .send(newBlog)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const blogs = await blogsInDb()

        expect(blogs).toHaveLength(listWithManyBlogs.length + 1)

        const addedBlog = blogs.find(blog => blog.id === response.body.id)

        expect(addedBlog.title).toBe('async/await simplifies making async calls')
        expect(addedBlog.likes).toBe(0)
    })

    test('blog without title is not added', async () => {
        const newBlog = {
            author: 'Life',
            url: 'http://some.url',
            likes: 11
        }

        await api
            .post('/api/blogs')
            .set('Authorization', `Bearer ${await getToken()}`)
            .send(newBlog)
            .expect(400)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(listWithManyBlogs.length)
    })

    test('fails if no token is provided', async () => {
        const newBlog = {
            title: 'async/await simplifies making async calls',
            author: 'Life',
            url: 'http://some.url',
            likes: 11
        }

        await api
            .post('/api/blogs')
            .send(newBlog)
            .expect(401)

        const response = await api.get('/api/blogs')

        expect(response.body).toHaveLength(listWithManyBlogs.length)
    })
})

describe('deletion of a blog', () => {
    test('a blog can be deleted', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToDelete = blogsAtStart[0]

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${await getToken()}`)
            .expect(204)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(listWithManyBlogs.length - 1)

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).not.toContain(blogToDelete.title)
    })

    test('when the id is does not exist in db', async () => {
        const validNonexistingId = await nonExistingId()

        await api
            .delete(`/api/blogs/${validNonexistingId}`)
            .set('Authorization', `Bearer ${await getToken()}`)
            .expect(204)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(listWithManyBlogs.length)
    })

    test('fails if unauthorized user', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToDelete = blogsAtStart[0]

        const oldToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InRlc3QiLCJpZCI6IjY0MjE4ODJhNjcwNWI3ZjRmOWJlZGUxYyIsImlhdCI6MTY3OTkxOTE0NiwiZXhwIjoxNjc5OTIyNzQ2fQ.FR-37wKiOMSyFGtxL0v5Faff3OvOBFWy7XEcNP4dnPU'

        await api
            .delete(`/api/blogs/${blogToDelete.id}`)
            .set('Authorization', `Bearer ${oldToken}`)
            .expect(401)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(listWithManyBlogs.length)

        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).toContain(blogToDelete.title)
    })
})

describe('updating of a blog', () => {
    test('when the update request id valid', async () => {
        const blogsAtStart = await blogsInDb()
        const blogToUpdate = blogsAtStart[0]

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .send({ ...blogToUpdate, title: 'Updated title 1234' })

        const blogsAtEnd = await blogsInDb()
        const titles = blogsAtEnd.map(r => r.title)

        expect(titles).toContain('Updated title 1234')

    })

    test('when the id is invalid', async () => {
        const validNonexistingId = await nonExistingId()

        await api
            .put(`/api/blogs/${validNonexistingId}`)
            .send({ ...{}, title: 'Updated title 1234' })
            .expect(404)

        const blogsAtEnd = await blogsInDb()

        expect(blogsAtEnd).toHaveLength(listWithManyBlogs.length)
    })
})

afterAll(async () => {
    await mongoose.connection.close()
})