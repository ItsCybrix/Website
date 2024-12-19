const mysql = require('mysql')


console.log('Connecting to database...')

const db = mysql.createConnection(
    {
        host: process.env.dbhost,
        user: process.env.dbuser,
        password: process.env.dbpass,
        database: process.env.db
    })

    db.connect(function(err){
        if(err) {
            throw err;
        }else{
            console.log('Database connected!')
        }
    })


    module.exports = db