
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validateUpdateEmail, validateUpdatePassword, validateUpdateProfile } from '../validations/profile';
import InputField from '../components/shared/InputField';

import { loadMyProfile, userUpdateEmail, userUpdatePassword, userUpdateProfile } from '../actions/profileActions';
import { addFlashMessage } from '../actions/flashMessages';

class MyProfileForm extends React.Component {
    constructor(props){
        super(props);
        this.state = {

            email: '',

            myemail_newemail: '',
            myemail_password: '',

            mypassword_newpassword: '',
            mypassword_password: '',

            myprofile_first_name: '',
            myprofile_last_name: '',

            errors: {

                myemail_form: '',
                myemail_newemail: '',
                myemail_password: '',

                mypassword_form: '',
                mypassword_newpassword: '',
                mypassword_password: '',

                myprofile_form: '',
                myprofile_first_name: '',
                myprofile_last_name: ''

            },
            success: {
                myemail_form: '',
                mypassword_form: '',
                myprofile_form: ''
            },
            isLoading: false
        }
        this.onInput = this.onInput.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onSubmitUpdateEmail = this.onSubmitUpdateEmail.bind(this);
        this.onSubmitUpdatePassword = this.onSubmitUpdatePassword.bind(this);
        this.onSubmitUpdateProfile = this.onSubmitUpdateProfile.bind(this);
    }
    onInput(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }
    onChange(e){
        const { name, value } = e.target;
        this.setState({ [name]: value });
    }

    /*
     Updating email address
     ----------------------------------------------------------------------
    */
    isValidUpdateEmail(){
        const { errors, isValid } = validateUpdateEmail({
            email: this.state.email,
            newemail: this.state.myemail_newemail,
            password: this.state.myemail_password
        });
        return new Promise((valid, invalid) => {
            this.setState({ errors, success: {} });
            return valid(isValid);
        });
    }
    onSubmitUpdateEmail(e){
        e.preventDefault();

        this.setState({
            myemail_newemail: this.inputMyEmailNewEmail.value,
            myemail_password: this.inputMyEmailPassword.value
        }, function(){
            this.isValidUpdateEmail()
            .then(
                isValid => {
                    if (isValid){
                        this.setState({ errors: {}, success: {}, isLoading: true });
                        userUpdateEmail({
                            newemail: this.state.myemail_newemail,
                            password: this.state.myemail_password
                        })
                        .then(
                            res => {
                                this.setState({
                                    isLoading: false,
                                    errors: {
                                        myemail_form: '',
                                        myemail_newemail: '',
                                        myemail_password: ''
                                    },
                                    success: {
                                        myemail_form: 'Email address updated!'
                                    },
                                    email: this.state.myemail_newemail,
                                    myemail_newemail: '',
                                    myemail_password: ''
                                });
                            },
                            err => {
                                if (err.response.status === 400){
                                    // This shouldn't happen - just in case!
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            myemail_form: '',
                                            myemail_newemail: 'Invalid email address',
                                            myemail_password: ''
                                        },
                                        success: {
                                            myemail_form: ''
                                        }
                                    });
                                }
                                if (err.response.status === 401){
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            myemail_form: '',
                                            myemail_newemail: '',
                                            myemail_password: 'Invalid password'
                                        },
                                        success: {
                                            myemail_form: ''
                                        }
                                    });
                                }
                                if (err.response.status === 409){
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            myemail_form: '',
                                            myemail_newemail: 'Email address already in use',
                                            myemail_password: ''
                                        },
                                        success: {
                                            myemail_form: ''
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    /*
     Updating password
     ----------------------------------------------------------------------
    */
    isValidUpdatePassword(){
        const { errors, isValid } = validateUpdatePassword({
            newpassword: this.state.mypassword_newpassword,
            password: this.state.mypassword_password
        });
        return new Promise((valid, invalid) => {
            this.setState({ errors, success: {} });
            return valid(isValid);
        });
    }
    onSubmitUpdatePassword(e){
        e.preventDefault();

        this.setState({
            mypassword_newpassword: this.inputMyPasswordNewPassword.value,
            mypassword_password: this.inputMyPasswordPassword.value
        }, function(){
            this.isValidUpdatePassword()
            .then(
                isValid => {
                    if (isValid){
                        userUpdatePassword({
                            newpassword: this.state.mypassword_newpassword,
                            password: this.state.mypassword_password
                        })
                        .then(
                            res => {
                                this.setState({
                                    isLoading: false,
                                    errors: {
                                        mypassword_form: '',
                                        mypassword_password: '',
                                        mypassword_newpassword: ''
                                    },
                                    success: {
                                        mypassword_form: 'Password updated!'
                                    },
                                    mypassword_newpassword: '',
                                    mypassword_password: ''
                                });
                            },
                            err => {
                                if (err.response.status === 400){
                                    // This shouldn't happen - just in case!
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            mypassword_form: '',
                                            mypassword_password: '',
                                            mypassword_newpassword: 'Invalid password'
                                        },
                                        success: {
                                            myprofile_form: ''
                                        }
                                    });
                                }
                                if (err.response.status === 401){
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            mypassword_form: '',
                                            mypassword_password: 'Invalid password',
                                            mypassword_newpassword: ''
                                        },
                                        success: {
                                            myprofile_form: ''
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    /*
     Updating my profile
     ----------------------------------------------------------------------
    */
    isValidUpdateProfile(){
        const { errors, isValid } = validateUpdateProfile({
            first_name: this.state.myprofile_first_name,
            last_name: this.state.myprofile_last_name
        });
        return new Promise((valid, invalid) => {
            this.setState({ errors, success: {} });
            return valid(isValid);
        });
    }
    onSubmitUpdateProfile(e){
        e.preventDefault();

        this.setState({
            myprofile_first_name: this.inputMyProfileFirstName.value,
            myprofile_last_name: this.inputMyProfileLastName.value
        }, function(){
            this.isValidUpdateProfile()
            .then(
                isValid => {
                    if (isValid){
                        userUpdateProfile({
                            first_name: this.state.myprofile_first_name,
                            last_name: this.state.myprofile_last_name
                        })
                        .then(
                            res => {
                                this.setState({
                                    isLoading: false,
                                    errors: {
                                        myprofile_first_name: '',
                                        myprofile_last_name: '',
                                        myprofile_form: ''
                                    },
                                    success: {
                                        myprofile_form: 'Profile updated!'
                                    }
                                });
                            },
                            err => {
                                if (err.response.status === 401){
                                    this.setState({
                                        isLoading: false,
                                        errors: {
                                            myprofile_first_name: '',
                                            myprofile_last_name: '',
                                            mypassword_form: 'Something bad happened'
                                        },
                                        success: {
                                            myprofile_form: ''
                                        }
                                    });
                                }
                            }
                        );
                    }
                }
            );
        });
    }

    /*
     Load user data
     ----------------------------------------------------------------------
    */
    componentDidMount(){
        loadMyProfile()
        .then(
            res => {
                const { email, first_name, last_name } = res.data;
                this.setState({
                    email: email,
                    myprofile_first_name: first_name,
                    myprofile_last_name: last_name
                });
            },
            err => {
                console.log('error loading profile data:', err);
            }
        );
    }

    render(){
        const { errors, success } = this.state;
        return (
            <div>
                <form>
                    <h2>My Email</h2>

                    { success.myemail_form && <div className="alert alert-success">{success.myemail_form}</div>}
                    { errors.myemail_form && <div className="alert alert-danger">{errors.myemail_form}</div>}

                    <InputField
                        field="EMAIL"
                        value={this.state.email}
                        disabled={true}
                        type="email"
                        label="Current Email"
                    />

                    <InputField
                        reference={ input => { this.inputMyEmailNewEmail = input }}
                        field="myemail_newemail"
                        value={this.state.myemail_newemail}
                        type="email"
                        label="Update Email"
                        onInput={this.onInput}
                        error={errors.myemail_newemail}
                    />

                    <InputField
                        reference={ input => { this.inputMyEmailPassword = input }}
                        field="myemail_password"
                        value={this.state.myemail_password}
                        type="password"
                        label="Current Password"
                        onInput={this.onInput}
                        error={errors.myemail_password}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitUpdateEmail} className="btn btn-primary btn-block btn-lg">
                            Update Email
                        </button>
                    </div>

                </form>

                <form>

                    <h2>My Password</h2>

                    { success.mypassword_form && <div className="alert alert-success">{success.mypassword_form}</div>}
                    { errors.mypassword_form && <div className="alert alert-danger">{errors.mypassword_form}</div>}

                    <InputField
                        reference={ input => { this.inputMyPasswordNewPassword = input }}
                        field="mypassword_newpassword"
                        value={this.state.mypassword_newpassword}
                        type="password"
                        label="Update Password"
                        onInput={this.onInput}
                        error={errors.mypassword_newpassword}
                    />

                    <InputField
                        reference={ input => { this.inputMyPasswordPassword = input }}
                        field="mypassword_password"
                        value={this.state.mypassword_password}
                        type="password"
                        label="Current Password"
                        onInput={this.onInput}
                        error={errors.mypassword_password}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitUpdatePassword} className="btn btn-primary btn-block btn-lg">
                            Update Password
                        </button>
                    </div>

                </form>

                <form>

                    <h2>My Profile</h2>

                    { success.myprofile_form && <div className="alert alert-success">{success.myprofile_form}</div>}
                    { errors.myprofile_form && <div className="alert alert-danger">{errors.myprofile_form}</div>}

                    <InputField
                        reference={ input => { this.inputMyProfileFirstName = input }}
                        field="myprofile_first_name"
                        value={this.state.myprofile_first_name}
                        type="text"
                        label="First Name"
                        onChange={this.onChange}
                        error={errors.myprofile_first_name}
                    />

                    <InputField
                        reference={ input => { this.inputMyProfileLastName = input }}
                        field="myprofile_last_name"
                        value={this.state.myprofile_last_name}
                        type="text"
                        label="Last Name"
                        onChange={this.onChange}
                        error={errors.myprofile_last_name}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitUpdateProfile} className="btn btn-primary btn-block btn-lg">
                            Update Profile
                        </button>
                    </div>

                </form>

            </div>
        );
    }
}
MyProfileForm.propTypes = {
    addFlashMessage: PropTypes.func.isRequired
}
export default connect(null, { addFlashMessage } )(MyProfileForm);
