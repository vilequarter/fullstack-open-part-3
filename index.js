const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

/*
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
*/

require('dotenv').config();
app.use(express.json());
app.use(express.static('dist'));
app.use(cors());
const Person = require('./modules/person');

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
  Person.find({}).then(persons => {
    response.json(persons);
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  const id = request.params.id;
  Person.findById(request.params.id).then(person => {
    if(person){
      response.json(person);
    } else {
      response.status(404).end();
    }
  })
  .catch(error => next(error));
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end();
    })
    .catch(error => next(error));
})

app.post('/api/persons', (request, response) => {
  const person = new Person(request.body);
  person.save().then(result => {
    console.log('saved');
  })
  response.json(person);
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate(request.params.id, person, {new: true})
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`Phonebook contains ${persons.length} entries<br/>${new Date()}`);
  });
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if(error.name === 'CastError') {
    return response.status(400).send({error: 'malformed id'})
  }

  next(error);
}

app.use(errorHandler);