const generateMCDCode = require('./Crypto')
var MCDCode = require('./Crypto')

function Globals(req, res, next) {

res.locals.MCDCode = generateMCDCode();

next();

}

module.exports = Globals