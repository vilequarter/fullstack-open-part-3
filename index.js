const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
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
app.use(express.static('dist'));
app.use(cors());

/*app.use(morgan('tiny')); //logs basic request info to console*/
//creates a token ':body' to log the JSON info in a POST request
morgan.token('body', function(req, res) {
  return JSON.stringify(req.body);
});
//logs the same information as the 'tiny' configuration, plus the :body token
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));

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
  console.log(JSON.stringify(request.body));
  const person = request.body;
  if(!(person.name && person.number)){
      return response.status(400).json({
          error: "missing name or number"
      })
  }
  if(persons.find(p => p.name === person.name)){
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

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});