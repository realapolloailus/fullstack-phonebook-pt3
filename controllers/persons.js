const personsRouter = require('express').Router()
const Person = require('../models/person')

let persons = [
	{
		id: 1,
		name: 'Arto Hellas',
		number: '040-123456'
	},
	{
		id: 2,
		name: 'Ada Lovelace',
		number: '39-44-5323523'
	},
	{
		id: 3,
		name: 'Dan Abramov',
		number: '12-43-234345'
	},
	{
		id: 4,
		name: 'Mary Poppendieck',
		number: '39-23-6423122'
	}
]

/*personsRouter.get('/', (req, res) => {
	res.send('<h1>Hello World!</h1>')
})*/

// Begin code for api/persons:

personsRouter.get('/', (req, res) => {
	Person
		.find({})
		.then(persons => {
			res.json(persons)
		})
})



// Begin code for adding entries to phonebook:

personsRouter.post('/', (request, response, next) => {
	const body = request.body
	if ((!body.name || !body.number)) {
		return response.status(400).json({ error: 'content missing' })
	}
	if( persons.find(p => p.name === body.name) ){
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
		.then(savedPerson => savedPerson.toJSON())
		.then(savedPersonFormatted => {
			response.json(savedPersonFormatted)
		}).catch(error => next(error))

})

// End code for adding entries to phonebook.

// Begin code for retrieving single entries from phonebook:

personsRouter.get('/:id', (request, response, next) => {
	console.log(request.params.id)
	Person.findById(request.params.id)
		.then(person => {
			if (person) {
				response.json(person)
			} else {
				response.status(404).end()
			}
		})
		.catch(error => next(error))

})

// End code for retrieving single entries from phonebook.

// Begin code for /info:


personsRouter.get('/info', (request, response) => {
	var date = new Date()
	const totalLen=persons.length
	Person
		.find({})
		.then(persons => {
			response.send(`<p>Phonebook has info for ${totalLen} people</p>
                   <p>${date}</p>`)
		})
})

// End code for api/info.


// Begin code for updating entries via PUT request:

personsRouter.put('/:id', (request, response, next) => {
	const body = request.body

	const newPerson = {
		//id: generateID(),
		name: body.name,
		number: body.number,
	}

	Person.findByIdAndUpdate(request.params.id, newPerson, { new: true })
		.then(person => {
			response.json(person)
		})
		.catch(error => next(error))
})

// End code for updating entries.


// Begin code for deleting phonebook entries:
personsRouter.delete('/:id', (request, response, next ) => {
	Person.findByIdAndRemove(request.params.id)
		.then(result => {
			response.status(204).end()
		})
		.catch(error => next(error))
})

// End coded for deleting phonebook entries.

module.exports = personsRouter
