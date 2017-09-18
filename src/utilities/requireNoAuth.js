
/*
 requireNoAuth
 For pages that should be accessed when user is not logged in
*/

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

export default function(Component){
    class AuthCheck extends React.Component {

        constructor(props) {
            super(props);
            this.state = {};
        }
        onAuthCheck(Props){
            if (Props.isAuthenticated === true){
                Props.history.push('/');
            }
        }

        // Lifecycle hook - called right before render
        componentDidMount(){
            console.log('requireNoAuth.did.mount isAuthenticated:', this.props.isAuthenticated);
            this.onAuthCheck(this.props);
        }
        // Lifecycle hooks - listening for props changes
        componentWillReceiveProps(nextProps){
            console.log('requireNoAuth.will.receive.props isAuthenticated:', nextProps.isAuthenticated);
            this.onAuthCheck(nextProps);
        }
        render(){
            if (this.props.isAuthenticated === false){
                return(
                    <Component {...this.props} />
                );
            }else{
                return(null);
            }
        }
    }
    AuthCheck.propTypes = {
        isAuthenticated: PropTypes.bool
    }
    function mapStateToProps(state){
        return {
            isAuthenticated: state.sessionData.isAuthenticated
        }
    }
    return connect(mapStateToProps, null)(AuthCheck);
}
