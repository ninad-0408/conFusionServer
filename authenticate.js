const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const User = require('./models/users');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');

exports.local = passport.use(new LocalStategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

exports.getToken = function(user) {
    return jwt.sign(user, config.secretKey, {
        expiresIn: 3600
    });
};

var opts ={};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = config.secretKey;

exports.jwtPassport = passport.use(new JwtStrategy(opts, (jwt_payload, done)=> {
    console.log(jwt_payload);
    User.findOne({id: jwt_payload.sub}, (err, user) => {
        if(err){
            return done(err, false);
        }
        else if(user){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    })
}));

exports.verifyUser = passport.authenticate('jwt', {session: false});