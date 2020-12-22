//host : 'mysql.ard.kinghost.net',

var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'mysql.ard.kinghost.net',
      user : 'ard',
      password : 'Matrix05',
      database : 'ard'
    }
  });
  
  module.exports = knex;