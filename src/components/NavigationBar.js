
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authSession, authLogout } from '../actions/authActions'

import { Nav, Navbar, NavItem } from 'react-bootstrap';

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.logout = this.logout.bind(this);
    }

    logout(e){
        e.preventDefault();
        this.props.authSession(false, {});
        authLogout();
    }

    render(){

        const { isAuthenticated } = this.props.sessionData;

        let link_nav = null;
        if (isAuthenticated === true){
            link_nav = (
                // <ul className="nav navbar-nav">
                //     <li className="nav-item"><Link to="/mysite">My Site (Test Login)</Link></li>
                //     <li className="nav-item"><Link to="#" onClick={this.logout}>Logout</Link></li>
                // </ul>
                <Nav bsStyle="pills" pullRight activeKey={this.state.activeKey} onSelect={this.handleSelect}>
                    <NavItem eventKey={1} href="/mysite">My Site</NavItem>
                    <NavItem eventKey={1} href="/myprofile">My Profile</NavItem>
                    <NavItem eventKey={3} href="#" onClick={this.logout}>Logout</NavItem>
                </Nav>
            );
        }
        if (isAuthenticated === false){
            link_nav = (
                <Nav bsStyle="pills" pullRight activeKey={this.state.activeKey} onSelect={this.handleSelect}>
                    <NavItem eventKey={1} href="/mysite">My Site (Test Login)</NavItem>
                    <NavItem eventKey={2} href="/signup">Sign Up</NavItem>
                    <NavItem eventKey={3} href="/login">Log In</NavItem>
                </Nav>
            );
        }

        return (
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">Node React Login</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                  { link_nav }
              </Navbar.Collapse>
            </Navbar>
        );
    }
}
NavigationBar.propTypes = {
    authSession: PropTypes.func.isRequired
}
function mapStateToProps(state){
    return {
        sessionData: state.sessionData
    };
}
export default connect(mapStateToProps, { authSession })(NavigationBar);
