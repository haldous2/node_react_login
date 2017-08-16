
const Validator = require('validator');

function isEmpty(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports.validateEmail = function validateEmail(data){

    let errors = {};

    if (data.email){
        if (Validator.isEmpty(data.email)){
            errors.email = 'This field is required';
        }else{
            if (!Validator.isEmail(data.email)){
                errors.email = 'This email is invalid';
            }
        }
    }else{
        errors.email = 'Email is undefined';
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
    }

    return {
        errors,
        isValid: isEmpty(errors)
    }
}
