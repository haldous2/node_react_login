
const Validator = require('validator');
import { isEmptyObj } from '../utilities/helper';

module.exports.validateEmail = function validateEmail(data){

    let errors = {};

    let email = data.email

    if (email){
        if (Validator.isEmpty(email)){
            errors.email = 'This field is required';
        }else{
            if (!Validator.isEmail(email)){
                errors.email = 'This email is invalid';
            }
        }
    }else{
        errors.email = 'Email is undefined';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

module.exports.validateInput = function validateInput(data){

    let errors = {};

    let email = data.email
    let password = data.password;

    if (email){
        if (Validator.isEmpty(email)){
            errors.email = 'This field is required';
        }else{
            if (!Validator.isEmail(email)){
                errors.email = 'This email is invalid';
            }
        }
    }else{
        errors.email = 'Email is undefined';
    }

    if (password){
        if (Validator.isEmpty(password)){
            errors.password = 'This field is required';
        }
    }else{
        errors.password = 'Password is undefined';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}
