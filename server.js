const express = require('express')

const app = express()

app.set('view engine', 'ejs')
app.set('views', './public/views/')
app.use(express.static('./public/assets'))



app.get('/', (req, res)=>{
    res.render('index')
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