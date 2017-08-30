
import axios from 'axios';

export function userSignupRequest(userData){
    return axios.post('/api/users/signup', userData);
}

export function isNewSignup(email){
    return axios.post('/api/users/newsignup', { email: email });
}
