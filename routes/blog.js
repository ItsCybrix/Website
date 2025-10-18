const express = require('express')
const db = require('../custom_modules/sql/db_connector')
const blog = express.Router();
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid'); // works with CommonJS
const { link } = require('./users');


blog.get('/', (req, res)=>{
        db.query("SELECT * FROM blog", function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        if(result.length >0){
            res.locals.blog = result

            res.render('blog/index')

        }else{
            res.render('../views/error/404')
        }



    });
})

blog.get('/category/:cat', (req, res)=>{
        db.query("SELECT * FROM blog WHERE category=?", [req.params.cat], function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        if(result.length >0){
            res.locals.blog = result

            res.render('blog/catindex')

        }else{
            res.locals.error = "No posts with the category \"" + req.params.cat + "\" where found"
            res.render('blog/error')
        }



    });
})


blog.get('/post/:purl', (req, res) => {
    db.query("SELECT * FROM blog WHERE url = ?", [req.params.purl], function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        if(result.length >0){
            res.locals.post = result[0]

            res.render('blog/posttemplate')

        }else{
            res.render('../views/error/404')
        }



    });
});


module.exports = blog