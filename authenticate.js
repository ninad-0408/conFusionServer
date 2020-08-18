const passport = require('passport');
const LocalStategy = require('passport-local').Strategy;
const User = require('./models/users');
const jwt = require('jsonwebtoken');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const config = require('./config');
const { NotExtended } = require('http-errors');

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
    User.findOne({_id: jwt_payload._id})
    .then((user) => {
        if(user!=null){
            return done(null,user);
        }
        else{
            return done(null,false);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
}));

exports.verifyAdmin = function(req, res, next) {
    if(req.user.admin==true)
    {
    return next();
    }
    else{
        var err = new Error("You are not admin to make this action.");
        err.status = 403;
        return next(err);
    }
}

exports.verifyUser = passport.authenticate('jwt', {session: false});