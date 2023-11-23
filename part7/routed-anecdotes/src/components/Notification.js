const Notification = ({ content }) => {
    if(!content || content === ''){
        return
    }

    return (
        <p>{content}</p>
    )
}

export default Notification