const express = require('express');

const router = express.Router();


router.get('/', (req, res) => {
    res.render('route-views/main')
})

router.get('/about', (req, res) => {
    res.render('route-views/about')
})


router.get('/general-status', (req, res) => {
    res.render('route-views/general-status')
})

router.get('*', (req, res) => {
    res.render('route-views/404')
})


module.exports = router
