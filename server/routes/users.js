
const express = require('express');
const { validateInput, validateEmail } = require('../../src/validations/auth');
const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { isEmptyObj } = require('../../src/utilities/helper');

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
                                      email: email
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

            // facebook returned vars
            let { id, email, first_name, last_name } = profile._json;
            let fb_id = id;

            // in case something comes back undefined - string it up
            if (email === undefined){ email = ''; }
            if (first_name === undefined){ first_name = ''; }
            if (last_name === undefined){ last_name = ''; }

            let tAccessToken = '';
            if (accessToken){ tAccessToken = accessToken; }
            let tRefreshToken = '';
            if (refreshToken){ tRefreshToken = refreshToken; }

            // query to keep duplicates from happening in users
            // note: always get back fb_id,
            //       email from fb is optional (user might have logged in with phone #)
            let query = {};
            if (email){
                query = { where: {fb_id: fb_id}, orWhere: {email: email} }
            }else{
                query = { where: {fb_id: fb_id} }
            }

            User
            .query(query)
            .fetch()
            .then(
                user => {
                    if (user){

                        /*
                         Update user
                         fb_id or email were a match
                        */
                        console.log(user)

                        // Prefer local user data. If not user data try updating from fb
                        let tEmail = '';
                        if (user.attributes.email){
                            tEmail = user.email;
                        }else{
                            tEmail = email;
                        }
                        let tFirstName = '';
                        if (user.attributes.first_name){
                            tFirstName = user.first_name;
                        }else{
                            tFirstName = first_name;
                        }
                        let tLastName = '';
                        if (user.attributes.last_name){
                            tLastName = user.last_name;
                        }else{
                            tLastName = last_name;
                        }

                        User
                        // Save by where() then save()
                        // .forge()
                        // .where({ id: user.id })
                        // .save({
                        //     fb_id: fb_id,
                        //     email: tEmail,
                        //     first_name: tFirstName,
                        //     last_name: tLastName
                        // })
                        // OR.. Save by forge() directly
                        //      bookshelf looks at id and either inserts or updates record
                        //      or by whatever key is setup in model as index key, default is id
                        .forge({
                            id: user.id,
                            fb_id: parseInt(fb_id),
                            email: tEmail,
                            first_name: tFirstName,
                            last_name: tLastName
                        })
                        .save()
                        .then(user => {
                            let db_user = {
                                id: user.id,
                                fb_id: parseInt(fb_id),
                                email: tEmail,
                                fb_access_token: tAccessToken,
                                fb_refresh_token: tRefreshToken
                            }
                            return next(null, db_user);
                        });

                    }else{

                        /*
                         New User!
                         no fb_id or email match
                        */

                        // Generate a new password for this user
                        const password = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(-12);
                        const password_digest = bcrypt.hashSync(password, 10);

                        User
                        .forge({
                            fb_id: parseInt(fb_id),
                            email: email,
                            password_digest: password_digest,
                            first_name: first_name,
                            last_name: last_name
                        })
                        .save()
                        .then(user => {
                            let db_user = {
                                id: user.id,
                                fb_id: parseInt(fb_id),
                                email: email,
                                fb_access_token: tAccessToken,
                                fb_refresh_token: tRefreshToken
                            }
                            return next(null, db_user);
                        });
                    }
                }
            );
        }
    )
);

/*
 Authorize token
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/token', function(req, res) {
    const { token } = req.body;
    if (token){
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err){
                // Token did not validate - expired, didn't verify against secret or just invalid
                res.status(401).send();
            }else{
                User.query({
                    where: { id: decoded.id }
                })
                .fetch()
                .then(
                    user => {
                        if (user){
                            const { status } = user.attributes;
                            if (status == "Active"){
                                // User is active
                                res.status(200).send();
                            }else{
                                // User is not active
                                res.status(401).send();
                            }
                        }else{
                            // No user found at that id
                            res.status(401).send();
                        }
                    }
                );
            }
        });
    }else{
        // Token is required
        res.status(400).send();
    }
});

/*
 Authorize user a.k.a. login via Passport
 Note: validator crashes if email not sent (not a string error)
       therefore loading each variable succintly in order to avoid the error
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/login', function(req, res) {

    let email = req.body.email;
    let password = req.body.password;

    const { errors, isValid } = validateEmail({ email: email });
    if (isValid && password){
        User.query({
            where: { email: email }
        })
        .fetch()
        .then(
            user => {
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
                        res.status(200).send(token);
                    }else{
                        res.status(401).send();
                    }
                }else{
                    res.status(401).send();
                }
            }
        );
    }else{
        // HTTP 400 - Bad Request - Email invalid
        res.status(400).send();
    }
});

/*
 Forgot Password

  1. users enters email address, clicks forgot
  2. email is sent with link back to www.../login/password?jwt_token
     jwt_token includes email address, password update key and expiration date
  3. user enters new password, token and new password to /api/users/forgot/password
  200 or >200 back to authActions ...
  4. token is verified
         all is good: update password, clear token - flash message 'password udpated'
         not good: send back to /login

 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
function sendForgotLink(user){
    /*
     Send password update link
    */

    // variables
    const { email, password_update_key } = user;
    const origin = config.sv_scheme + '://' + config.sv_fqdn;
    const domain = config.sv_domain;
    const sitename = config.sv_sitename;

    // token-ize
    let payload = {
        email: email,
        password_update_key: password_update_key
    }
    let token = jwt.sign(payload, jwtOptions.secretOrKey, { expiresIn: '24h' });

    // message setup
    let mailOptions = {
        from: '"'+ sitename +' Messages" <messages@'+ domain +'>',
        to: email,
        subject: 'Password reset link',
        text: 'Go to: '+ origin +'/login/password?token=' + token + ' to change your password.',
        html: '<a href="'+ origin +'/login/password?token=' + token + '">Click here to change your password.</a>'
    };

    // send mail with defined transport object
    if (transporter){
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('transporter error:', error.message);
            }
        });
    }
}
function sendForgotSuccess(user){
    /*
     Message user that their password has been udpated
     ** not sending clear text password at this time - although you can I suppose
    */

    const { email } = user;
    const origin = config.sv_scheme + '://' + config.sv_fqdn;
    const domain = config.sv_domain;
    const sitename = config.sv_sitename;

    // message setup
    let mailOptions = {
        from: '"'+ sitename +' Messages" <messages@'+ domain +'>',
        to: email,
        subject: 'Your password has been updated',
        text: 'Your password has been updated',
        html: 'Your password has been updated'
    };

    // send mail with defined transport object
    if (transporter){
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log('transporter error:', error.message);
            }
        });
    }
}
router.post('/forgot', function(req, res) {

    let email = req.body.email;

    const { errors, isValid } = validateEmail({ email: email });
    if (isValid){
        User.query({
            where: { email: email }
        })
        .fetch()
        .then(
            user => {
                if (user){
                    if (user.attributes.password_update_key){
                        sendForgotLink({ email: email, password_update_key: user.attributes.password_update_key });
                    }else{
                        /*
                         password_update_key
                         used to track if user has updated their password. Once they update
                         this field will clear out. Otherwise the passed token will contain this key
                        */
                        const password_update_key = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(-12);
                        User
                        .forge(
                            { id: user.id, password_update_key: password_update_key }
                        )
                        .save()
                        .then(
                            user => {
                                sendForgotLink({ email: email, password_update_key: password_update_key });
                            }
                        );
                    }
                    res.status(200).send();
                }else{
                    // HTTP 401 - Unauthorized - Not registered
                    res.status(401).send();
                }
            }
        );
    }else{
        // HTTP 400 - Bad Request - Email invalid
        res.status(400).send();
    }
});
router.post('/forgot/password', function(req, res) {
    /*
     User entered new password and clicked submit (from React page)
     Verify token, find user and update password
    */

    let token = req.body.token;
    let password = req.body.password;

    if (token && password){
        jwt.verify(token, config.jwtSecret, (err, decoded) => {

            if (!err){

                // Token is valid - extract email
                let email = decoded.email;
                let password_update_key = decoded.password_update_key;

                // Match email and password_update_key
                // Note: matching password_update_key so this token is one time use only
                if (email && password_update_key){
                    User.query({
                        where: {
                            email: email,
                            password_update_key: password_update_key
                        }
                    })
                    .fetch()
                    .then(user => {
                        if (user){

                            const password_digest = bcrypt.hashSync(password, 10);

                            User
                            .forge({
                                id: user.id,
                                password_digest: password_digest,
                                password_update_key: ''
                            })
                            .save()
                            .then(user => {
                                // Notify user password has been changed
                                sendForgotSuccess({ email: email });
                            });

                            // HTTP 200 - Success - Everything went according to plan, kick your feet up
                            res.status(200).send();

                        }else{
                            // HTTP 401 - Unauthorized - User not found
                            res.status(401).send();
                        }
                    });
                }else{
                    // HTTP 400 - Bad Request - missing email or password update key
                    res.status(400).send();
                }
            }else{
                // HTTP 401 - Unauthorized - Invalid token
                res.status(401).send();
            }
        });
    }else{
        // HTTP 400 - Bad Request - Token & password required
        res.status(400).send();
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
router.post('/signup', function(req, res) {

    const { email, password, first_name, last_name } = req.body;

    const { errors, isValid } = validateInput({ email: email, password: password });
    if (isValid){
        User
        .where({ email: email })
        .fetch()
        .then(
            user => {
                if (user){
                    // HTTP 202 - Accepted - User is a duplicate
                    res.status(202).send();
                }else{
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
                    User.forge(
                        { email, password_digest, first_name, last_name },
                        { hasTimestamps: true }
                    )
                    .save()
                    .then(
                        user => {
                            res.status(200).send();
                        }
                    );
                }
            }
        );
    }else{
        // HTTP 400 - Bad Request - email or password screwed up
        res.status(400).send();
    }
});

module.exports = router;
