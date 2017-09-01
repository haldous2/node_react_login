
import axios from 'axios';

export function userSignupRequest(userData){
    return axios.post('/api/users/signup', userData);
}
