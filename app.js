console.log('hello world')

const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const personsRouter = require('./controllers/persons')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
const url = process.env.MONGODB_URI
logger.info('connecting to', config.MONGODB_URI)
mongoose.set('strictQuery',false)
mongoose.connect(url)
	.then(result => {
		logger.info('connected to MongoDB')
	})
	.catch(error => {
		logger.error('error connecting to MongoDB', error.message)
	})

app.use(cors())
app.use(express.json())
app.use(express.static('build'))
app.use(middleware.morgan(':method :url :status :res[content-length] - :response-time ms :content'))
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)
app.use('/api/persons', personsRouter)
