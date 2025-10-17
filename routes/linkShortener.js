const express = require('express')
const db = require('../custom_modules/sql/db_connector')
const shortlink = express.Router();
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid'); // works with CommonJS
const { link } = require('./users');


shortlink.get('/:sc', (req, res) => {
    db.query("SELECT * FROM short_links WHERE shortcode = ?", [req.params.sc], function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        if(result.length >0){
            res.redirect(result[0].original_url);
        }else{
            res.render('../views/error/404')
        }



    });
});


module.exports = shortlink