
/*
 Server side route protection
 Middleware for jwt token authentication in ajax requests
*/

const config = require('../config');
const jwt = require('jsonwebtoken');

module.exports = function(req, res, next){

    // axios header addition
    const authorizationHeader = req.headers['authorization'];
    let token;

    if (authorizationHeader){
        // 'Bearer 123abcjwt-token' - split by space
        token = authorizationHeader.split(' ')[1];
    }

    if (token){
        // jwt.verify(token, secretOrPublicKey, [options, callback])
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err){
                // 401 - Unauthorized
                res.status(401).json({ error: 'Failed to authenticate'});
            }else{
                // Just grab user id
                req.userId = decoded.id;
                next();
                // **optional - Lookup user - fall back to verify user exists and isn't blacklisted
                // User.query({
                //     where: { id: decoded.id },
                //     select: [ 'id', 'email', 'first_name', 'last_name']
                // }).fetch().then(user => {
                //     if (!user){
                //         // 404 - Not found
                //         res.status(404).json({ error: 'Invalid user' });
                //     }else{
                //         req.currentUser = user;
                //         next();
                //     }
                // });
            }
        });
    }else{
        // 403 - forbidden
        res.status(403).json({ error: 'No token provided' });
    }
}
