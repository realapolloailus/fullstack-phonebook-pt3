// Practice file for MongoDB functionality.

const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch(error => {
    console.log('error connecting to MongoDB', error.message)
  })

const personSchema = new mongoose.Schema({
    name:{
      type: String
    },
    
    number:{
      type: String
    } 
})

const Person = mongoose.model("Person", personSchema)

const person = new Person({
  name: process.argv[3],
  number: process.argv[4],
})



if(process.argv.length===3){
    console.log('phonebook:');
    Person
        .find({ })
        .then(result => {
        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })
    mongoose.connection.close()
  })
}


else{
    person.save().then(result => {
    console.log('person saved!')
    mongoose.connection.close()
    })
}  



