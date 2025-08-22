const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public/assets'))
app.set('views', './public/views');

app.get('/', (req, res)=>{
    res.render('index')
})




app.use('/',(req, res)=>{
    res.send('404');
})


app.listen(5050, ()=>{
    console.log("Cybrix.Dev web worker started")
})