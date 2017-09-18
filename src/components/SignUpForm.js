
import React from 'react';
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
            isLoading: false
        }
        this.onInput = this.onInput.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
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
    onSubmit(e){
        e.preventDefault();

        this.setState({
            email: this.inputEmail.value,
            password: this.inputPassword.value,
            first_name: this.inputFirstName.value,
            last_name: this.inputLastName.value
        }, function(){

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
                                    this.setState({ isLoading: false });
                                    this.props.history.push('/');
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
        });
    }
    render(){
        const { errors } = this.state;
        return (

            <form>

                <h1>Join our community!</h1>

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

                <InputField
                    reference={ input => { this.inputFirstName = input }}
                    field="first_name"
                    value={this.state.first_name}
                    type="text"
                    label="First Name"
                    onInput={this.onInput}
                    error={errors.first_name}
                />

                <InputField
                    reference={ input => { this.inputLastName = input }}
                    field="last_name"
                    value={this.state.last_name}
                    type="text"
                    label="Last Name"
                    onInput={this.onInput}
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
