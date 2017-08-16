
import axios from 'axios';

/*
 Will be adding a default authorization header for each ajax request
 ?? Aren't tokens stored in local storage ?
 ?? can't we just verify that on each request ?
*/
export default function setAuthToken(token){
    if (token){
        axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
        // axios.defaults.headers.common = {
        //     'Authorization': 'Bearer ' + token
        // };
    }else{
        delete axios.defaults.headers.common['Authorization'];
    }
}
