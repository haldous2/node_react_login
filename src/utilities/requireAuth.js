
import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { addFlashMessage } from '../actions/flashMessages';

export default function(Component){
    class Authenticate extends React.Component {
        constructor(props) {
            super(props);
            this.state = {
                redirect: false
            };
        }
        // Lifecycle hook - right before this mounts
        componentDidMount(){
            console.log('utilities.requireAuth.isAuthenticated:', this.props.isAuthenticated);
            if (this.props.isAuthenticated === false){
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'You need to log in'
                });
                this.setState({ redirect: true });
            }
        }
        // Lifecycle hook - right after this mounts
        componentWillUpdate(nextProps){
            if (nextProps.isAuthenticated === false){
                this.setState({ redirect: true });
            }
        }
        render(){
            console.log('utilities.requireAuth.render.isAuthenticated:', this.props.isAuthenticated);
            if (this.state.redirect) {
                return (
                    <Redirect to='/login' />
                );
            }
            return(
                <Component {...this.props} />
            );
        }
    }
    Authenticate.propTypes = {
        isAuthenticated: PropTypes.bool,
        addFlashMessage: PropTypes.func.isRequired
    }
    function mapStateToProps(state){
        console.log(state);
        return {
            isAuthenticated: state.authUser.isAuthenticated
        }
    }
    return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}
