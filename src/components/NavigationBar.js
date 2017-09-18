
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authSession, authLogout } from '../actions/authActions'

import { Nav, Navbar, NavItem } from 'react-bootstrap';

class NavigationBar extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            link_nav: null
        };
        this.logout = this.logout.bind(this);
    }
    logout(e){
        e.preventDefault();
        this.props.authSession(null, {});
        authLogout();
    }
    buildLinkNav(Props, activeKey){
        let link_nav = '';
        const { isAuthenticated } = Props.sessionData;
        if (isAuthenticated === true){
            link_nav = (
                // <ul className="nav navbar-nav">
                //     <li className="nav-item"><Link to="/mysite">My Site (Test Login)</Link></li>
                //     <li className="nav-item"><Link to="#" onClick={this.logout}>Logout</Link></li>
                // </ul>
                <Nav bsStyle="pills" pullRight activeKey={activeKey} onSelect={this.handleSelect}>
                    <NavItem eventKey={'/mysite'} href="/mysite">My Site</NavItem>
                    <NavItem eventKey={'/myprofile'} href="/myprofile">My Profile</NavItem>
                    <NavItem eventKey={'/logout'} href="#" onClick={this.logout}>Logout</NavItem>
                </Nav>
            );
        }else{
            link_nav = (
                <Nav bsStyle="pills" pullRight activeKey={activeKey} onSelect={this.handleSelect}>
                    <NavItem eventKey={'/mysite'} href="/mysite">My Site (Test Login)</NavItem>
                    <NavItem eventKey={'/signup'} href="/signup">Sign Up</NavItem>
                    <NavItem eventKey={'/login'} href="/login">Log In</NavItem>
                </Nav>
            );
        }
        this.setState({ link_nav: link_nav });
    }
    componentWillReceiveProps(nextProps){
        this.buildLinkNav(nextProps, nextProps.location.pathname);
    }

    render(){
        return (
            <Navbar fluid>
              <Navbar.Header>
                <Navbar.Brand>
                  <a href="/">Node React Login</a>
                </Navbar.Brand>
                <Navbar.Toggle />
              </Navbar.Header>
              <Navbar.Collapse>
                  { this.state.link_nav }
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
