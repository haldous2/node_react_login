
import React from 'react';
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
            isAuthenticated: null,
            isLoading: false
        }
        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onForgotPassword = this.onForgotPassword.bind(this);
    }
    onInput(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
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
        e.preventDefault();

        /*
         Appears to be a bug with autofill + chrome + ios. (maybe more? haven't tested...)
           onChange isn't fired consistently when autofilled.
           work-around - setState from <input> 'refs' values via onSubmit
        */

        this.setState({
            email: this.inputEmail.value,
            password: this.inputPassword.value
        }, function(){

            this.isValidCredentials()
            .then(
                (isValid) => {
                    if (isValid){
                        this.setState({ errors: {}, isLoading: true });
                        authCredentials({ email: this.state.email, password: this.state.password })
                        .then(
                            res => {
                                authLogin(res.data);
                                this.props.addFlashMessage({
                                    type: 'success',
                                    text: 'You have successfully logged in! Welcome!'
                                });
                                this.props.authSession(true, {});
                                /* Redirecting via utilities/requireNoAuth */
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
        });
    }
    onForgotPassword(e){
        e.preventDefault();

        this.setState({ email: this.inputEmail.value, password: this.inputPassword.value }, function(){
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
        });
    }
    onLoadToken(){
        const search = this.props.location.search;
        const params = new URLSearchParams(search);
        const token = params.get('token');
        initAuthToken(token)
        .then(
            res => {
                if (res === true){
                    authLogin(token);
                    this.props.addFlashMessage({
                        type: 'success',
                        text: 'You have successfully logged in! Welcome!'
                    });
                    this.props.authSession(true, {});
                    /* Redirecting via utilities/requireNoAuth */
                }
            }
        )
    }
    // componentDidMount(){
    //     // Note: when redirected from requireauth, props not updated (which is why we are checking here)
    //     if (this.props.isAuthenticated === false){
    //        this.setState({ isAuthenticated: false });
    //     }
    // }
    // componentWillReceiveProps(nextProps){
    //     /*
    //      LoginForm lives between authorized and not authorized
    //       ( Setup as higher-order component or not.. not sure yet )
    //       Note: ReceiveProps fired off any time redux updated. e.g., addFlashMessage & authSession
    //       Set state.isAuthenticated false to keep login page from displaying for a millisecond
    //         while we wait for props to be received from redux.store.session.isAuthenticated
    //       Redirect if redux.store.session.isAuthenticated is true!
    //     */
    //     if (nextProps.isAuthenticated === false){
    //        this.setState({ isAuthenticated: false });
    //     }
    //     if (nextProps.isAuthenticated === true){
    //         this.props.history.push('/');
    //     }
    // }

    render(){
        const { errors, success } = this.state;
        // if (this.state.isAuthenticated === false){
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
                        onInput={this.onInput}
                        error={errors.email}
                    />

                    <InputField
                        reference={ input => { this.inputPassword = input }}
                        field="password"
                        value={this.state.password}
                        type="password"
                        label="Password"
                        onInput={this.onInput}
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
        // }else{
        //     return(null);
        // }
    }
}
LoginForm.propTypes = {
    authSession: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
// function mapStateToProps(state){
//     return {
//         isAuthenticated: state.sessionData.isAuthenticated
//     }
// }
export default connect(null, { authSession, addFlashMessage } )(LoginForm);
