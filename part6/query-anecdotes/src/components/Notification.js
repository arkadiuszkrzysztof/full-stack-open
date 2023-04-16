import { useNotificationValue } from '../NotificationContext'

const Notification = () => {
    const style = {
        border: 'solid',
        padding: 10,
        borderWidth: 1,
        marginBottom: 5
    }

    const notificationContent = useNotificationValue()

    if (notificationContent === '') return null

    return (
        <div style={style}>
            {notificationContent}
        </div>
    )
}

export default Notification
