
const bookshelf = require('../bookshelf');

module.exports = bookshelf.Model.extend({
    tableName: 'users',
    idAttribute: "id",
    hasTimestamps: true
});
