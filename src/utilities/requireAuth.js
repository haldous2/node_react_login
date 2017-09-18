
/*
 requireAuth
 For pages that should only be accessed when user is logged in
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';

export default function(Component){
    class AuthCheck extends React.Component {

        constructor(props) {
            super(props);
            this.state = {};
            this.isAuthenticated = null;
        }
        onAuthCheck(Props){
            if (Props.isAuthenticated === true){
                // Formerly logged in - on logout will need to keep from re-posting flashmessage (below)
                this.isAuthenticated = true;
            }
            if (Props.isAuthenticated === false){
                if (this.isAuthenticated === null){
                    Props.addFlashMessage({
                        type: 'error',
                        text: 'You need to log in'
                    });
                    Props.history.push('/login');
                }else{
                    Props.history.push('/');
                }
            }
        }

        // Lifecycle hook - called right before render
        componentDidMount(){
            console.log('requireAuth.did.mount isAuthenticated:', this.props.isAuthenticated);
            this.onAuthCheck(this.props);
        }
        // Lifecycle hooks - listening for props changes
        componentWillReceiveProps(nextProps){
            console.log('requireAuth.will.receive.props isAuthenticated:', nextProps.isAuthenticated);
            this.onAuthCheck(nextProps);
        }
        render(){
            if (this.props.isAuthenticated === true){
                return(
                    <Component {...this.props} />
                );
            }else{
                return(null);
            }
        }
    }
    AuthCheck.propTypes = {
        isAuthenticated: PropTypes.bool,
        addFlashMessage: PropTypes.func.isRequired
    }
    function mapStateToProps(state){
        return {
            isAuthenticated: state.sessionData.isAuthenticated
        }
    }
    return connect(mapStateToProps, { addFlashMessage })(AuthCheck);
}
