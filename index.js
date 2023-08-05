console.log('hello world')

const express = require('express')
const app = express()

app.use(express.json())

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
    res.json(persons)
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
    if(!body.name || !body.number){
        return response.status(400).json({
            error: 'content missing'
        })
    }
    if( persons.find(p=> p.name === body.name) ){
        return response.status(409).json({
            error: 'name must be unique'
        })
    }
    const person = {
        id: generateID(),
        name: body.name,
        number: body.number,
    }
    persons = persons.concat(person)
    response.json(person)

})

app.get('/api/persons/:id', (request, response)=>{
    const id = Number(request.params.id)
    console.log(id);
    const person = persons.find(p=> p.id === id)
    console.log(person);

    if(person){
        response.json(person)
    }
    else{
        response.status(404).end()
    }

})

app.delete('api/persons/:id', (request, response)=>{
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

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})


