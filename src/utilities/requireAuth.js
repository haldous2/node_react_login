
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
        // Lifecycle hook - called right before render
        componentDidMount(){
            if (this.props.isAuthenticated === false){
                this.props.addFlashMessage({
                    type: 'error',
                    text: 'You need to log in'
                });
                this.setState({ redirect: true });
            }
        }
        // Lifecycle hooks - listening for props changes
        componentWillReceiveProps(nextProps){
            if (nextProps.isAuthenticated === null){
                this.setState({ redirect: true });
            }
            if (nextProps.isAuthenticated === false){
                nextProps.addFlashMessage({
                    type: 'error',
                    text: 'You need to log in'
                });
                this.setState({ redirect: true });
            }
        }
        render(){
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
        return {
            isAuthenticated: state.sessionData.isAuthenticated
        }
    }
    return connect(mapStateToProps, { addFlashMessage })(Authenticate);
}
