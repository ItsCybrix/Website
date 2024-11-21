const express = require('express')

const app = express()

app.set('view engine', 'ejs')
app.set('views', './public/views/')
app.use(express.static('./public/assets'))





app.use('/routes', require('./routes/router'))


app.get('/', (req, res)=>{

    if (req.query.params = '/')
    {
        res.render('index', {route: "/"})
        console.log('EMPTY')
    }
})


app.get('/:r', (req, res)=>{
    res.render('index', {route: req.params.r})
})




app.get('*', (req, res)=>{
    res.send('404')
})


app.all('*', (req, res) =>{
    res.status(405)
    res.send('MEMTHOD NOT ALLOWED!')
})

app.use(require('./middleware/errorHandler'))

const port = process.env.HTTP_Port || 5050
app.listen(port, ()=>{
    console.log(`Server @ http://127.0.0.1:${port}`)
})