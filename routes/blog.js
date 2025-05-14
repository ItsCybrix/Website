const express = require('express')
const db = require('../lib/dbConnector')


    /* public facing blog route */
    /* Anything using /admin can be found in the admin.js file under the blog section. */


const blog = express.Router()


blog.get('/', (req, res)=>{

    db.query("SELECT * FROM blog", function (err, result) {
          if (err) {
            res.send("DB.query.error" + err)
          }

          if(result.length > 0){
            res.locals.blog = result
            res.render('blog/index')
          }
          else{
            res.send('Error fetching blog articles.')
          }
        });    
})


blog.get('/article/:id', (req, res)=>{

    db.query("SELECT * FROM blog WHERE id=?", [req.params.id], function (err, result) {
          if (err) {
            res.send("DB.query.error" + err)
          }

          if(result.length > 0){
            res.locals.article = result[0]
            res.render('blog/article')
          }
          else{
            res.send('Error fetching blog articles.')
          }
        });    
})




module.exports = blog