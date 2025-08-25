const db = require('../sql/db_connector');
const minimatch = require("minimatch").minimatch;


function userManager(req, res, next) {
    const ip = req.ip; // remember: app.set('trust proxy', true) behind nginx
    const threshold = 3;

    // 👇 Define honeypot routes with wildcards
    const banned_routes = [
        "/wp-admin*",    // matches /wp-admin, /wp-admin/index.php, etc
        "/*.env*",       // matches /.env, /.env.backup, /.env123
        "/env.sample",
        "/env.example",
        "/wp-*",
        "/install.php",
        "/installer.php"
    ];

    // Helper: check if the request URL matches any glob
    const isHoneypot = banned_routes.some(pattern =>
        minimatch(req.url, pattern, { nocase: true }) // nocase = ignore case
    );

    db.query("SELECT * FROM banned_ips WHERE ip = ?", [ip], function (err, result) {
        if (err) {
            console.error("DB error in middleware:", err);
            return res.status(500).send("Server error");
        }

        // Not in banned list
        if (result.length === 0) {
            if (isHoneypot) {
                db.query(
                    "INSERT INTO banned_ips (ip, hits, reason) VALUES (?, ?, ?)",
                    [ip, 1, "Security system flagged this IP as malicious"],
                    function (err2) {
                        if (err2) console.error("DB error inserting IP:", err2);
                        console.log(`⚠️ New IP logged: ${ip} accessed ${req.url} (1/${threshold})`);
                        next();
                    }
                );
            } else {
                return next();
            }
            return;
        }

        // Already in banned list
        const banRecord = result[0];
        let newHits = banRecord.hits;

        if (!isHoneypot) {
            return next();
        }

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
