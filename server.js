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
const passport = require('passport')
const Emitter = require('events')

// Database connection
mongoose.connect(mongoURI, {})
    .then(() => console.log("Database connected..."))
    .catch((err) => console.log(err));

const mongoStore = new mongoDBSession({
    uri: mongoURI,
    collection: 'sessions'
})

// Event emitter
const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)
// session config

app.use(require('express-session')({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: true,
    store: mongoStore,
    store: mongoStore,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hrs
}))


//passport config

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

// assets 
app.use(express.static('public'))
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// Global middleware
app.use((req, res, next) => {
    res.locals.session = req.session
    res.locals.user = req.user
    next()
})

//set Template engine
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

const server = app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`)
})


//socket 

const io = require ('socket.io')(server)
io.on('connection', (socket) => {
    // Join 
    console.log(socket.id)
    socket.on('join', (orderId) => {
             console.log(orderId)
            socket.join(orderId)
    })
})

eventEmitter.on('orderUpdated', (data) => {
    io.to(`order_${data.id}`.emit('orderUpdated', data))
})

eventEmitter.on('orderPlaced', () => {
    io.to('adminRoom').emit('orderPlaced', data)
})