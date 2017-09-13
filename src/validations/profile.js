
const Validator = require('validator');
const { isEmptyObj } = require('../utilities/helper');

module.exports.validateUpdateEmail = function validateUpdateEmail(data){

    let errors = {};

    let email = data.email;
    let newemail = data.newemail;
    let password = data.password;

    if (newemail){
        if (Validator.isEmpty(newemail)){
            errors.myemail_newemail = 'Email is required';
        }else{
            if (!Validator.isEmail(newemail)){
                errors.myemail_newemail = 'Email is invalid';
            }else{
                if (newemail === email){
                    errors.myemail_newemail = 'Email is the same as current email'
                }
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

module.exports.validateUpdatePassword = function validateUpdateEmail(data){

    let errors = {};

    let newpassword = data.newpassword;
    let password = data.password;

    if (newpassword){
        if (Validator.isEmpty(newpassword)){
            errors.mypassword_newpassword = 'Password is required';
        }else{
            /*
             Do something with password format validations
             if you want.. e.g., password length, upper, lower caset etc..
            */
            if (newpassword.length < 8){
                errors.mypassword_newpassword = 'Password should be at least 8 characters long';
            }
        }
    }else{
        errors.mypassword_newpassword = 'Password is required';
    }

    if (password){
        if (Validator.isEmpty(password)){
            errors.mypassword_password = 'Password is required';
        }else{
            /*
             Do something with password format validations
             if you want.. e.g., password length, upper, lower caset etc..
            */
            if (password.length < 8){
                errors.mypassword_password = 'Password should be at least 8 characters long';
            }
        }
    }else{
        errors.mypassword_password = 'Password is required';
    }

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}

module.exports.validateUpdateProfile = function validateUpdateProfile(data){

    let errors = {};

    //let first_name = data.first_name;
    //let last_name = data.last_name;

    // No errors generated - first & last names are not required!

    return {
        errors,
        isValid: isEmptyObj(errors)
    }
}
