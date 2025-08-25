const db = require('../sql/db_connector');

function userManager(req, res, next){

    db.query("SELECT * FROM banned_ips WHERE ip = ?", [req.ip], function (err, result) {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            // Invalid/expired token
            return res.redirect('/users/login');
        }
    })
    
}

module.exports = userManager