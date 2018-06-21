const passport = require('passport');

exports.login = passport.authenticate('local', {
    failureRedirect: '/Login',
    failureFlash:'Failed Login',
    successRedirect:'/',
    successFlash:'You are now logged in!'

});

exports.logout = (req,res) =>{
    req.logout();
    req.flash('success','successfully logged out!');
    res.redirect('/');
};

exports.isLoggedIn = (req,res,next) =>{
    //first check if user is authenticated
    if(req.isAuthenticated()){
        next();
        return;
    }
    req.flash('error', 'Opps you need to be logged in to do that');
    res.redirect('/login');
}
