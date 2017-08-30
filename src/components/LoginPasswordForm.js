
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validatePassword } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { authPassword } from '../actions/authActions';
import { addFlashMessage } from '../actions/flashMessages';

class LoginPasswordForm extends React.Component {
    constructor(props){
        super(props);
        this.token = '';
        this.state = {
            password: '',
            errors: {
                password: '',
                form: ''
            },
            success: {
                form: ''
            },
            redirect_login: false,
            isLoading: false
        }
        /* either bind onChange here or for onClick in input element -- in constructor preferred */
        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    onChange(e){
        // this.setState({ username: e.target.value });
        this.setState({ [e.target.name]: e.target.value });
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
                            this.setState({ isLoading: false, redirect_login: true });
                        },
                        err => {
                            this.setState({ redirect_login: true });
                        }
                    );
                }
            }
        );
    }
    onLoadToken(){
        let token = '';
        if (this.props.location.pathname === '/login/password'){
            const search = this.props.location.search;
            const params = new URLSearchParams(search);
            token = params.get('token');
        }
        if (token){
            this.token = token;
        }else{
            // get out of here! - missing token!
            this.setState({ redirect_login: true });
        }
    }
    componentWillMount(){
        this.onLoadToken();
    }
    render(){

        const { errors, success, redirect_login } = this.state;

        if (redirect_login) {
            return (
                <Redirect to='/login' />
            )
        }
        return (
            <div className="row">

                <form>

                    <h1>Change Password</h1>

                    { success.form && <div className="alert alert-success">{success.form}</div>}
                    { errors.form && <div className="alert alert-danger">{errors.form}</div>}

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
                            Update Password
                        </button>
                    </div>

                </form>
            </div>
        );
    }
}
LoginPasswordForm.propTypes = {
    authPassword: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { authPassword, addFlashMessage } )(LoginPasswordForm);
