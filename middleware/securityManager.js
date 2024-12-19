const securityManager = function (req, res, next) {

    const db = require('../lib/dbConnector')



    if(req.url.startsWith('/wp')){
        //console.log(req.ip)
        res.status(401)
        res.send('BACKDOOR ATTEMPT DETECTED! Your IP is now blacklisted')
        console.log('[ SECURITY ] An IP was blacklisted for a security violation!')


        db.query('INSERT INTO ip_blacklist (ip, reason) VALUES (?,?)', [req.ip, 'Backdoor attack attempted'], (err, result) => {
            if(err) throw err;

        })

        
    }else{
        db.query("SELECT * FROM ip_blacklist where ip=? LIMIT 1", [req.ip], (err, result) => {
            if(err) throw err;

            if (result.length >0){
                res.status(403)
                res.send('You\'ve been blocked from accessing this site! Reason: ' + result[0].reason )
                console.log(result)
            }else{

            }


        })
    }





}

module.exports = securityManager