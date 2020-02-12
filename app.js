const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

require('dotenv').config()

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Access-Control-Allow-Header', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
    if(req.method === 'OPTIONS'){
        req.header('Acess-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
        return res.status(200).json({})
    }
    next()
})


const productRoutes = require('./api/routes/products')
const ordersRoutes = require('./api/routes/orders')


mongoose.connect("mongodb+srv://root:"+process.env.MONGO_ATLAS_PW+"@node-rest-zsujo.mongodb.net/test?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(morgan('dev'))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/products', productRoutes)
app.use('/orders', ordersRoutes)

app.use((req, res, next) => {
    const error = new Error('Not found')
    error.status = 404
    next(error)

})

app.use((error, req, res, next) => {
    res.status(error.status || 500)
    res.json({
        error: {
            message: error.message
        }
    })
})



module.exports = app