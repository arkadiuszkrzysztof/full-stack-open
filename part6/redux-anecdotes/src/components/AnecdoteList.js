import { useSelector, useDispatch } from 'react-redux'
import { voteOnAnecdote } from '../reducers/anecdoteReducer'

const _ = require('lodash')

const AnecdoteList = () => {
    const anecdotes = useSelector(
        ({ anecdotes, filter }) => anecdotes.filter(a => a.content.toLowerCase().indexOf(filter.toLowerCase()) > -1)
    )

    const dispatch = useDispatch()

    const handleVote = anecdote => {
        dispatch(voteOnAnecdote(anecdote))
    }

    return (
        <div>
            {_.orderBy(anecdotes, 'votes', 'desc').map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                    has {anecdote.votes}
                        <button onClick={() => handleVote(anecdote)}>vote</button>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AnecdoteList