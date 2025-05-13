const express = require('express')
const db = require('../lib/dbConnector')


const admin = express.Router()


admin.use( (req, res, next)=>{
  if(res.locals.user.level == "Admin" || res.locals.user.level == "Owner"){
    next()
  }else{
    console.log("Security Check Failed!")
    console.log(res.locals.user)
    res.redirect('/')
  }
})

admin.get('/', (req, res) =>{
    res.render('./admin/index')
})


admin.get('/pages', (req, res)=>{

    db.query("SELECT * FROM pages", function (err, result) {
        if (err) {
          res.send("DB.query.error" + err)
        }
          res.locals.pages = result

          res.render('./admin/pages')
      });


})

admin.get('/pages/new', (req, res) =>{
  res.render('./admin/pageBuilder')
})

admin.post('/pages/new', (req, res) =>{

  db.query("INSERT INTO pages (title, url, content) VALUES (?, ?, ?)", [req.body.title, req.body.url, req.body.content], function (err, results){
    if(err){
      res.send(err)
    }else{
      res.redirect('/admin/pages')
    }
  });
})



admin.get('/pages/:id/edit', (req, res) => {
  db.query("SELECT * FROM pages WHERE ID=?", [req.params.id], function (err, result){
    if(err){
      res.send('DB.QUERY.ERROR: ' + err)
    }

    if(result.length > 0){
      res.locals.page = result[0]

      res.render('./admin/pageEditor')
    }
  })
})

admin.post('/pages/:id/edit', (req, res)=>{
  db.query("SELECT * FROM pages WHERE ID=?", [req.params.id], function (err, result){
    if(err){
      res.send('DB.QUERY.ERROR: ' + err)
    }

    if(result.length > 0){
      db.query("UPDATE pages SET url=?, title=?, content=? WHERE ID=?", [req.body.url, req.body.title, req.body.content, req.params.id])

      res.redirect('/admin/pages/'+ req.params.id +'/edit')
    }

  })








})

  admin.get('/pages/:id/delete', (req, res) =>{
      db.query("SELECT * FROM pages WHERE ID=?", [req.params.id], function (err, result){
    if(err){
      res.send('DB.QUERY.ERROR: ' + err)
    }

    if(result.length > 0){
      res.locals.page = result[0]

      res.render('./admin/pagedeleteconfirm')
    }
  })
  })

    admin.post('/pages/:id/delete', (req, res) =>{
      db.query("SELECT * FROM pages WHERE ID=?", [req.params.id], function (err, result){
    if(err){
      res.send('DB.QUERY.ERROR: ' + err)
    }

    if(result.length > 0){

      if(req.body.confirm == result[0].title){
        db.query("DELETE FROM pages WHERE ID=?", [req.params.id], function(err2, result2){
        if(err){
          res.send('DB.QUERY.ERROR: ' + err)
        }else{
          res.redirect('/admin/pages')
        }
        })
      }else{
        res.redirect('/admin/pages')
      }
    }
  })
  })





module.exports = admin