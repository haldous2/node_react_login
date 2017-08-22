
import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authLogout } from '../actions/authActions'

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout(e){
        e.preventDefault();
        console.log('logging out');
        this.props.authLogout();
    }

    render(){

        const { isAuthenticated } = this.props.authUser;

        let link_nav = null;
        if (isAuthenticated === true){
            link_nav = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/mysite">My Site (Test Login)</Link></li>
                    <li><Link to="#" onClick={this.logout}>Logout</Link></li>
                </ul>
            );
        }
        if (isAuthenticated === false){
            link_nav = (
                <ul className="nav navbar-nav navbar-right">
                    <li><Link to="/mysite">My Site (Test Login)</Link></li>
                    <li><Link to="/signup">Sign Up</Link></li>
                    <li><Link to="/login">Log In</Link></li>
                </ul>
            );
        }

        return (
            <nav className="navbar navbar-default">
                <div className="container-fluid">
                    <div className="navbar-header">
                        <Link to="/" className="navbar-brand">The Loginator!</Link>
                    </div>
                    <div className="collapse navbar-collapse">
                        { link_nav }
                    </div>
                </div>
            </nav>
        );
    }
}
NavigationBar.propTypes = {
    authUser: PropTypes.object.isRequired,
    authLogout: PropTypes.func.isRequired
}
function mapStateToProps(state){
    return {
        authUser: state.authUser
    };
}
export default connect(mapStateToProps, { authLogout })(NavigationBar);
