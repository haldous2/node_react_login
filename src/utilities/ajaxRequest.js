
/*
 Axios wrapper for jwt authorization
 call: performRequest('post', '/users/api/etc', vars)
*/

import axios from 'axios'
import cookie from 'react-cookies';

//const performRequest = (method, url, params) => {
export function performRequest(method, url, params){

    const body = method === 'get' ? 'params' : 'data'

    const config = {
        method,
        url,
        [body]: params || {}
    }

    const token = cookie.load('jwt');
    if (token){
        axios.defaults.headers.common['Authorization'] = `JWT ${token}`;
    }else{
        delete axios.defaults.headers.common['Authorization'];
    }

    return axios.request(config);

}
