import { useState } from 'react'

const BlogForm = ({ addNewBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const cleanUp = () => {
        setTitle('')
        setAuthor('')
        setUrl('')
    }

    const submitBlog = (event) => {
        event.preventDefault()

        addNewBlog({
            title: title,
            author: author,
            url: url
        }, cleanUp)
    }

    return (
        <form onSubmit={ submitBlog }>
            title: <input id="form-title" value={ title } onChange={ ({ target }) => setTitle(target.value) } /><br />
            author: <input id="form-author" value={ author } onChange={ ({ target }) => setAuthor(target.value) } /><br />
            url: <input id="form-url" value={ url } onChange={ ({ target }) => setUrl(target.value) } /><br />
            <button id="create-button" type="submit">create</button>
        </form>
    )
}

export default BlogForm