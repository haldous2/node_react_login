
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
            redirect_home: false,
            redirect_login: false
        };
    }
    onLoadToken(){
        /*
         Token via querystring.
         Checking pathname as the login token will only be sent to /login
        */
        let token = '';
        if (this.props.location.pathname === '/login'){
            const search = this.props.location.search;
            const params = new URLSearchParams(search);
            token = params.get('token');
        }
        if (token){
            authToken(token)
            .then(
                res => {
                    this.props.authLogin(token);
                    this.props.addFlashMessage({
                        type: 'success',
                        text: 'You have successfully logged in! Welcome!'
                    });
                    this.setState({ redirect_home: true });
                },
                err => {
                    this.props.authLogout();
                    this.setState({ redirect_login: true });
                }
            );
        }else{
            this.onLoadLocal();
        }
    }
    onLoadLocal(){
        /*
         Token from cookie OR localStorage - depending on how you store
        */
        // let token = localStorage.getItem('jwtToken');
        const token = cookie.load('jwt');
        if (token){
            authToken(token)
            .then(
                res => {
                    this.props.authLogin(token);
                },
                err => {
                    this.props.authLogout();
                }
            );
        }else{
            this.props.authLogout();
        }
    }
    componentWillMount(){
        this.onLoadToken();
    }
    render(){
        const { redirect_home, redirect_login } = this.state;
        if (redirect_home) {
            return (
                <Redirect to='/' />
            )
        }
        if (redirect_login) {
            return (
                <Redirect to='/login' />
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
