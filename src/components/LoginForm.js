
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validateCredentials, validateEmail } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { authSession, authLogin, initAuthToken, authCredentials, forgotPassword } from '../actions/authActions';
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
        this.onForgotPassword = this.onForgotPassword.bind(this);
    }
    onChange(e){
        this.setState({ [e.target.name]: e.target.value });
    }
    isValidCredentials(){
        const { errors, isValid } = validateCredentials(this.state);
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
        /*
         Appears to be a bug with autofill + chrome + ios. no work arounds I can find
        */
        e.preventDefault();
        this.isValidCredentials()
        .then(
            (isValid) => {
                if (isValid){
                    this.setState({ errors: {}, isLoading: true });
                    authCredentials({ email: this.state.email, password: this.state.password})
                    .then(
                        res => {
                            this.props.authSession(true, {});
                            authLogin(res.data);
                            this.props.addFlashMessage({
                                type: 'success',
                                text: 'You have successfully logged in! Welcome!'
                            });
                            this.setState({
                                redirect_home: true
                            });
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
    onLoadToken(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        console.log('LoginForm token:', token);
        initAuthToken(token)
        .then(
            res => {
                if (res === true){
                    authLogin(token);
                    this.props.authSession(true, {});
                    this.props.addFlashMessage({
                        type: 'success',
                        text: 'You have successfully logged in! Welcome!'
                    });
                    this.setState({
                        redirect_home: true
                    });
                }
            }
        )
    }
    componentWillMount(){
        this.onLoadToken();
    }
    render(){
        const { errors, success, redirect_home } = this.state;
        if (redirect_home) {
            return (
                <Redirect to='/' />
            )
        }
        return (
            <form>
                <h1>Login!</h1>

                { success.form && <div className="alert alert-success">{success.form}</div>}
                { errors.form && <div className="alert alert-danger">{errors.form}</div>}

                <InputField
                    reference={ input => { this.inputEmail = input }}
                    field="email"
                    value={this.state.email}
                    type="email"
                    label="Email"
                    onChange={this.onChange}
                    error={errors.email}
                />

                <InputField
                    reference={ input => { this.inputPassword = input }}
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

            </form>
        );
    }
}
LoginForm.propTypes = {
    authSession: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { authSession, addFlashMessage } )(LoginForm);
