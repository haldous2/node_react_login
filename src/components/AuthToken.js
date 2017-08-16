
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authToken } from '../actions/authActions';

class AuthToken extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.loadToken();
    }
    verifyToken(token){
        return this.props.authToken(token)
        .then(
            res => {
                return res;
            }
        );
    }
    loadToken(){
        /*
         If token passed via querystring (from facebook, google etc..)
         verify token and then log user in
        */
        var token = localStorage.getItem('jwtToken');
        if (token){
            this.verifyToken(token)
            .then(
                res => {
                    console.log('loadToken.res:', res);
                }
            );
        }
    }
    render(){
        return (
            <span></span>
        );
    }
}
AuthToken.propTypes = {
    authToken: PropTypes.func.isRequired
}

export default connect(null, { authToken })(AuthToken);
