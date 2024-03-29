/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'

import Menu from './components/Menu'
import Notification from './components/Notification'
import Anecdote from './components/Anecdote'
import AnecdoteList from './components/AnecdoteList'
import About from './components/About'
import CreateNew from './components/CreateNew'
import Footer from './components/Footer'


const App = () => {
    const [anecdotes, setAnecdotes] = useState([
        {
            content: 'If it hurts, do it more often',
            author: 'Jez Humble',
            info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
            votes: 0,
            id: 1
        },
        {
            content: 'Premature optimization is the root of all evil',
            author: 'Donald Knuth',
            info: 'http://wiki.c2.com/?PrematureOptimization',
            votes: 0,
            id: 2
        }
    ])

    const [notification, setNotification] = useState('')

    const showNotification = (content) => {
        setNotification(content)
        setTimeout(() => setNotification(''), 5000)
    }

    const addNew = (anecdote) => {
        anecdote.id = Math.round(Math.random() * 10000)
        setAnecdotes(anecdotes.concat(anecdote))
    }

    const anecdoteById = (id) =>
        anecdotes.find(a => a.id === id)

    const vote = (id) => {
        const anecdote = anecdoteById(id)

        const voted = {
            ...anecdote,
            votes: anecdote.votes + 1
        }

        setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
    }

    return (
        <div>
            <h1>Software anecdotes</h1>
            <Router>
                <Menu />
                <Notification content={notification}/>
                <Routes>
                    <Route path='/anecdotes/:id' element={<Anecdote anecdotes={anecdotes}/>} />
                    <Route path='/about' element={<About />} />
                    <Route path='/create' element={<CreateNew addNew={addNew} onCreateNew={showNotification}/>} />
                    <Route path='/' element={<AnecdoteList anecdotes={anecdotes} />} />
                </Routes>
            </Router>
            <Footer />
        </div>
    )
}

export default App
