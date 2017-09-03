
import React from 'react';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './rootReducer';
import requireAuth from './utilities/requireAuth';

import { Grid } from 'react-bootstrap';

import {
  BrowserRouter,
  Route,
  Switch,
} from 'react-router-dom';

import AuthToken from './components/AuthToken';
import Home from './components/Home';
import Login from './components/Login';
import LoginPassword from './components/LoginPassword';
import MySite from './components/MySite';
import SignUp from './components/SignUp';
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

class App extends React.Component {
    render(){
        return (
            <Provider store={store}>
                <BrowserRouter>
                    <div>
                        <Route component={AuthToken} />
                        <NavigationBar />
                        <Grid>
                            <FlashMessagesList />
                            <Switch>
                                <Route exact path="/" component={Home} />
                                <Route path="/login/password" component={LoginPassword} />
                                <Route path="/login" component={Login} />
                                <Route path="/mysite" component={requireAuth(MySite)} />
                                <Route path="/signup" component={SignUp} />
                                <Route path="*" component={HTTP404} />
                            </Switch>
                        </Grid>
                    </div>
                </BrowserRouter>
            </Provider>
        );
    }
}

export default App;
