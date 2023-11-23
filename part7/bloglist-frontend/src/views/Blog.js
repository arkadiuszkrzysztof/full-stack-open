import React, { useEffect, useState } from 'react'
import blogService from '../services/blogs'
import { useParams } from 'react-router-dom'

import { displayNotification } from '../reducers/notificationReducer'
import { useDispatch } from 'react-redux'

const Blog = ({ handleLike }) => {
  const dispatch = useDispatch()
  const [blog, setBlog] = useState({})
  const [comment, setComment] = useState('')
  const id = useParams().id

  const likeThisOne = () => handleLike(blog)

  const cleanUp = () => {
    setComment('')
  }

  const submitComment = (event) => {
    event.preventDefault()

    addNewComment({ comment: comment }, cleanUp)
  }

  const addNewComment = async (newComment, callback) => {
    try {
      const updatedBlog = await blogService.addComment(blog.id, newComment)

      callback()

      setBlog(updatedBlog)

      dispatch(displayNotification(`a new comment to the blog ${blog.title} added`))
    } catch (exception) {
      const message = exception.response?.data?.error || exception.message
      dispatch(displayNotification(message))
    }
  }


  useEffect(() => {
    blogService.get(id).then((blog) => setBlog(blog))
  }, [])

  return (
    <div>
      <h2>{`${blog.title} ${blog.author}`}</h2>
      {blog.url}
      <br />
      {blog.likes} likes <button onClick={likeThisOne}>like</button>
      <br />
      {blog.user && `added by ${blog.user.username}`}

      {blog.comments && (
        <div>
          <h3>comments</h3>
          <form onSubmit={submitComment}>
            <input
              id="form-comment"
              value={comment}
              onChange={({ target }) => setComment(target.value)}
            />
            <button id="create-button" type="submit">
              add comment
            </button>
          </form>
          <ul>
            {blog.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default Blog
