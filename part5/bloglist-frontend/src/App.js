import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import _ from 'lodash'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState()
    const [notification, setNotification] = useState({})

    const blogFormRef = useRef()

    useEffect(() => {
        blogService.getAll().then(blogs => setBlogs(blogs))
    }, [])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedUser')

        if(loggedUserJSON){
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const setDisappearingBanner = (type, message) => {
        setNotification({ type: type, message: message })
        setTimeout(() => {
            setNotification({})
        }, 5000)
    }

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({ username, password })
            blogService.setToken(user.token)
            window.localStorage.setItem('loggedUser', JSON.stringify(user))
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            const message = exception.response?.data?.error || 'Wrong credentials'
            setDisappearingBanner('error', message)
        }
    }

    const handleLogout = () => {
        window.localStorage.removeItem('loggedUser')
        setUser()
    }

    const addNewBlog = async (newBlog, callback) => {
        try {
            const blog = await blogService.create(newBlog)

            callback()
            blogFormRef.current.toggleVisibility()

            setBlogs(blogs.concat(blog))
            setDisappearingBanner('success', `a new blog ${blog.title} added`)
        } catch (exception) {
            const message = exception.response?.data?.error || exception.message
            setDisappearingBanner('error', message)
        }
    }

    const handleLike = async blogToUpdate => {
        try {
            const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
            const response = await blogService.update(blogToUpdate.id, updatedBlog)

            setBlogs(blogs.map(blog => blog.id !== response.id ? blog : response))
        } catch (exception) {
            const message = exception.response?.data?.error || exception.message
            setDisappearingBanner('error', message)
        }
    }

    const handleDelete = async blogToDelete => {
        try {
            await blogService.remove(blogToDelete.id)

            setBlogs(blogs.filter(blog => blog.id !== blogToDelete.id))
            setDisappearingBanner('success', `blog ${blogToDelete.title} was removed`)
        } catch (exception) {
            const message = exception.response?.data?.error || exception.message
            setDisappearingBanner('error', message)
        }
    }

    if (!user) {
        return (
            <div>
                <h2>Log in to application</h2>
                <Notification type={notification.type} message={notification.message} />
                <h2>create new</h2>
                <LoginForm {...{ handleLogin, username, password, setUsername, setPassword }} />
            </div>
        )
    } else {
        return (
            <div>
                <h2>blogs</h2>
                {user && <div>
                    <p>
                        {user.name} logged in
                        <button onClick={handleLogout}>logout</button>
                    </p>
                </div>
                }
                <Notification type={notification.type} message={notification.message} />
                <Togglable buttonLabelOn='new blog' buttonLabelOff='cancel' ref={blogFormRef}>
                    <BlogForm {...{ addNewBlog }} />
                </Togglable>
                { _
                    .orderBy(blogs, 'likes', 'desc')
                    .map(blog =>
                        <Blog
                            key={blog.id}
                            currentUserId={user.id}
                            {...{ blog, handleLike, handleDelete }}
                        />
                    )
                }
            </div>
        )
    }
}

export default App