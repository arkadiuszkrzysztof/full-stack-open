const listHelper = require('../utils/list_helper')
const { listWithOneBlog, listWithManyBlogs } = require('./test_helper')


test('dummy returns one', () => {
    const blogs = []

    const result = listHelper.dummy(blogs)
    expect(result).toBe(1)
})

describe('total likes', () => {
    test('of empty list is zero', () => {
        expect(listHelper.totalLikes([])).toBe(0)
    })

    test('when list has only one blog, equals the likes of that', () => {
        expect(listHelper.totalLikes(listWithOneBlog)).toBe(5)
    })

    test('of a bigger blog list is calculated right', () => {
        expect(listHelper.totalLikes(listWithManyBlogs)).toBe(36)
    })
})

describe('favorite blogs', () => {
    test('when list has only one blog', () => {
        expect(listHelper.favoriteBlog(listWithOneBlog)._id).toBe('5a422aa71b54a676234d17f8')
    })

    test('of a bigger blog list', () => {
        expect(listHelper.favoriteBlog(listWithManyBlogs)._id).toBe('5a422b3a1b54a676234d17f9')
    })
})

describe('the MOST...', () => {
    test('...published author', () => {
        expect(listHelper.mostBlogs(listWithManyBlogs).author).toBe('Robert C. Martin')
    })

    test('...liked author', () => {
        expect(listHelper.mostLikes(listWithManyBlogs).author).toBe('Edsger W. Dijkstra')
    })
})