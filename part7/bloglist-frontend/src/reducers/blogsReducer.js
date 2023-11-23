import { createSlice } from '@reduxjs/toolkit'
import blogsService from  '../services/blogs'

const initialState = {}

const blogsSlice = createSlice({
  name: 'blogs',
  initialState,
  reducers: {
    setBlogs(state, action){
      return action.payload
    },
    addBlog(state, action){
      return state.concat(action.payload)
    },
    updateBlog(state, action){
      const blogToUpdate = action.payload
      return state.map(blog => blog.id !== blogToUpdate.id ? blog : blogToUpdate)
    },
    removeBlog(state, action){
      const blogToRemove = action.payload
      return state.filter(blog => blog.id !== blogToRemove.id)
    }
  }
})

export const initializeBlogs = () => {
  return async (dispatch) => {
    const blogs = await blogsService.getAll()
    dispatch(setBlogs(blogs))
  }
}

export const { setBlogs, addBlog, updateBlog, removeBlog } = blogsSlice.actions
export default blogsSlice.reducer