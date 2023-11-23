import React, { useEffect, useState } from 'react'
import userService from '../services/users'
import { useParams } from 'react-router-dom'

const User = () => {
  const [user, setUser] = useState({})
  const id = useParams().id

  useEffect(() => {
    userService.get(id).then((user) => setUser(user))
  })

  return (
    <div>
      <h2>{user.name}</h2>
      <h3>added blogs</h3>
      <ul>
        {user.blogs?.map((blog) => (
          <li key={blog.id}>{blog.title}</li>
        ))}
      </ul>
    </div>
  )
}

export default User