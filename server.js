require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const mongoDBSession = require('connect-mongodb-session')(session)
const mongoURI = "mongodb://localhost:27017/pizza"


// Database connection
mongoose.connect(mongoURI, {})
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err));

const mongoStore = new mongoDBSession({
    uri: mongoURI,
    collection: 'sessions'
})


// session config

app.use(session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hrs
}))

app.use(flash())

// assets 
app.use(express.static('public'))
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})