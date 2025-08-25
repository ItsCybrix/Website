const db = require('../sql/db_connector');

function userManager(req, res, next) {
    const ip = req.ip; // needs app.set('trust proxy', true) behind nginx
    const banned_routes = ['/wp-admin'];
    const threshold = 3; // block after 3 hits

    db.query("SELECT * FROM banned_ips WHERE ip = ?", [ip], function (err, result) {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        // Not in banned list → let them through
        if (result.length === 0) {
            return next();
        }

        const banRecord = result[0];
        let newHits = banRecord.hits;

        // Case 1: If request is NOT a honeypot route → always let them pass
        if (!banned_routes.includes(req.url)) {
            return next();
        }

        // Case 2: If it IS a honeypot route, increment hits
        newHits++;

        db.query("UPDATE banned_ips SET hits = ? WHERE ip = ?", [newHits, ip], function (err2) {
            if (err2) {
                console.error("DB error updating hits:", err2);
                return res.status(500).send("Server error");
            }

            // If over threshold → block
            if (newHits >= threshold) {
                console.log(`🚫 Blocked IP ${ip} after ${newHits} hits on honeypot route ${req.url}`);
                return res.status(403).send('🚫 Your IP is banned from this server. Reason: ' + banRecord.reason);
            }

            // Otherwise let them through (warning stage)
            console.log(`⚠️ Honeypot hit from ${ip} (${newHits}/${threshold})`);
            next();
        });
    });
}

module.exports = userManager;
