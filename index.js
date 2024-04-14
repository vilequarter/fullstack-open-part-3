const express = require('express')
const app = express()

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

app.use(express.json());

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (request, response) => {
  response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(person => person.id === id);

    if(person){
        response.json(person);
    } else {
        response.status(404).end();
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)
  
    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    const person = request.body;

    console.log(person.name);
    if(!(person.name && person.number)){
        console.log('missing name or number')
        return response.status(400).json({
            error: "missing name or number"
        })
    }
    if(persons.find(p => p.name === person.name)){
        console.log('name must be unique');
        //error
        return response.status(400).json({
            error: "name already exists"
        })
    }

    person.id = Math.floor(Math.random() * 1000000);
    persons = persons.concat(person);
    response.json(person);
})

app.get('/info', (request, response) => {
    response.send(`Phonebook contains ${persons.length} entries<br/>${new Date()}`)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})