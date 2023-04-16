import { createSlice } from '@reduxjs/toolkit'

const initialState = 'this is a notification placeholder'

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

export const displayNotification = (content, duration) => {
    return async (dispatch) => {
        dispatch(setNotification(`you voted for anecdote '${content}'`))
        setTimeout(() => dispatch(clearNotification()), duration * 1000)
    }
}

export const { setNotification, clearNotification } = notificationSlice.actions
export default notificationSlice.reducer