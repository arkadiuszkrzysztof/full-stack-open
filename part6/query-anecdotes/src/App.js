import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import AnecdotesList from './components/AnecdotesList'

import { useQuery, useMutation, useQueryClient } from 'react-query'
import { getAnecdotes, updateAnecdote } from './requests'
import { useNotificationDispatch } from './NotificationContext'

const App = () => {
    const queryClient = useQueryClient()
    const dispatch = useNotificationDispatch()

    const updateAnecdoteMutation = useMutation(updateAnecdote, {
        onSuccess: (updatedAnecdote) => {
            const anecdotes = queryClient.getQueryData('anecdotes')
            queryClient.setQueryData('anecdotes', anecdotes.map(anecdote =>
                anecdote.id !== updatedAnecdote.id ? anecdote : updatedAnecdote
            ))

            dispatch({ type: 'SET', payload: `anecdote '${updatedAnecdote.content}' voted` })
            setTimeout(() => dispatch({ type: 'CLEAR' }), 5000)
        }
    })

    const handleVote = (anecdote) => {
        updateAnecdoteMutation.mutate({ ...anecdote, votes: anecdote.votes + 1 })
    }

    const result = useQuery('anecdotes', getAnecdotes, { errorPolicy: 'none', retry: false, refetchOnWindowFocus: false })

    if(result.isLoading){
        return <div>loading data...</div>
    }

    if(result.isError){
        return <div>anecdote service not available due to problems in server</div>
    }

    return (
        <div>
            <h3>Anecdote app</h3>
            <Notification />
            <AnecdoteForm />
            <AnecdotesList anecdotes={result.data} handleVote={handleVote} />
        </div>
    )
}

export default App
