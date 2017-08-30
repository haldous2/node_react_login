
module.exports.isEmptyObj = function isEmptyObj(obj){
    return Object.keys(obj).length === 0 && obj.constructor === Object
}

module.exports.isDefined = function isDefined(obj){
    return obj !== null && typeof(obj) !== 'undefined'
}
