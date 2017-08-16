
const Validator = require('validator');

function isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports.validateEmail = function validateEmail(data){

    let errors = {};
    let email = data.email;

    if (Validator.isEmpty(email)){
        errors.email = 'Email is required';
    }else{
        if (!Validator.isEmail(email)){
            errors.email = 'Email is invalid';
        }
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}

module.exports.validateInput = function validateInput(data){

    let errors = {};

    if (Validator.isEmpty(data.email)){
        errors.email = 'This field is required';
    }else{
        if (!Validator.isEmail(data.email)){
            errors.email = 'This email is invalid';
        }
    }
    if (Validator.isEmpty(data.password)){
        errors.password = 'This field is required';
    }else{
        // password format ?
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
