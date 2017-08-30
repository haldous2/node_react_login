
import React from 'react';
import LoginPasswordForm from './LoginPasswordForm';

// Note: passing ...props to LoginPasswordForm so we can read querystring from route

class LoginPassword extends React.Component {
    render(){
        return (
            <div className="row">
                <div className="col-md-4 col-md-offset-4">
                    <LoginPasswordForm {...this.props} />
                </div>
            </div>
        );
    }
}

export default LoginPassword;
