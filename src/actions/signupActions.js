
import axios from 'axios';

// New User
export function userSignupRequest(data){
    return axios.post('/api/users/signup', data);
}
