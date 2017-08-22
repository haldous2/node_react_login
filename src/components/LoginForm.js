
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

//import Validator from 'validator';
import { validateInput, validateEmail } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { authLogin, authCredentials, forgotPassword } from '../actions/authActions';
import { addFlashMessage } from '../actions/flashMessages';

class LoginForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            errors: {
                form: '',
                email: '',
                password: ''
            },
            success: {
                form: ''
            },
            redirect_home: false,
            isLoading: false
        }
        /* either bind onChange here or for onClick in input element -- in constructor preferred */
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onLoginFacebook = this.onLoginFacebook.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
    }
    isEmpty(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }
    onChange(e){
        // this.setState({ username: e.target.value });
        this.setState({ [e.target.name]: e.target.value });
    }
    isValid(){
        const { errors } = validateInput(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(this.isEmpty(errors));
        });
    }
    isValidEmail(){
        const { errors } = validateEmail(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(this.isEmpty(errors));
        });
    }
    onSubmit(e){
        e.preventDefault();

        this.isValid()
        .then(
            (isValid) => {
                if (isValid){
                    this.setState({ errors: {}, isLoading: true });
                    authCredentials(this.state)
                    .then(
                        res => {
                            if (res.success){
                                this.props.authLogin(res.success.token);
                                this.props.addFlashMessage({
                                    type: 'success',
                                    text: 'You have successfully logged in! Welcome!'
                                });
                                this.setState({ isLoading: false, redirect_home: true });
                            }
                            if (res.error){
                                this.setState({ isLoading: false, errors: res.error });
                            }
                        }
                    );
                }
            }
        );
    }
    onLoginFacebook(e){
        e.preventDefault();
        // Redirect doesn't load node api - is it viewing history ?
        //this.setState({ redirect_login_facebook: true });
        // This works - bypass history I suppose
        window.location = '/api/users/facebook';
    }
    onForgotPassword(e){
        e.preventDefault();

        let errors = {};
        let success = {};

        this.isValidEmail()
        .then(
            isValid => {
                if (isValid){

                    forgotPassword(this.state.email)
                    .then(
                        res => {
                            if (res.success){
                                errors = { form: '' };
                                success = { form: res.success };
                                this.setState({ errors: errors, success: success });
                            }
                            if (res.error){
                                errors = { form: res.error };
                                success = { form: '' };
                                this.setState({ errors: errors, success: success });
                            }
                        }
                    );
                }
            }
        );
    }
    render(){

        const { errors, success, redirect_home } = this.state;

        if (redirect_home) {
            return (
                <Redirect to='/' />
            )
        }
        return (
            <div className="row">

                <form>

                    <h1>Login!</h1>

                    { success.form && <div className="alert alert-success">{success.form}</div>}
                    { errors.form && <div className="alert alert-danger">{errors.form}</div>}

                    <InputField
                        field="email"
                        value={this.state.email}
                        type="text"
                        label="Email"
                        onChange={this.onChange}
                        onBlur={this.onBlurEmail}
                        error={errors.email}
                    />

                    <InputField
                        field="password"
                        value={this.state.password}
                        type="password"
                        label="Password"
                        onChange={this.onChange}
                        error={errors.password}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary btn-block btn-lg">
                            Log In
                        </button>
                    </div>

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onForgotPassword} className="btn btn-info btn-block btn-lg">
                            Forgot Password
                        </button>
                    </div>

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onLoginFacebook} className="btn btn-outline-primary btn-block btn-lg">
                            Log in with Facebook
                        </button>
                    </div>

                </form>
            </div>
        );
    }
}
LoginForm.propTypes = {
    authLogin: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { authLogin, addFlashMessage } )(LoginForm);
