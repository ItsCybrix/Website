const errorHandler = function(err, req, res, next){
    if(err){
        throw new Error(err)
    }
}

module.exports = errorHandler