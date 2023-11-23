import { useSelector } from 'react-redux'

const Notification = () => {
  const notification = useSelector(store => store.notification)
  const style = {
    border: 'solid',
    backgroundColor: '#c3c3c3',
    padding: 10,
    borderWidth: 1,
    marginBottom: 10
  }

  if(notification !== '')
    return (
      <div style={style}>
        {notification}
      </div>
    )
  else
    return
}

export default Notification