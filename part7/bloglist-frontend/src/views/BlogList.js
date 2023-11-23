import Blog from '../components/Blog'
import BlogForm from '../components/BlogForm'
import Togglable from '../components/Togglable'
import _ from 'lodash'

const BlogList = ({ blogs, user, handleLike, handleDelete, addNewBlog, blogFormRef }) => {
  return (
    <div>
      <h1>Blogs</h1>
      <Togglable buttonLabelOn='New blog' buttonLabelOff='Cancel' ref={blogFormRef}>
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

export default BlogList