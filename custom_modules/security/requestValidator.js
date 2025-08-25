const db = require('../sql/db_connector');

function userManager(req, res, next) {
    const ip = req.ip; // make sure app.set('trust proxy', true) behind nginx
    const banned_routes = ['/wp-admin'];
    const threshold = 3; // block after 3 hits

    db.query("SELECT * FROM banned_ips WHERE ip = ?", [ip], function (err, result) {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        // Not in banned list
        if (result.length === 0) {
            // If they’re on a honeypot route → insert them into table with hits=1
            if (banned_routes.includes(req.url)) {
                db.query(
                    "INSERT INTO banned_ips (ip, hits, reason) VALUES (?, ?, ?)",
                    [ip, 1, "Honeypot route access"],
                    function (err2) {
                        if (err2) console.error("DB error inserting IP:", err2);
                        console.log(`⚠️ New IP logged: ${ip} accessed ${req.url} (1/${threshold})`);
                        next();
                    }
                );
            } else {
                // Normal route and not in banned list → allow
                return next();
            }
            return;
        }

        // Already in banned list
        const banRecord = result[0];
        let newHits = banRecord.hits;

        // If request is NOT a honeypot route → allow
        if (!banned_routes.includes(req.url)) {
            return next();
        }

        // Honeypot route → increment hits
        newHits++;

        db.query("UPDATE banned_ips SET hits = ? WHERE ip = ?", [newHits, ip], function (err2) {
            if (err2) {
                console.error("DB error updating hits:", err2);
                return res.status(500).send("Server error");
            }

            if (newHits >= threshold) {
                console.log(`🚫 Blocked IP ${ip} after ${newHits} hits on honeypot route ${req.url}`);
                return res.status(403).send('🚫 Your IP is banned from this server. Reason: ' + banRecord.reason);
            }

            console.log(`⚠️ Honeypot hit from ${ip} (${newHits}/${threshold})`);
            next();
        });
    });
}

module.exports = userManager;
