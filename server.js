const express = require('express');

const app = express();
app.set('view engine', 'ejs');
app.use(express.static('./public/assets'))

var bodyParser = require('body-parser')

var cookies = require('cookie-parser');

const db = require('./lib/dbConnector')

const md5 = require('md5')

const { v4: uuidv4 } = require('uuid');




app.use(cookies());

app.use(bodyParser.urlencoded({ extended: false }))



// parse application/x-www-form-urlencoded

// parse application/json
app.use(bodyParser.json())

app.use(require('./middleware/securityManager'))





app.set('views', './public/views');

app.get('/', (req, res)=>{
    res.render('index');
    console.log(req.cookies);
})

app.get('/users/login', (req, res)=>{

    res.render('./login');

});

app.post('/users/login', (req, res)=>{
  console.log(req.body)

  let username = req.body.username

  uuid = uuidv4();


  db.query("SELECT * FROM users WHERE username =?", [username.toLowerCase()], function (err, result){
    if(err){
      res.send("DB QUERY ERROR: " + err);
    }


    let password = md5(req.body.password)

    if(result.length > 0){
      if([password == result[0].password]){
        res.cookie('sessionToken', uuid, {maxAge: 1000 * 60 * 86400 * 30 * 12, httpOnly: true})

        db.query("UPDATE users SET sessionToken=? WHERE username=?", [uuid ,req.body.username], function (err, result){
          if(err) throw err;
        })

        res.redirect('/');
      };      
    }

  })


})

app.use('/admin', require('./routes/admin'))

app.get('/:route', (req, res)=>{



        db.query("SELECT * FROM pages WHERE url = ?",  [req.params.route], function (err, result) {
          if (err) {
            res.send("DB.query.error" + err)
          }

          if(result.length > 0){
            res.render('./page-template', {pageBuilderData: result[0]})
          }else{
            res.render("./errors/404")
          }
        });
      });

app.listen(5050);