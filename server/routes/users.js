
const express = require('express');
const { validateCredentials, validateEmail, validatePassword } = require('../../src/validations/auth');
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
 Custom middleware stuff - protecting server routes
*/
const authenticate = require('../middleware/authenticate');

/*
 Return user data
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/getprofile', authenticate, function(req, res) {
    res.status(200).json(req.myprofile);
});

/*
 Authorize token
 ////////////////////////////////////////////////////////////////////////////////////////////////////
*/
router.post('/token', authenticate, function(req, res) {
    res.status(200).send();
});

/*
 Authorize user a.k.a. login
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
                        let token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });
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
    let token = jwt.sign(payload, config.jwtSecret, { expiresIn: '24h' });

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
     Note: this token is specific to updating password, different than login token
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
 Route authentication middleware via passport
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 /secret_auth - custom authentication middleware
*/
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

    const { errors, isValid } = validateCredentials({ email: email, password: password });
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

/*
 My Profile
 ////////////////////////////////////////////////////////////////////////////////////////////////////
 update email, password and other profile info
*/
router.post('/myemail', authenticate, function(req, res) {
    const { newemail } = req.body;
    const { id, password_match } = req.myprofile;
    if (password_match){
        const { errors, isValid } = validateEmail({ email: newemail });
        if (isValid){
            // Everything is a-ok
            // Look for dups then update
            User.query({
                where: { email: newemail }
            })
            .fetch()
            .then(
                user => {
                    if (user){
                        // 409:Conflict - Email already exists OR (new email same as current)
                        res.status(409).send()
                    }else{
                        // Update the emailz!
                        User
                        .forge({ id: id })
                        .save({ email: newemail })
                        .then(
                            user => {
                                res.status(200).send();
                            }
                        );
                    }
                }
            );
        }else{
            // 400:Bad Request - Invalid email address
            res.status(400).send();
        }
    }else{
        // 401:Unauthorized - Invalid password
        res.status(401).send();
    }
});
router.post('/mypassword', authenticate, function(req, res) {
    const { newpassword } = req.body;
    const { id, password_match } = req.myprofile;
    if (password_match){
        const { errors, isValid } = validatePassword({ password: newpassword });
        if (isValid){
            // Update the passwordz!
            const password_digest = bcrypt.hashSync(newpassword, 10);
            User
            .forge({ id: id })
            .save({ password_digest: password_digest })
            .then(
                user => {
                    res.status(200).send();
                }
            );
        }else{
            // 400:Bad Request - Invalid new password
            res.status(400).send();
        }
    }else{
        // 401:Unauthorized - Invalid password
        res.status(401).send();
    }
});
router.post('/myprofile', authenticate, function(req, res) {
    const { first_name, last_name } = req.body;
    const { id } = req.myprofile;
    User
    .forge({ id: id })
    .save({
        first_name: first_name,
        last_name: last_name
    })
    .then(
        user => {
            res.status(200).send();
        }
    );
});

module.exports = router;
