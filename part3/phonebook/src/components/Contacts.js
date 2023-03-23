const Contact = ({contact, removeContact}) => (
    <p>
        {contact.name} {contact.number} <button onClick={() => removeContact(contact)}>delete</button>
    </p>
)

const Contacts = ({contacts, removeContact}) => (
  <div>
    {contacts.map(contact => <Contact key={contact.id} contact={contact} removeContact={removeContact} />)}
  </div>
)


export default Contacts