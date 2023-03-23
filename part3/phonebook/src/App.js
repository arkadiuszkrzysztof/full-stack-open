import { useState, useEffect } from 'react'
import personServices from './services/persons'

import Filter from './components/Filter'
import Contacts from './components/Contacts'
import ContactForm from './components/ContactForm'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState({})

  useEffect(() => {
    personServices
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const personsToDisplay = (
    filter !== '' 
    ? persons.filter(person => person.name.toLocaleLowerCase().indexOf(filter.toLocaleLowerCase()) >= 0) 
    : undefined
  )

  const addContact = (event) => {
    event.preventDefault()

    if(newName === '' || newPhone === ''){
      return
    }

    const existingContact = persons.find(contact => contact.name === newName)

    if(existingContact && window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
      const updatedPerson = {...existingContact, number: newPhone}
      
      personServices
        .update(existingContact.id, updatedPerson)
        .then(data => {
          setPersons(persons.map(person => person.id !== existingContact.id ? person : updatedPerson))
          setNewName('')
          setNewPhone('')
          setNotification({type: 'success', message: `contact ${newName} updated in phonebook`})
          setTimeout(() => setNotification({}), 5000)
        })
        .catch(error => {
          if(error.response?.data?.error){
            setNotification({type: 'error', message: JSON.stringify(error.response?.data?.error)})
            setTimeout(() => setNotification({}), 5000)
          } else {
            setPersons(persons.filter(person => person.id !== existingContact.id))
            setNotification({type: 'error', message: `contact ${existingContact.name} was already deleted form server`})
            setTimeout(() => setNotification({}), 5000)
          }
        })
    } 

    if(!existingContact) {
      const newPerson = {name: newName, number: newPhone}

      personServices
        .create(newPerson)
        .then(data => {
          setPersons(persons.concat(data))
          setNewName('')
          setNewPhone('')
          setNotification({type: 'success', message: `contact ${newName} added to phonebook`})
          setTimeout(() => setNotification({}), 5000)
        })
        .catch(error => {
          setNotification({type: 'error', message: JSON.stringify(error.response?.data?.error)})
          setTimeout(() => setNotification({}), 5000)
        })
    }
  }

  const removeContact = (contact) => {
    if(!window.confirm(`Delete ${contact.name} ?`)) return
    
    personServices
      .remove(contact.id)
      .then(() => {
        setPersons(persons.filter(person => person.id !== contact.id))
        setNotification({type: 'success', message: `contact ${contact.name} removed from phonebook`})
        setTimeout(() => setNotification({}), 5000)
      })
      .catch(error => {
        setPersons(persons.filter(person => person.id !== contact.id))
        setNotification({type: 'error', message: `contact ${contact.name} was already deleted form server`})
        setTimeout(() => setNotification({}), 5000)
      })
  }
  
  const handleNameChange = (event) => setNewName(event.target.value)

  const handlePhoneChange = (event) => setNewPhone(event.target.value)

  const handleFilterChange = (event) => setFilter(event.target.value)

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification type={notification.type} message={notification.message} />
      <Filter {...{filter, handleFilterChange}} />
      <h3>Add a new</h3>
      <ContactForm {...{addContact, newName, newPhone, handleNameChange, handlePhoneChange}} />
      <h3>Numbers</h3>
      <Contacts contacts={personsToDisplay || persons} removeContact={removeContact} />
    </div>
  )
}

export default App