
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
    onChange(e){
        // this.setState({ username: e.target.value });
        this.setState({ [e.target.name]: e.target.value });
    }
    isValidInput(){
        const { errors, isValid } = validateInput(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(isValid);
        });
    }
    isValidEmail(){
        const { errors, isValid } = validateEmail(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(isValid);
        });
    }
    onSubmit(e){
        e.preventDefault();
        this.isValidInput()
        .then(
            (isValid) => {
                if (isValid){
                    this.setState({ errors: {}, isLoading: true });
                    authCredentials(this.state)
                    .then(
                        res => {
                            this.props.authLogin(res.data);
                            this.props.addFlashMessage({
                                type: 'success',
                                text: 'You have successfully logged in! Welcome!'
                            });
                            this.setState({ isLoading: false, errors: { form: ''}, redirect_home: true });
                        },
                        err => {
                            if (err.response.status === 400){
                                // This shouldn't happen
                                this.setState({ isLoading: false, errors: { form: 'Invalid Input'} });
                            }
                            if (err.response.status === 401){
                                this.setState({ isLoading: false, errors: { form: 'Invalid Credentials'} });
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
        this.isValidEmail()
        .then(
            isValid => {
                if (isValid){
                    forgotPassword(this.state.email)
                    .then(
                        res => {
                            this.setState({
                                errors: { email: '' },
                                success: { form: 'Password reset link has been sent!' }
                            });
                        },
                        err => {
                            if (err.response.status === 400){
                                this.setState({
                                    errors: { email: 'Email is not valid' },
                                    success: { form: '' }
                                });
                            }
                            if (err.response.status === 401){
                                this.setState({
                                    errors: { email: 'Email is not registered' },
                                    success: { form: '' }
                                });
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
