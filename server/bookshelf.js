
/*
 Bookshelf runs on top of Knex
 it's an ORM for MySQL, Postgres, Maria etc..
*/

const knex = require('knex');
const bookshelf = require('bookshelf');
const knexConfig = require('./knexfile');

module.exports = bookshelf(knex(knexConfig.development));
