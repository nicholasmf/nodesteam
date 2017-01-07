var passport = require('passport');
var SteamStrategy = require('passport-steam').Strategy;

/*
passport.initialize();
passport.session();
*/

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (obj, done) {
    done(null, obj);
});

passport.use(new SteamStrategy({
    returnURL: 'http://hsdh.ddns.net/auth/steam/return',
    realm: 'http://hsdh.ddns.net/',
    apiKey: 'C65EF0F757498EEA88019EB8C970C4A1'
},
    function (identifier, profile, done) {
        // ascynchronous verification
        process.nextTick(function () {
            profile.identifier = identifier;
            //console.log(profile);
            return done(null, profile);
        });
    }
));

module.exports = function () {
    return passport;
};