
const Validator = require('validator');
const { isEmptyObj } = require('../utilities/helper');

module.exports.validateNewEmail = function validateNewEmail(data){

    // Checking myemail_newmail && myemail_password

    let errors = {};

    let newemail = data.newemail;
    let password = data.password;

    if (newemail){
        if (Validator.isEmpty(newemail)){
            errors.myemail_newemail = 'Email is required';
        }else{
            if (!Validator.isEmail(newemail)){
                errors.myemail_newemail = 'Email is invalid';
            }
        }
    }else{
        errors.myemail_newemail = 'Email is required';
    }

    if (password){
        if (Validator.isEmpty(password)){
            errors.myemail_password = 'Password is required';
        }else{
            /*
             Do something with password format validations
             if you want.. e.g., password length, upper, lower caset etc..
            */
            if (password.length < 8){
                errors.myemail_password = 'Password should be at least 8 characters long';
            }
        }
    }else{
        errors.myemail_password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

// ===========================================================
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
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

module.exports.validateCredentials = function validateCredentials(data){

    let errors = {};

    let email = data.email;
    let password = data.password;

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
        errors.password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}
