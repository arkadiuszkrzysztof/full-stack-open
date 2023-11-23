import { useState, useEffect, useRef } from 'react'
import blogService from './services/blogs'
import loginService from './services/login'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import { displayNotification } from './reducers/notificationReducer'
import { initializeBlogs, addBlog, updateBlog, removeBlog } from './reducers/blogsReducer'
import { setUser, clearUser } from './reducers/userReducer'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import BlogList from './views/BlogList'
import Users from './views/Users'
import User from './views/User'
import Blog from './views/Blog'

import Container from 'react-bootstrap/Container'
import Navbar from 'react-bootstrap/Navbar'
import Button from 'react-bootstrap/Button'
import Nav from 'react-bootstrap/Nav'

const App = () => {
  const dispatch = useDispatch()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const blogFormRef = useRef()
  const blogs = useSelector(({ blogs }) => blogs)
  const user = useSelector(({ user }) => user)

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser')

    if(loggedUserJSON){
      const user = JSON.parse(loggedUserJSON)
      dispatch(setUser(user))
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({ username, password })
      blogService.setToken(user.token)
      window.localStorage.setItem('loggedUser', JSON.stringify(user))
      dispatch(setUser(user))
      setUsername('')
      setPassword('')
    } catch (exception) {
      const message = exception.response?.data?.error || 'Wrong credentials'
      dispatch(displayNotification(message))
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedUser')
    dispatch(clearUser())
  }

  const addNewBlog = async (newBlog, callback) => {
    try {
      const blog = await blogService.create(newBlog)

      callback()
      blogFormRef.current.toggleVisibility()

      dispatch(addBlog(blog))
      dispatch(displayNotification(`a new blog ${blog.title} added`))
    } catch (exception) {
      const message = exception.response?.data?.error || exception.message
      dispatch(displayNotification(message))
    }
  }

  const handleLike = async blogToUpdate => {
    try {
      const updatedBlog = { ...blogToUpdate, likes: blogToUpdate.likes + 1 }
      const response = await blogService.update(blogToUpdate.id, updatedBlog)

      dispatch(updateBlog(response))
    } catch (exception) {
      const message = exception.response?.data?.error || exception.message
      dispatch(displayNotification(message))
    }
  }

  const handleDelete = async blogToDelete => {
    try {
      await blogService.remove(blogToDelete.id)

      dispatch(removeBlog(blogToDelete))
      dispatch(displayNotification(`blog ${blogToDelete.title} was removed`))
    } catch (exception) {
      const message = exception.response?.data?.error || exception.message
      dispatch(displayNotification(message))
    }
  }

  if (!user) {
    return (
      <Container>
        <h2>Log in to application</h2>
        <Notification />
        <h2>create new</h2>
        <LoginForm {...{ handleLogin, username, password, setUsername, setPassword }} />
      </Container>
    )
  } else {
    return (
      <Container>
        <BrowserRouter>

          <Navbar className="bg-body-tertiary">
            <Container>
              <Navbar.Brand href="#home">Blogs App</Navbar.Brand>
              <Navbar.Toggle />
              <Navbar.Collapse className="justify-content-end">
                <Nav className="me-auto">
                  <Nav.Link as={Link} to="/">Blogs</Nav.Link>
                  <Nav.Link as={Link} to="/users">Users</Nav.Link>
                </Nav>
                <Navbar.Text>
                Signed in as: {user.name}
                  <Button className='ms-2' variant='secondary' onClick={handleLogout}>Log out</Button>
                </Navbar.Text>
              </Navbar.Collapse>
            </Container>
          </Navbar>

          <Notification />

          <Routes>
            <Route path="/" element={<BlogList {...{ blogs, user, handleLike, handleDelete, addNewBlog, blogFormRef }} />} />
            <Route path="/users" element={<Users />} />
            <Route path="/users/:id" element={<User />} />
            <Route path="/blogs/:id" element={<Blog {...handleLike} />} />
          </Routes>
        </BrowserRouter>
      </Container>
    )
  }
}

export default App