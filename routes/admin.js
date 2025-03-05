const express = require('express')

const admin = express.Router()

admin.use(require('../middleware/checkAdmin'))

admin.get('/', (req, res) =>{
    res.render('./admin/index')
})

admin.get('/pages', (req, res)=>{
    res.send('page index')
})


module.exports = admin