const express = require('express')
const db = require('../lib/dbConnector')


const admin = express.Router()

admin.use(require('../middleware/checkAdmin'))

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
      db.query("UPDATE pages SET title=?, content=? WHERE ID=?", [req.body.title, req.body.content, req.params.id])

      res.redirect('/admin/pages/1/edit')
    }

  })
})





module.exports = admin