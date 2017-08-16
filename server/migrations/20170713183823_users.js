
/*
 knex migrations

 The created file contains code which exports an up method and down method.
 We will create our table schema in the down method (used when we migrate)
 and delete it in the up method (when we roll back).

 note: this file generated via cmd:
   knex migrate:make users
*/

/*
 Postgres, MySQL
 implemented via -> knex migrate:latest
 Note: can't create unique key via knex in mysql.
       need to specify key size which isn't possible
*/
exports.up = function(knex, Promise) {
    return knex.schema.createTable('users', function(table) {
        table.engine('myisam');
        table.increments();
        table.string('email', 255).notNullable();
        table.string('password_digest').notNullable();
        table.string('first_name');
        table.string('last_name');
        table.timestamps();
    });
};

exports.down = function(knex, Promise) {
    return knex.schema.dropTable('users');
};
