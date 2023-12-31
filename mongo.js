const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.set('strictQuery',false)
mongoose.connect(url)
	.then(result => {
		console.log('connected to MongoDB')
	})
	.catch(error => {
		console.log('error connecting to MongoDB', error.message)
	})

const personSchema = new mongoose.Schema({
	name:{
		type: String,
		minLength: 3,
		required: true
	},

	number:{
		type: String,
		minLength: 8,
		validate: {
			validator: function(v) {
				return /^\d{2,3}-\d{7,}$/.test(v)
			},
			message: props => `${props.value} is not a valid phone number!`
		},
		required: true
	}
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
	name: process.argv[3],
	number: process.argv[4],
})



/*if(process.argv.length===3){
    console.log('phonebook:');
    Person
        .find({ })
        .then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
    mongoose.connection.close()
  })
}*/


//else{
person.save().then(result => {
	console.log('person saved!')
	mongoose.connection.close()
})
//}



