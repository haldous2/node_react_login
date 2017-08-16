
import React from 'react';
import {
  Redirect
} from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validateInput } from '../validations/auth';
import InputField from '../components/shared/InputField';

import { userSignupRequest, isDupEmail } from '../actions/signupActions';
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
        this.onBlurEmail = this.onBlurEmail.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }
    isEmpty(obj){
        return Object.keys(obj).length === 0 && obj.constructor === Object
    }
    onChange(e){
        // this.setState({ username: e.target.value });
        this.setState({ [e.target.name]: e.target.value });
    }
    // If you're into onBlur - go on ahead and uncomment this delicious block
    onBlurEmail(e){
        // let errors = this.state.errors;
        // this.isDuplicate(this.state.email, errors)
        // .then(
        //     errors => {
        //         this.setState({ errors });
        //     }
        // );
    }
    isValid(){
        const { errors } = validateInput(this.state);
        if (errors.email){
            return new Promise((valid, invalid) => {
                this.setState({ errors });
                return valid(this.isEmpty(errors));
            });
        }else{
            return this.isDuplicate(this.state.email, errors)
            .then(errors => {
                this.setState({ errors });
                return this.isEmpty(errors);
            });
        }
    }
    isDuplicate(email, errors={}){
        return this.props.isDupEmail(email)
        .then(
            (res) => {
                return errors;
            },
            (err) => {
                errors.email = err.response.data.errors;
                return errors;
            }
        );
    }
    onSubmit(e){
        e.preventDefault();

        this.isValid()
        .then(isValid => {

            if (isValid){

                this.setState({ errors: {}, isLoading: true });
                this.props.userSignupRequest(this.state).then(
                    (res) => {
                        this.props.addFlashMessage({
                            type: 'success',
                            text: 'You have successfully signed up! Welcome!'
                        });
                        this.setState({ isLoading: false, redirect: true });
                    },
                    (err) => this.setState({ isLoading: false, errors: err.response.data })
                );
            }
        });
    }
    render(){

        const { errors, redirect } = this.state;

        if (redirect) {
            return (
                <Redirect to='/' />
            )
        }
        return (
            <div className="row">
                <form onSubmit={this.onSubmit}>

                    <h1>Join our community!</h1>

                    <InputField
                        field="email"
                        value={this.state.email}
                        type="text"
                        label="Email"
                        onChange={this.onChange}
                        onBlur={this.onBlurEmail}
                        error={errors.email}
                    />
                    {/* <div className={errors.email ? 'form-group has-error' : 'form-group'}>
                        <label className="control-label">Email</label>
                        <input
                            value={this.state.email}
                            type="email"
                            name="email"
                            onChange={this.onChange}
                            className="form-control"
                        />
                        {errors.email && <span className="help-block">{errors.email}</span>}
                    </div> */}

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
                        <button disabled={this.state.isLoading} className="btn btn-primary btn-block btn-lg">
                            Sign Up
                        </button>
                    </div>

                </form>
            </div>
        );
    }
}
SignUpForm.propTypes = {
    userSignupRequest: PropTypes.func.isRequired,
    isDupEmail: PropTypes.func.isRequired,
    addFlashMessage: PropTypes.func.isRequired
}

/*
 Connect component to redux to pass props upstream
 connect(
   mapStateToProps,
   mapDispatchToProps
 )(TodoItem)
*/
export default connect(null, { userSignupRequest, isDupEmail, addFlashMessage } )(SignUpForm);
