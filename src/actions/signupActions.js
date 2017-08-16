
import axios from 'axios';

export function userSignupRequest(userData){
    return dispatch => {
        // Eventually need a route through nginx for /api/* .. rewrite ?
        return axios.post('/api/users', userData);
    }
}

export function isDupEmail(email){
    return dispatch => {
        // Eventually need a route through nginx for /api/* .. rewrite ?
        //return axios.get(`http://192.168.56.2:3001/api/users/email/${email}`);
        return axios.get('/api/users/email/' + email);
    }
}
