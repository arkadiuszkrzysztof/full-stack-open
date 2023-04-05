var _ = require('lodash')

const dummy = () => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
        ? 0
        : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    const topLikes = Math.max(...blogs.map(blog => blog.likes))
    return blogs.find(blog => blog.likes === topLikes)
}

const mostBlogs = (blogs) => {
    const groupedBy = _.countBy(blogs, 'author')
    const blogsByAuthor = Object.keys(groupedBy).map(key => ({ author: key, blogs: groupedBy[key] }))

    return _.maxBy(blogsByAuthor, 'blogs')
}

const mostLikes = (blogs) => {
    const groupedByAuthor = _.groupBy(blogs, 'author')
    const likesByAuthor = _.mapValues(groupedByAuthor, (value => _.reduce(value, (sum, n) => sum + n.likes, 0)))
    const formatted = Object.keys(likesByAuthor).map(key => ({ author: key, likes: likesByAuthor[key] }))

    return _.maxBy(formatted, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}