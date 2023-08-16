console.log('hello world')

const express = require('express')
const app = express()
var morgan = require('morgan')
const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}
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
    //res.json(persons)
    Person
    .find({})
    .then(person => {
      if(person){ res.json(person) }
      else{ res.status(404).end() }
    }).catch(error =>{
      console.log(error);
      res.status(500).end()
    })
})

const generateID =  () =>{
    /*const maxId = persons.length > 0
        ? Math.max(...persons.map( p => p.id ))
        : 0
    return maxId+1*/
    return Math.floor(Math.random() * 1000);
}

app.post('/api/persons', (request, response)=>{
    const body = request.body
    if ((!body.name || !body.number)) {
      return response.status(400).json({ error: 'content missing' })
    }
    if( persons.find(p=> p.name === body.name) ){
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    const person = new Person({
        id: generateID(),
        name: body.name,
        number: body.number,
    })
    //persons = persons.concat(person)
    //response.json(person)
    person
      .save()
      .then(savedPerson=>{
        response.json(savedPerson)
      })

})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    console.log(id);
    /*const person = persons.find(p=> p.id === id)
    console.log(person);

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }*/
    Person
      .findById(id)
      .then(person =>{
        response.json(person)
      })

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
    response.send(`<p>Phonebook has info for ${totalLen} people</p>
                   <p>${date}</p>`)
})

// End code for api/info.

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


