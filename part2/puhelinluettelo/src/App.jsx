/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react'
import axios from "axios"

// component to filters and show persons and shows on based search term
const Persons = ({ persons, search, deleteData }) => {
  const personsToShow = persons.filter((person) =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )
  return (
    <div>
      {personsToShow.map((person, name) => (
        <p key={name}>
          {person.name} {person.number}
          <button onClick={() => deleteData(person.id, person.name)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}
// filter component
const Filter = ({ search, handleSearch }) => {
  return (
    <div>
      filter shown with <input value={search} onChange={handleSearch} />
    </div>
  )
}
// form component
const PersonForm = ({
  addPerson,
  newName,
  handleNewName,
  newNumber,
  handleNewNumber,
}) => {
  return (
    <form onSubmit={addPerson}>
      <div>
        name: <input value={newName} onChange={handleNewName} />
      </div>
      <div>
        number: <input value={newNumber} onChange={handleNewNumber} />
      </div>
      <div>
        <button type='submit'>add</button>
      </div>
    </form>
  )
}
// notification component
const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }
  return (
    <div className={type === 'info' ? 'info' : 'error'}>
      {message}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [infoMessage, setInfoMessage] = useState(null)
  const [messageType, setMessageType] = useState('')

  // useEffect to fetch data from db file
  useEffect(() => {
    axios.get("http://localhost:3001/api/persons")
      .then(response => {
        setPersons(response.data)
      })
      .catch(error => {
        console.error("Error fetching data", error)
      })
  }, [])

  // handles new name
  const handleNewName = (event) => {
    setNewName(event.target.value)
  }
  // handles new number
  const handleNewNumber = (event) => {
    setNewNumber(event.target.value)
  }
  // handles search
  const handleSearch = (event) => {
    setSearch(event.target.value)
  }

  // add new person to list
  const addPerson = (event) => {
    event.preventDefault()
    const existingPerson = persons.find((person) => person.name === newName)

    if (existingPerson) {
      updateData(existingPerson.id, newName)
    } else {
      const person = {
        name: newName,
        number: newNumber,
      }
      axios
        .post("http://localhost:3001/api/persons", person)
        .then((response) => {
          setPersons(persons.concat(response.data)) // add new person to list
          setNewName('') // empties name input
          setNewNumber('') // empties number input
          // add person info message
          setInfoMessage(`Added ${newName}`)
          setMessageType('info')
          setTimeout(() => {
            setInfoMessage(null)
          }, 3000)
        })
        .catch((error) => {
          console.error("Error adding person:", error);
          setInfoMessage("Name or number is missing");
          setMessageType('error');
          setTimeout(() => {
            setInfoMessage(null);
          }, 3000);
        });
      }
  }

  // delete person
  const deleteData = (id, name) => {
    if (window.confirm(`Delete ${name}?`)) {
      axios
        .delete(`http://localhost:3001/api/persons/${id}`)
        .then(() => {
          setPersons(persons.filter((person) => person.id !== id))
          // delete person info message
          setInfoMessage(`Deleted ${name}`)
          setMessageType('info')
          setTimeout(() => {
            setInfoMessage(null)
          }, 3000)
        })
        // update error message
        .catch((error) => {
          console.error('Error deleting person', error)
          setInfoMessage(`Information of ${name} has already been removed from server`)
          setMessageType('error')
          setTimeout(() => {
            setInfoMessage(null)
          }, 3000)
        })
    }
  }
  //update phone number
  const updateData = (id, name) => {
    const updatedPerson = { name, number: newNumber}
    if (window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)) {
      dataService
      .update(id, updatedPerson)
      .then(returnedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : returnedPerson))
        setNewName('')
        setNewNumber('')
        // update info message
        setInfoMessage(`Updated ${name}`)
        setTimeout(() => {
          setInfoMessage(null)
        }, 3000)  
      })
      .catch(error => {
        setInfoMessage(`Information of ${name} has already been removed from server`)
        setMessageType('error')
        setTimeout(() => {
          setInfoMessage(null)
        }, 3000)
      })
    }
  }
  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={infoMessage} type={messageType}/>
      <Filter search={search} handleSearch={handleSearch} />
      <h3>add a new</h3>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} search={search} deleteData={deleteData} />
    </div>
  )
}

export default App
