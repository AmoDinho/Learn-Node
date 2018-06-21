const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/Login',
    failureFlash:'Failed Login',
    successRedirect:'/',
    successFlash:'You are now logged in!'

});