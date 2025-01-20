/*

Require the neccessary packages and define them as variable

*/

const express = require('express');
const ejs = require('ejs');

const db  = require('./lib/dbConnector');


const app = express();

app.set('view engine', 'ejs');
app.set('views', './public/views');

app.use(express.static('./public/assets/'))

app.set('static', '/public/assets')

app.get('/', (req, res)=>{

    res.render('index');

});

app.use('/blog/', require('./routes/blog'))


app.get('*', (req, res) =>{
    /*

    This is the 404 page route.
    To ensure it functions properly it needs to be the last route.

    */

    res.render('./errors/404')
});



app.listen(5050)