import { createSlice } from '@reduxjs/toolkit'
import anecdoteService from '../services/anecdotes'
import { displayNotification } from '../reducers/notificationReducer'

const getId = () => (100000 * Math.random()).toFixed(0)

const asObject = (anecdote) => {
    return {
        content: anecdote,
        id: getId(),
        votes: 0
    }
}

const anecdoteSlice = createSlice({
    name: 'anecdote',
    initialState: [],
    reducers: {
        vote(state, action) {
            console.log('payload'. action.payload)
            const id = action.payload.id
            const anecdoteToChange = state.find(a => a.id === id)
            const changedAnecdote = { ...anecdoteToChange, votes: anecdoteToChange.votes + 1 }
            return state.map(anecdote => anecdote.id !== id ? anecdote : changedAnecdote)
        },
        addAnecdote(state, action) {
            return [...state, asObject(action.payload)]
        },
        appendAnecdote(state, action) {
            state.push(action.payload)
        },
        setAnecdotes(state, action){
            return action.payload
        }
    }
})

export const initializeAnecdotes = () => {
    return async (dispatch) => {
        const anecdotes = await anecdoteService.getAll()
        dispatch(setAnecdotes(anecdotes))
    }
}

export const createAnecdote = (content) => {
    return async (dispatch) => {
        anecdoteService.createNew(content).then(() => {
            dispatch(addAnecdote(content))

            dispatch(displayNotification(`you created anecdote'${content}'`, 5))
        })
    }
}

export const voteOnAnecdote = (anecdote) => {
    return async (dispatch, getState) => {
        const changedAnecdote = { ...anecdote, votes: anecdote.votes + 1 }

        anecdoteService.update(changedAnecdote).then(() => {
            dispatch(setAnecdotes(
                getState().anecdotes.map(a => a.id !== changedAnecdote.id ? a : changedAnecdote)
            ))

            dispatch(displayNotification(`you voted for anecdote '${anecdote.content}'`, 5))
        })
    }
}

export const { vote, addAnecdote, appendAnecdote, setAnecdotes } = anecdoteSlice.actions
export default anecdoteSlice.reducer