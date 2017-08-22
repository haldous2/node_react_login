
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import cookie from 'react-cookies';
import { authLogin, authLogout, authToken } from '../actions/authActions';
import { addFlashMessage } from '../actions/flashMessages';

class AuthToken extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            redirect_home: false
        };
    }
    onLoad(){
        /*
         If token passed via querystring (from facebook, google etc..)
         verify token and then log user in
        */
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        authToken(token)
        .then(
            res => {
                if (res === true){
                    this.props.authLogin(token);
                    this.props.addFlashMessage({
                        type: 'success',
                        text: 'You have successfully logged in! Welcome!'
                    });
                    this.setState({ redirect_home: true });
                }else{
                    /*
                     Load from cookie.jwt or localStorage
                    */
                    // let token = localStorage.getItem('jwtToken');
                    const token = cookie.load('jwt');
                    authToken(token)
                    .then(
                        res => {
                            if (res === true){
                                this.props.authLogin(token);
                            }else{
                                this.props.authLogout();
                            }
                        }
                    );
                }
            }
        );
    }
    componentWillMount(){
        this.onLoad();
    }
    render(){
        const { redirect_home } = this.state;
        if (redirect_home) {
            return (
                <Redirect to='/' />
            )
        }
        return ( null );
    }
}
AuthToken.propTypes = {
    authLogin: PropTypes.func.isRequired,
    authLogout: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { authLogin, authLogout, addFlashMessage })(AuthToken);
