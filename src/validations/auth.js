
const Validator = require('validator');
const { isEmptyObj } = require('../utilities/helper');

module.exports.validatePassword = function validatePassword(data){

    let errors = {};

    let password = data.password;

    if (password){
        if (Validator.isEmpty(password)){
            errors.password = 'Password is required';
        }else{
            /*
             Do something with password format validations
             if you want.. e.g., password length, upper, lower caset etc..
            */
            if (password.length < 8){
                errors.password = 'Password should be at least 8 characters long';
            }
        }
    }else{
        errors.password = 'Password is undefined';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

module.exports.validateEmail = function validateEmail(data){

    let errors = {};

    let email = data.email;

    if (email){
        if (Validator.isEmpty(email)){
            errors.email = 'Email is required';
        }else{
            if (!Validator.isEmail(email)){
                errors.email = 'Email is invalid';
            }
        }
    }else{
        errors.email = 'Email is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

module.exports.validateInput = function validateInput(data){

    let errors = {};

    let email = data.email;
    let password = data.password;

    if (email){
        if (Validator.isEmpty(email)){
            errors.email = 'Email is required';
        }else{
            if (!Validator.isEmail(email)){
                errors.email = 'This email is invalid';
            }
        }
    }else{
        errors.email = 'Email is required';
    }

    if (password){
        if (Validator.isEmpty(password)){
            errors.password = 'This field is required';
        }else{
            // password format ?
        }
    }else{
        errors.password = 'This field is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}
