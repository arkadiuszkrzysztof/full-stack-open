import { createSlice } from '@reduxjs/toolkit'

const initialState = ''

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification(state, action){
      return action.payload
    },
    clearNotification(){
      return ''
    }
  }
})

export const displayNotification = (content, duration = 5) => {
  return async (dispatch) => {
    dispatch(setNotification(content))
    setTimeout(() => dispatch(clearNotification()), duration * 1000)
  }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer