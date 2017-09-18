
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
        // Lifecycle hook - called right before render
        componentDidMount(){
            // console.log('requireNoAuth.did.mount isAuthenticated:', this.props.isAuthenticated);
            if (this.props.isAuthenticated === true){
                // this.props.history.push('/');
                this.props.history.goBack();
            }
        }
        // Lifecycle hooks - listening for props changes
        componentWillReceiveProps(nextProps){
            // console.log('requireNoAuth.will.receive.props isAuthenticated:', nextProps.isAuthenticated);
            if (nextProps.isAuthenticated === true){
                // this.props.history.push('/');
                this.props.history.goBack();
            }
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
