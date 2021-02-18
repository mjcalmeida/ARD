const Sequelize = require("sequelize");
//host: 'mysql.ard.kinghost.net',
const conn = new Sequelize('ard', 'ard', 'Matrix05', {
    host: 'mysql.ard.kinghost.net',
    dialect: 'mysql',
    timezone: '-03:00'     
});

module.exports = conn;