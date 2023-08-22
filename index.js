console.log('hello world')

const express = require('express')
const app = express()
var morgan = require('morgan')
const cors = require('cors')

const mongoose = require('mongoose')

const yourpassword = process.argv[2]
console.log(yourpassword);

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url =
  `mongodb+srv://apolloailus:${yourpassword}@cluster0.xmyde6z.mongodb.net/personApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
    }
  })

const Person = mongoose.model("Person", personSchema)

app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(cors())
app.use(express.static('build'))


morgan.token('content', (request) =>
  request.method === 'POST' && request.body.name
    ? JSON.stringify(request.body)
    : null
)

let persons = [
    { 
      id: 1,
      name: "Arto Hellas", 
      number: "040-123456"
    },
    { 
      id: 2,
      name: "Ada Lovelace", 
      number: "39-44-5323523"
    },
    { 
      id: 3,
      name: "Dan Abramov", 
      number: "12-43-234345"
    },
    { 
      id: 4,
      name: "Mary Poppendieck", 
      number: "39-23-6423122"
    }
]

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
  })

// Begin code for api/persons:  

app.get('/api/persons', (req, res) =>{
    Person
    .find({})
    .then(persons => {
      res.json(persons)
    })
})

const generateID =  () =>{
    return Math.floor(Math.random() * 1000);
}

app.post('/api/persons', (request, response, next)=>{
    const body = request.body
    if ((!body.name || !body.number)) {
      return response.status(400).json({ error: 'content missing' })
    }
    if( persons.find(p=> p.name === body.name) ){
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    const newPerson = new Person({
        //id: generateID(),
        name: body.name,
        number: body.number,
    })
    newPerson
      .save()
      .then(savedPerson=>savedPerson.toJSON())
      .then(savedPersonFormatted=>{
        response.json(savedPersonFormatted)
      }).catch(error => next(error))

})

app.get('/api/persons/:id', (request, response, next)=>{
    const id = Number(request.params.id)
    console.log(id);
    Person.findById(id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end() 
      }
    })
    /*.catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })    
    })*/
    .catch(error=>next(error))

})

app.delete('/api/persons/:id', (request, response)=>{
    const id =Number(request.params.id)
    console.log(id);
    persons = persons.filter(p=> p.id !== id)
    console.log(persons);
    
    response.status(204).end()
})

// End code for api/persons.

// Begin code for /info:


app.get('/info', (request, response)=>{
    var date = new Date();
    const totalLen=persons.length
    /*response.send(`<p>Phonebook has info for ${totalLen} people</p>
                   <p>${date}</p>`)*/
    Person
    .find({})
    .then(persons => {
      response.send(`<p>Phonebook has info for ${totalLen} people</p>
                   <p>${date}</p>`)
    })
})

// End code for api/info.

// Begin code for deleting phonebook entries:
app.delete('/api/persons/:id', (request, response, next ) =>{
  Person.findByIdAndRemove(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}
app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) =>{
  console.error(error.message)
  if(error.name==='CastError'){
    return response.status(400).send({
      error: 'malformatted id'
    })
  }
  else if(error.name === 'ValidationError'){
    return response.status(400).json({ 
      error: error.message 
    })
  }
  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


