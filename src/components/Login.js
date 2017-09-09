
import React from 'react';
import LoginForm from './LoginForm';

class Login extends React.Component {
    render(){
        return (
            <div className="col-md-12">
                <LoginForm {...this.props} />
            </div>
        );
    }
}

export default Login;
