import { useState } from 'react'

const Blog = ({ blog, handleLike, handleDelete, currentUserId }) => {
    const [detailsVisible, setDetailsVisible] = useState(false)

    const toggleVisibility = () => setDetailsVisible(!detailsVisible)

    const likeThisOne = () => handleLike(blog)

    const deleteThisOne = () =>
        window.confirm(`Remove blog ${blog.title} by ${blog.author}`) && handleDelete(blog)

    if(detailsVisible){
        return(
            <div className='blogListItem'>
                { blog.title } { blog.author } <button onClick={toggleVisibility}>hide</button><br />
                { blog.url }<br />
                likes { blog.likes } <button onClick={likeThisOne}>like</button><br />
                { blog.user?.username }<br />
                { currentUserId === blog.user?.id && <button onClick={deleteThisOne}>remove</button> }
            </div>
        )
    } else {
        return(
            <div className='blogListItem'>
                { blog.title } { blog.author } <button onClick={toggleVisibility}>view</button>
            </div>
        )
    }
}

export default Blog