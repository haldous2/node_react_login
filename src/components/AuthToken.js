
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
                    this.props.authLogout();
                    this.setState({ redirect_login: true });
                }
            }
        )
        .catch(
            err => {
                /*
                 No token passed in querystring - let's try read a cookie
                */
                this.onLoadLocal();
            }
        );
    }
    onLoadLocal(){
        /*
         Load from cookie.jwt or localStorage - depending on how you store
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
        )
        .catch(
            err => {
                /*
                 Need to authLogout in order to set isAuthenticated to false for
                 navigationBar and other stuff reading the store
                */
                this.props.authLogout();
            }
        );
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
