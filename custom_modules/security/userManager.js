const db = require('../sql/db_connector');

function userManager(req, res, next){

    console.log(req.ip)

    if (req.cookies?.SessionToken){
            // Check if sessionToken exists in DB
    db.query("SELECT * FROM users WHERE sessionToken = ?", [req.cookies?.SessionToken], function (err, result) {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        if (result.length === 0) {
            // Invalid/expired token
            return res.redirect('/users/login');
        }

        // Attach user to request object for later use
        req.user = result[0];

        // ✅ Allow request to continue
        next();
    });
    next();
    }

}

module.exports = userManager