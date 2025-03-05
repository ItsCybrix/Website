const checkAdmin = function(req, res, next){

    if(typeof res.locals.user != "undefined"){
        if(res.locals.user.level == "Owner" || res.locals.user.level == "Admin"){
            next()
        }else{
            res.redirect('/');
        }
    
    }else{
        res.redirect('/')
    }
}


module.exports = checkAdmin