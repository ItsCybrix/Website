const express = require('express');

const db = require('../lib/dbConnector')

const blog = express.Router();


blog.get('/', (req, res) =>{

    db.query("SELECT * FROM blog", function (err, result, fields) {
        if (err) throw err;
        if (result.length >0) {
            res.render('blog/blog', {posts: result});
        }else{
            res.render('./blog/blog', {posts: 0})
        }
      });
});

blog.get('/posts/:id', (req, res)=>{
    let id = req.params.id;
    db.query("SELECT * FROM blog WHERE ID=?", id, function (err, result) {
        if (err) throw err;
        if (result.length >0) {
            res.render('blog/post', {post: result[0]});
            console.log(result[0]);
        }else{
            res.render('./blog/blog')
        }
      });
});


module.exports = blog;