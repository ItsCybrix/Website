const express = require('express')
const db = require('../custom_modules/sql/db_connector')
const users = express.Router();
const md5 = require('md5');
const { v4: uuidv4 } = require('uuid'); // works with CommonJS


users.get('/', (req, res)=>{
    res.send('This route is not implemented');
})

users.get('/login', (req, res)=>{
    res.render('users/login');
})


users.post('/login', (req, res) => {
    db.query("SELECT * FROM users WHERE username = ?", [req.body.username.toLowerCase()], function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        if (result.length === 0) {
            return res.send("User not found");
        }

        // Check username + password
        if (req.body.username === result[0].username && md5(req.body.password) === result[0].passwd_hash) {

            // Generate a UUID for the session
            const sessionToken = uuidv4();

            // Save sessionToken into DB
            db.query("UPDATE users SET sessionToken = ? WHERE ID = ?", [sessionToken, result[0].ID], function (err2) {
                if (err2) {
                    return res.send("DATABASE ERROR " + err2);
                }

                // Set cookie for 1 year
                res.cookie('SessionToken', sessionToken, { 
                    httpOnly: true,       // not accessible via JS
                    secure: false,        // set true if HTTPS
                    maxAge: 1000 * 60 * 60 * 24 * 365 // 1 year
                });

                res.redirect('/users/account'); // or wherever you want after login
            });
        } else {
            res.send("Invalid username or password");
        }
    });
});


users.get('/new', (req, res)=>{
    res.render('users/register');
})

users.post('/new', (req, res) => {
    db.query("SELECT * FROM users WHERE username = ?", [req.body.username], function (err, result) {
        if (err) {
            return res.send('DATABASE ERROR! ' + err);
        }

        // Username already taken
        if (result.length > 0) {
            return res.send("Username already in use");
        }

        // Validate inputs
        if (!req.body.username || req.body.username.trim() === '') {
            return res.send("Username cannot be empty!");
        }
        if (!req.body.password1 || req.body.password1.trim() === '') {
            return res.send("Password cannot be empty");
        }
        if (req.body.password1 !== req.body.password2) {
            return res.send("Passwords do not match!");
        }

        // All good → insert new user
        const passwdHash = md5(req.body.password1);
        const sessionToken = uuidv4();

        db.query(
            "INSERT INTO users (username, email, passwd_hash, sessionToken, level) VALUES (?, ?, ?, ?, ?)",
            [req.body.username, req.body.email, passwdHash, sessionToken, 'Unverified'],
            function (err2, result2) {
                if (err2) {
                    return res.send("DATABASE ERROR " + err2);
                }

                // Set session cookie for 1 year
                res.cookie('SessionToken', sessionToken, { 
                    httpOnly: true,
                    secure: false, // set to true if HTTPS
                    maxAge: 1000 * 60 * 60 * 24 * 365
                });

                // Redirect to account/dashboard
                res.redirect('/users/account');
            }
        );
    });
});


module.exports = users