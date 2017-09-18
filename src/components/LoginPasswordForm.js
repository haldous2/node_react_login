
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validatePassword } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { authPassword } from '../actions/authActions';
import { addFlashMessage } from '../actions/flashMessages';

class LoginPasswordForm extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            password: '',
            errors: {
                password: '',
                form: ''
            },
            success: {
                form: ''
            },
            isLoading: false
        }

        /*
         Token checker
         This formerly lived @ componentWillMount - FB docs recommend will mount stuff
         live in constructor.
        */
        this.token = '';
        this.onLoadToken();

        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onInput(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    onChange(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    isValidPassword(){
        const { errors, isValid } = validatePassword(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(isValid);
        });
    }
    onSubmit(e){
        e.preventDefault();

        this.setState({
            password: this.inputPassword.value
        }, function(){
            this.isValidPassword()
            .then(
                (isValid) => {
                    if (isValid){
                        this.setState({ errors: {}, isLoading: true });
                        authPassword(this.token, this.state.password)
                        .then(
                            res => {
                                this.props.addFlashMessage({
                                    type: 'success',
                                    text: 'Your password has been updated!'
                                });
                                this.setState({ isLoading: false });
                                this.props.history.push('/login');
                            },
                            err => {
                                this.props.history.push('/login');
                            }
                        );
                    }
                }
            );
        });
    }
    onLoadToken(){
        let token = '';
        console.log('LoginPasswordForm.location:', this.props.location);
        if (this.props.location.pathname === '/login/password'){
            const search = this.props.location.search;
            const params = new URLSearchParams(search);
            token = params.get('token');
        }
        if (token){
            this.token = token;
        }else{
            // get out of here! - missing token!
            this.props.history.push('/login');
        }
    }

    render(){

        const { errors, success } = this.state;

        return (
            <form>

                <h1>Change Password</h1>

                { success.form && <div className="alert alert-success">{success.form}</div>}
                { errors.form && <div className="alert alert-danger">{errors.form}</div>}

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
                        Update Password
                    </button>
                </div>

            </form>
        );
    }
}
LoginPasswordForm.propTypes = {
    authPassword: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { authPassword, addFlashMessage } )(LoginPasswordForm);
