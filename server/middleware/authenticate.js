
/*
 Server side route protection
 Middleware for jwt token authentication in ajax requests
*/

const bcrypt = require('bcrypt');
const config = require('../config');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = function(req, res, next){

    //console.log('middleware.authenticate');

    let myprofile = {};

    /*
     instead of duplicating work, including a password check here for
     fn's that need to validate a password after authorization
     This is a non-blocking method that returns null, true or false
     when password_match equals...
          null  - password not passed
          true  - password passed and is correct
          false - password passed and is not correct
    */
    const { password } = req.body;
    let password_match = null;

    /*
     Token - look at authorization and request headers
    */
    let token = '';
    const authorizationHeader = req.headers['authorization'];
    if (authorizationHeader){
        // token from authorization header
        // 'Bearer 123abcjwt-token' - split by space
        token = authorizationHeader.split(' ')[1];
    }else{
        // Now let's try request headers
        token = req.body.token;
    }

    // if (token){
    //     console.log('middleware.authenticate.token:', token.substring(0,10), '...', token.substring(token.length - 10, token.length));
    // }

    // load user data from token.user.id
    if (token){
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err){
                // token error
                console.log('middleware.authenticate: token error:', err);
                res.status(401).send();
            }else{
                User.query({
                    where: { id: decoded.id },
                    select: [ 'id', 'email', 'status', 'password_digest', 'first_name', 'last_name' ]
                })
                .fetch()
                .then(
                    user => {
                        if (user){
                            const {
                                id,
                                email,
                                status,
                                password_digest,
                                first_name,
                                last_name
                            } = user.attributes;
                            if (status == "Active"){
                                // Password validator for 'myprofile' and other such things for the future ?
                                if (password){
                                    if (bcrypt.compareSync(password, password_digest)){
                                        password_match = true;
                                    }else{
                                        password_match = false;
                                    }
                                }
                                myprofile = {
                                    id: id,
                                    email: email,
                                    password_match: password_match,
                                    first_name: first_name,
                                    last_name: last_name
                                }
                                req.myprofile = myprofile;
                                next();
                            }else{
                                // Status not Active
                                console.log('middleware.authenticate: user.status Inactive');
                                res.status(401).send();
                            }
                        }else{
                            // User not found
                            console.log('middleware.authenticate: User not found');
                            res.status(401).send();
                        }
                    }
                );
            }
        });
    }else{
        // missing token
        console.log('middleware.authenticate: Missing token');
        res.status(401).send();
    }
}
