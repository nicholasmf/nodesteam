var express = require('express');
var passport = require('passport');
var router = express.Router();

router.get('/', function (req, res, next) {
    res.render('index.ejs');
});

router.get('/auth/steam/',
    passport.authenticate('steam', {failureRedirect: '/'}),
    function (req, res) {

});

router.get('/auth/steam/return',
    passport.authenticate('steam', { failureRedirect: '/' }),
    function (req, res) {
        console.log(req.user);
        res.redirect('/');
});

module.exports = router;