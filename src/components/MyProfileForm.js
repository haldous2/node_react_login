
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { validateNewEmail } from '../validations/profile';
import InputField from '../components/shared/InputField';

import { loadMyProfile, userMyEmail, userMyPassword, userMyProfile } from '../actions/profileActions';
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
        this.onChange = this.onChange.bind(this);
        this.onSubmitEmail = this.onSubmitEmail.bind(this);
        this.onSubmitPassword = this.onSubmitPassword.bind(this);
        this.onSubmitProfile = this.onSubmitProfile.bind(this);
    }
    onChange(e){
        this.setState({ [e.target.name]: e.target.value });
    }
    isValidNewEmail(){
        const { errors, isValid } = validateNewEmail({ newemail: this.state.myemail_newemail, password: this.state.myemail_password });
        return new Promise((valid, invalid) => {
            this.setState({ errors });
            return valid(isValid);
        });
    }
    onSubmitEmail(e){
        e.preventDefault();
        this.isValidNewEmail()
        .then(
            isValid => {
                if (isValid){
                    this.setState({ errors: {}, success: {}, isLoading: true });
                    userMyEmail({ newemail: this.state.myemail_newemail, password: this.state.myemail_password })
                    .then(
                        res => {
                            this.setState({
                                isLoading: false,
                                success: { myemail_form: 'Email address updated!' },
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
                                        myemail_newemail: 'Invalid email address'
                                    }
                                });
                            }
                            if (err.response.status === 401){
                                this.setState({
                                    isLoading: false,
                                    errors: {
                                        myemail_password: 'Invalid password'
                                    }
                                });
                            }
                            if (err.response.status === 409){
                                this.setState({
                                    isLoading: false,
                                    errors: {
                                        myemail_newemail: 'Email address already in use'
                                    }
                                });
                            }
                        }
                    );
                }
            }
        );
    }
    onSubmitPassword(e){
        e.preventDefault();
        userMyPassword()
        .then();
    }
    onSubmitProfile(e){
        e.preventDefault();
        userMyProfile()
        .then();
    }
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
                        field="myemail_newemail"
                        value={this.state.myemail_newemail}
                        type="email"
                        label="New Email"
                        onChange={this.onChange}
                        error={errors.myemail_newemail}
                    />

                    <InputField
                        field="myemail_password"
                        value={this.state.myemail_password}
                        type="password"
                        label="Current Password"
                        onChange={this.onChange}
                        error={errors.myemail_password}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitEmail} className="btn btn-primary btn-block btn-lg">
                            Update Email
                        </button>
                    </div>

                </form>

                <form>

                    <h2>My Password</h2>

                    <InputField
                        field="mypassword_newpassword"
                        value={this.state.mypassword_newpassword}
                        type="password"
                        label="New Password"
                        onChange={this.onChange}
                        error={errors.mypassword_newpassword}
                    />

                    <InputField
                        field="mypassword_password"
                        value={this.state.mypassword_password}
                        type="password"
                        label="Current Password"
                        onChange={this.onChange}
                        error={errors.mypassword_password}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitPassword} className="btn btn-primary btn-block btn-lg">
                            Update Password
                        </button>
                    </div>

                </form>

                <form>

                    <h2>My Profile</h2>

                    <InputField
                        field="myprofile_first_name"
                        value={this.state.myprofile_first_name}
                        type="text"
                        label="First Name"
                        onChange={this.onChange}
                        error={errors.myprofile_first_name}
                    />

                    <InputField
                        field="myprofile_last_name"
                        value={this.state.myprofile_last_name}
                        type="text"
                        label="Last Name"
                        onChange={this.onChange}
                        error={errors.myprofile_last_name}
                    />

                    <div className="form-group">
                        <button disabled={this.state.isLoading} onClick={this.onSubmitProfile} className="btn btn-primary btn-block btn-lg">
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
