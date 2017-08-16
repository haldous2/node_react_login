
const express = require('express');
const { validateInput, validateEmail } = require('../../src/validations/auth');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

let router = express.Router();

/*
 Mailer
*/
const transporter = require('../mailer');

/*
 Custome middleware stuff
 Note: use this or passport jwt
*/
const authenticate = require('../middleware/authenticate');

/*
 Passport middleware stuff
*/
const passport = require("passport");
const passportJWT = require("passport-jwt");
const passportFacebook = require('passport-facebook');

router.use(passport.initialize());

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;
var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();
jwtOptions.secretOrKey = config.jwtSecret;
passport.use(
    new JwtStrategy(
        jwtOptions, function(jwt_payload, next) {
            // **optional - Lookup user - fall back to verify user exists and isn't blacklisted
            User.query({
                where: { id: jwt_payload.id }
            }).fetch().then(user => {
                if (user){
                    const { id, email, first_name, last_name } = user.attributes;
                    const objUser = { id: id,
                                      email: email,
                                      first_name: first_name,
                                      last_name: last_name
                                    };
                    next('message', objUser);
                }else{
                    next(null, false);
                }
            });
        }
    )
);

/*
 Removed: profileFields: ['id', 'birthday', 'email', 'first_name', 'last_name']
 Note: basic profile returned **no scope, profileFields
       Not alot shared.. just displayName and id
       user: {
            id: '0000000000',
            username: undefined,
            displayName: 'John Doe',
            name: {
                 familyName: undefined,
                 givenName: undefined,
                 middleName: undefined },
            gender: undefined,
            profileUrl: undefined,
            provider: 'facebook',
            _raw: '{"name":"John Doe","id":"0000000000"}',
            _json: { name: 'John Doe', id: '0000000000' }
        }

*/
var FacebookStrategy = passportFacebook.Strategy;
passport.use(
    new FacebookStrategy(
        {
            clientID: config.fb_app_id,
            clientSecret: config.fb_app_secret,
            callbackURL: "/api/users/facebook/callback",
            profileFields: ['email', 'first_name', 'last_name']
        },
        function(accessToken, refreshToken, profile, next) {

            let { id, email, first_name, last_name } = profile._json;
            let db_user = {};

            let query = {};
            if (email){
                query = {where: {email: email}, orWhere: {fb_id: id}}
            }else{
                query = {where: {fb_id: id}}
            }

            User
            .query(query)
            .fetch()
            .then((user)=>{
                if (user){
                    // Update user - id or email match
                    let tEmail;
                    if (user.email){
                        tEmail = user.email;
                    }else{
                        tEmail = email;
                    }
                    User
                    .forge({ id: user.id, fb_id: id, email: tEmail, first_name: first_name, last_name: last_name })
                    .save()
                    .then(user => { db_user = user; })
                    .catch(err => { console.log('error: ', err.message); });
                }else{
                    // New user - no id or email match
                    User
                    .forge({ fb_id: id, email: email, first_name: first_name, last_name: last_name })
                    .save()
                    .then(user => { db_user = user; })
                    .catch(err => { console.log('error: ', err.message); });
                }
             });

             return next(null, {
                 id: db_user.id,
                 fb_id: db_user.fb_id,
                 email: db_user.email,
                 fb_access_token: accessToken,
                 fb_refresh_token: refreshToken,
                 first_name: db_user.first_name,
                 last_name: db_user.last_name
             });
        }
    )
);

router.get('/', function(req, res){
    res.status(200).json( 'you have arrived @ api/users' );
});

/*
 Look for a duplicate email address in db
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/

router.get('/email/:identifier', function(req, res) {

    const identifier = req.params.identifier;
    const { errors, isValid } = validateEmail({ email: identifier });

    if (isValid){
        User
        .where({
            email: identifier
        })
        .fetch()
        .then(user => {
            if (user){
                res.status(400).json({ errors: 'Email already exists' });
            }else{
                // User not found - this is good! - clear the error
                res.status(200).json({ errors: '' });
            }
        });
    }else{
        res.status(400).json({ errors: 'Not an email address', identifier });
    }
});

/*
 Authorize token
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/token', function(req, res) {
    const { token } = req.body;
    if (token){
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err){
                res.status(401).json({ error: 'Failed to authenticate'});
            }else{
                res.status(200).json({ successs: 'Token is valid' });
            }
        });
    }else{
        res.status(403).json({ error: 'No token provided' });
    }
});

/*
 Authorize user a.k.a. login via Passport
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/login', function(req, res) {
    const { email, password } = req.body;
    User.query({
        where: { email: email }
    }).fetch().then(user => {
        if (user){
            // Verify password
            if (bcrypt.compareSync(password, user.get('password_digest'))){
                let payload = {
                    id: user.get('id'),
                    fb_id: '',
                    email: user.get('email'),
                    fb_access_token: '',
                    fb_refresh_token: ''
                }
                let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '24h' });
                res.status(200).json({ token });
            }else{
                res.status(401).json({ form: 'Invalid credentials' });
            }
        }else{
            // HTTP 401 - Unauthorized
            res.status(401).json({ form: 'Invalid credentials' });
        }
    });
});

/*
 Forgot Password
 Lookup user, send password.
 If password not set (FB logged in before), generate password and send that
 If user not found, send error back
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
function sendForgot(user){

    if (typeof(user) != 'object' || !user.id){
        return
    }

    // generate new password and digest
    const new_password = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(-12);
    const password_digest = bcrypt.hashSync(new_password, 10);

    // udpate user
    User
    .forge({ id: user.id, password_digest: password_digest })
    .save()
    .then(user => { })
    .catch(err => { console.log('error: ', err.message); });

    // setup email data with unicode symbols
    let mailOptions = {
        from: 'messages@n2local.com',
        to: user.attributes.email,
        subject: 'Your password',
        text: 'Your password is ' + new_password,
        html: 'Your password is <b>' + new_password + '</b>'
    };

    // send mail with defined transport object
    if (transporter){
        transporter.sendMail(mailOptions, (error, info) => {
            //if (error) { console.log('sendMail error:', error); }
            //console.log('Message %s sent: %s', info.messageId, info.response);
        });
    }
}
router.post('/forgot', function(req, res) {
    const { email } = req.body;
    const { errors, isValid } = validateEmail({ email: email });
    if (isValid){
        User.query({
            where: { email: email }
        }).fetch().then(user => {
            if (user){
                /*
                 User found
                 if password - send password
                 if not password - generate one and send
                */
                sendForgot(user);
                res.status(200).json({ message: 'Password has been sent!' });
            }else{
                // HTTP 401 - Unauthorized
                res.status(401).json({ message: 'Not registered' });
            }
        });
    }else{
        // HTTP 400 - Bad Request
        res.status(400).json({ message: 'Not an email address' });
    }
});

/*
 Facebook login routes
 ////////////////////////////////////////////////////////////////////////////////////////////////////

 Note: additional scope 'permissions' causes the fb redirect to force user to click 'allow'
       info: https://developers.facebook.com/docs/facebook-login/permissions
       otherwise it just passed the fb id back with no user interaction

 Note: user_birthday requires additional approval from facebook via the sdk

 Note: To capture errors from fb api via strategy
       use two overloaded functions to capture errors and user info

 Note: On callback in config for 'failureRedirect' - called when user cancels request

 Note: new kink - fighting cors - doesn't appear that callback can be async
*/
router.get(
    '/facebook',
    passport.authenticate(
        'facebook',
        { session: false, scope: ['email'] }
    )
);

router.get(
    '/facebook/callback',
    passport.authenticate(
        'facebook',
        { session: false, failureRedirect: '/login' }
    ),
    function (req, res, next){
        let payload = {
            id: req.user.id,
            fb_id: req.user.fb_id,
            email: req.user.email,
            fb_access_token: req.user.fb_access_token,
            fb_refresh_token: req.user.fb_refresh_token
        }
        let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '24h' });
        res.redirect("/login?token=" + token);
    },
    function (err, req, res, next) {
        res.redirect("/login");
    }
);

/*
 Route authentication middleware via passport
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 /secret - passport using jwt
 /secret_auth - custom authentication middleware
*/
router.get(
    "/secret",
    passport.authenticate(
        'jwt',
        { session: false }
    ),
    function(req, res){
        let { id, email, first_name, last_name } = req.user;
        res.status(200).json({ success: 'Success! You can not see this without a token user:' + id + ' ' + email });
    }
);
router.get('/secret_auth_custom', authenticate, function(req, res){
    res.status(200).json({ success: 'JWT verified by custom middleware' });
});

/*
 Post new user to database
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 look for duplicates first of course
*/
function validateInputPromise(data){
    return new Promise((valid, invalid) => {
        let { errors } = validateInput(data);
        valid({ errors, isValid: isEmpty(errors) });
    });
}
function validateData(data){
    return validateInputPromise(data)
    .then(({ errors, isValid }) => {
        if (isValid) {
            return User.where({
                email: data.email
            }).fetch().then(user => {
                if (user) {
                    errors.email = 'There is already a user with this email';
                }
                return {
                    errors,
                    isValid: isEmpty(errors)
                };
            });
        }
    });
}
function isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

router.post('/', function(req, res) {

    validateData(req.body)

    .then(({ errors, isValid }) => {

        if (isValid){

            const { email, password, first_name, last_name } = req.body;
            const password_digest = bcrypt.hashSync(password, 10);

            /*
            bookshelf.model.forge: A simple helper function to instantiate a new Model without needing new.
                [attributes] Object                 ## initial values e.g. first_name, last_name etc... (order ??)
                [options] Object
                    [tableName] string              ## Initial value for tableName.
                    [hasTimestamps=false] boolean   ## Initial value for hasTimestamps.
                    [parse=false] boolean           ## Convert attributes by parse before being set on the model.
                .save()                             ## Returns promise for .then, .catch

            */
            User.forge({
                email, password_digest, first_name, last_name
            },{ hasTimestamps: true }).save()
            .then(user => res.status(200).json({ success: true }))
            .catch(err => res.status(400).json({ errors: err }));

        }else{
            res.status(400).json({ errors: errors });
        }
    });
});

module.exports = router;
