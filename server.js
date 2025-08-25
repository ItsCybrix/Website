const express = require('express');
const dotenv = require('dotenv').config()
const db = require('./custom_modules/sql/db_connector')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public/assets'))
app.set('views', './public/views');
app.set('trust proxy', true);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded())

// parse application/json
app.use(bodyParser.json())

app.use(cookieParser());

app.use(require('./custom_modules/security/userManager'))
app.use(require('./custom_modules/security/requestValidator'))

app.get('/', (req, res)=>{
    res.render('index')
})



app.use('/users', require('./routes/users'))


app.use('/',(req, res)=>{
    res.render('error/404');
})



app.listen(5050, ()=>{
    console.log("Cybrix.Dev web worker started")
})