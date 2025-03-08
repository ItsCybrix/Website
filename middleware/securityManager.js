const db = require('../lib/dbConnector')


const securityManager = function (req, res, next){


    db.query("SELECT * FROM users WHERE sessionToken = ?",  [req.cookies.sessionToken], function (err, result) {
        if (err) {
          res.send("DB.query.error" + err)
        }

        if(result.length > 0){
          res.locals.user = result[0]
          console.log(res.locals.user)
          next()
        }else{
          next()
        }
      });



}

module.exports = securityManager;