const express = require('express')

const app = express()

app.set('view engine', 'ejs')
app.set('views', './public/views/')
app.use(express.static('./public/assets'))


app.get('/', (req, res)=>{

    let cmd = req.query.cmd

    if(typeof(cmd) == undefined){
        cmd = 'main';
    }



    console.log(cmd)

    if(cmd.includes('-') && cmd.includes(' ')){
        cmd.split(' ')

        console.log('ARG COMMAND')
    }
    
    if(cmd == 'help'){
        cmd = 'help'
    }else if(cmd == 'gay yiff'){
        cmd = 'gayYiff'
    } else if(cmd = 'main'){
        cmd = 'main'
    }else{
        cmd = 'KnotValid'
    }

    



    res.render('index', {cmdInput: cmd})
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