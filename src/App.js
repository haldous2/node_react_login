
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import requireAuth from './utilities/requireAuth';
import requireNoAuth from './utilities/requireNoAuth';

import cookie from 'react-cookies';
import { authLogout, setSessionData, initAuthToken } from './actions/authActions';

import { Grid, Row } from 'react-bootstrap';

import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import Home from './components/Home';
import Login from './components/Login';
import LoginPassword from './components/LoginPassword';
import MySite from './components/MySite';
import SignUp from './components/SignUp';
import MyProfile from './components/MyProfile';
import HTTP404 from './components/HTTP404';
import NavigationBar from './components/NavigationBar';
import FlashMessagesList from './components/FlashMessagesList';

const store = createStore(
    rootReducer,
    compose (
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f
    )
);

const token = cookie.load('jwt');
initAuthToken(token)
.then(
    res => {
        if (res === true){
            // cookie already set - skip authLogin
            store.dispatch(setSessionData({ authenticated: true, data: {} }));
        }else{
            authLogout();
            store.dispatch(setSessionData({ authenticated: false, data: {} }));
        }
    }
);

class App extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <Grid>
                        <Route component={NavigationBar} />
                        {/* <Grid> */}
                            <Row className="show-grid">
                                <Route component={FlashMessagesList} />
                                <Switch>
                                    <Route exact path="/" component={Home} />
                                    <Route exact path="/login" component={requireNoAuth(Login)} />
                                    <Route exact path="/login/password" component={LoginPassword} />
                                    <Route exact path="/mysite" component={requireAuth(MySite)} />
                                    <Route exact path="/signup" component={requireNoAuth(SignUp)} />
                                    <Route exact path="/myprofile" component={requireAuth(MyProfile)} />
                                    <Route path="*" component={HTTP404} />
                                </Switch>
                            </Row>
                        {/* </Grid> */}
                    </Grid>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
