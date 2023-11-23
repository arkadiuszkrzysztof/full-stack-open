const blogsRouter = require('express').Router()
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 })
    response.json(blogs)
})

blogsRouter.post('/', async (request, response) => {
    const body = request.body
    const user = request.user

    if(!user){
        return response.status(401).json({ error: 'user unauthorized to perform action' })
    }

    const blog = new Blog({
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes,
        user: user.id
    })

    const savedBlog = await blog.save()
    savedBlog.populate('user', { username: 1, name: 1 })
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()

    response.status(201).json(savedBlog)
})

blogsRouter.get('/:id', async (request, response) => {
    const blog = await Blog.findById(request.params.id).populate('user', { username: 1, name: 1 })

    if (blog) {
        response.json(blog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.delete('/:id', async (request, response) => {
    const user = request.user

    if(!user){
        return response.status(401).json({ error: 'user unauthorized to perform action' })
    }

    const blog = await Blog.findById(request.params.id)

    if (!blog){
        response.status(204).end()
    } else if (blog.user.toString() === request.user.id){
        blog.delete()
        response.status(204).end()
    } else {
        return response.status(401).json({ error: 'user unauthorized to perform action' })
    }
})

blogsRouter.put('/:id', async (request, response) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, blog, { new: true })
        .populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

blogsRouter.post('/:id/comments', async (request, response) => {
    const comment = request.body.comment

    const blog = await Blog.findById(request.params.id)
    const newBlog = { ...blog, comments: blog.comments.push(comment) }

    const updatedBlog = await Blog
        .findByIdAndUpdate(request.params.id, newBlog, { new: true })
        .populate('user', { username: 1, name: 1 })

    if (updatedBlog) {
        response.json(updatedBlog)
    } else {
        response.status(404).end()
    }
})

module.exports = blogsRouter