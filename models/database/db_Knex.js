var knex = require('knex')({
    client: 'mysql2',
    connection: {
      host : 'mysql.ard.kinghost.net',
      user : 'ard_add1',
      password : 'Matrix05',
      database : 'ARD'
    }
  });
  
  module.exports = knex;