
import React from 'react';
import {
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validateCredentials } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { userSignupRequest } from '../actions/signupActions';
import { addFlashMessage } from '../actions/flashMessages';

class SignUpForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: '',
            first_name: '',
            last_name: '',
            errors: {
                email: '',
                password: '',
                first_name: '',
                last_name: ''
            },
            redirect: false,
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
    isValidCredentials(){
        const { errors, isValid } = validateCredentials(this.state);
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(isValid);
        });
    }
    onSubmit(e){
        e.preventDefault();
        this.isValidCredentials()
        .then(
            isValid => {
                if (isValid){
                    this.setState({ errors: {}, isLoading: true });
                    userSignupRequest(this.state)
                    .then(
                        res => {
                            if (res.status === 200){
                                this.props.addFlashMessage({
                                    type: 'success',
                                    text: 'You have successfully signed up! Welcome!'
                                });
                                this.setState({ isLoading: false, redirect: true });
                            }
                            if (res.status === 202){
                                this.setState({ isLoading: false, errors: { email: 'You have already signed up!'} });
                            }
                        },
                        err => {
                            this.setState({ isLoading: false });
                            console.log('something bad happened:', err);
                        }
                    );
                }
            }
        );
    }
    render(){
        const { errors, redirect } = this.state;
        if (redirect) {
            return (
                <Redirect to='/' />
            )
        }
        return (

            <form>

                <h1>Join our community!</h1>

                <InputField
                    field="email"
                    value={this.state.email}
                    type="text"
                    label="Email"
                    onChange={this.onChange}
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

                <InputField
                    field="first_name"
                    value={this.state.first_name}
                    type="text"
                    label="First Name"
                    onChange={this.onChange}
                    error={errors.first_name}
                />

                <InputField
                    field="last_name"
                    value={this.state.last_name}
                    type="text"
                    label="Last Name"
                    onChange={this.onChange}
                    error={errors.last_name}
                />

                <div className="form-group">
                    <button disabled={this.state.isLoading} onClick={this.onSubmit} className="btn btn-primary btn-block btn-lg">
                        Sign Up
                    </button>
                </div>

            </form>
        );
    }
}
SignUpForm.propTypes = {
    addFlashMessage: PropTypes.func.isRequired
}

/*
 Connect component to redux to pass props upstream
 connect(
   mapStateToProps,
   mapDispatchToProps
 )(TodoItem)
*/
export default connect(null, { addFlashMessage } )(SignUpForm);
