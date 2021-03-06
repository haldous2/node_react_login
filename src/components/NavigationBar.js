
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { authSession, authLogout } from '../actions/authActions'

import { Nav, Navbar, NavItem, NavDropdown } from 'react-bootstrap';

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
        this.props.authSession(false, {});
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
                    <NavItem
                        eventKey={'/mysite'}
                        href={activeKey === '/mysite' ? '#' : '/mysite'}
                    >My Site</NavItem>
                    <NavItem
                        eventKey={'/myprofile'}
                        href={activeKey === '/myprofile' ? '#' : '/myprofile'}
                    >My Profile</NavItem>
                    <NavItem
                        eventKey={'/logout'}
                        href="#" onClick={this.logout}
                    >Logout</NavItem>
                    <NavDropdown eventKey={'/search'} title="Dropdown" id="nav-search">
                        <form>
                            <input type="text" name="blah" />
                        </form>
                    </NavDropdown>
                </Nav>
            );
        }else{
            link_nav = (
                <Nav bsStyle="pills" pullRight activeKey={activeKey} onSelect={this.handleSelect}>
                    <NavItem
                        eventKey={'/mysite'}
                        href={activeKey === '/mysite' ? '#' : '/mysite'}
                    >My Site (Test Login)</NavItem>
                    <NavItem
                        eventKey={'/signup'}
                        href={activeKey === '/signup' ? '#' : '/signup'}
                    >Sign Up</NavItem>
                    <NavItem
                        eventKey={'/login'}
                        href={activeKey === '/login' ? '#' : '/login'}
                    >Log In</NavItem>
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
            <Navbar>
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
