const express = require('express')
const path = require('path')
const router = require('./router')
const bodyParser = require('body-parser')
const session = require('express-session')

const app = express()

app.engine('html' , require('express-art-template'))

app.use('/public/', express.static(path.join(__dirname , './public')))
app.use('/node_modules/', express.static(path.join(__dirname , './node_modules')))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(session({
  secret: 'keyboard cat', //  加密
  resave: false,
  saveUninitialized: true
}))

app.use(router)

app.listen(3000,function () {
  console.log('访问：http://localhost:3000')
})