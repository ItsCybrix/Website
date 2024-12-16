const express = require('express')
const fs = require('fs')
const axios = require('axios')
const { memoryUsage } = require('process')
var morgan = require('morgan')
var path = require('path')
var rfs = require('rotating-file-stream')


const app = express()



// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'log')
  })
  
  // setup the logger
  app.use(morgan('combined', { stream: accessLogStream }))




app.use(morgan('combined'))

app.set('view engine', 'ejs')
app.set('views', './public/views/')
app.use(express.static('./public/assets'))

siteVer = fs.readFileSync('./build.version')








app.get('/', async(req, res) =>{

    try 
    {
        cmd = req.query.cmd

        if (cmd == undefined) {
            cmd = 'main'
        }


        console.log(cmd)

        if(cmd.includes('-') && cmd.includes(' ')){
            cmd.split(' ')
    
            if(cmd[0] == 'yiff' && cmd[1] == 'g'){
                cmd = 'gayYiff'
                console.log('F')
            }else{
                console.log(cmd)
            }
        }
        
        if(cmd == 'help'){
            cmd = 'help'
        }else if(cmd == 'gay yiff'){

            const response = await axios.get('https://e621.net/posts.json?tags=male/male%20knot', {
                headers: { 'User-agent': 'Cybrix/1.0' }
            });

            yiff = response.data.posts[randomIntFromInterval(1, 75)].file.url;

            cmd = 'gayYiff';


            function randomIntFromInterval(min, max) { // min and max included 
                return Math.floor(Math.random() * (max - min + 1) + min);
            }

            done = true

         res.render('index', {cmdView: cmd, cmdInput: req.query.cmd, siteVer: siteVer})

            
        }else if(cmd == 'neofetch'){
            cmd = 'neofetch'
        }else if(cmd == 'links'){
            cmd = 'links'
        }else if(cmd == 'kinks'){
            cmd = 'kinks'
        }else if(cmd == 'nsfwpics'){
            cmd = 'nsfwpics'


            images = fs.readdirSync('./public/assets/static/images/nsfw')

            res.locals.images
            console.log(images)

            
        }else if(cmd == 'main'){
            cmd = 'main'


            

            music = await axios.get('https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=ItsCybrix&api_key=28d9a0d3f3307e2445a9b0c64f2b59ff&format=json', {headers: {'User-Agent': 'Cybrix/1.0'}})

            console.log(music.data.recenttracks.track[0].artist["#text"])


            res.locals.musicTitle = music.data.recenttracks.track[0].name
            res.locals.musicArtist = music.data.recenttracks.track[0].artist["#text"]



        }else{
            cmd = 'knotValid'



            

        }


            res.render('index', {cmdView: cmd, cmdInput: req.query.cmd, siteVer: siteVer})
        

        
    } 
    catch (error)
    {
        console.log(error)
    }



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