
import React from 'react';
import LoginPasswordForm from './LoginPasswordForm';

// Note: passing ...props to LoginPasswordForm so we can read querystring from route

class LoginPassword extends React.Component {
    render(){
        return (
            <div className="col-md-12">
                <LoginPasswordForm {...this.props} />
            </div>
        );
    }
}

export default LoginPassword;
