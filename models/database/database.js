const Sequelize = require("sequelize");

const conn = new Sequelize('ARD', 'ard_add1', 'Matrix05', {
    host: 'mysql.ard.kinghost.net',
    dialect: 'mysql',
    timezone: '-03:00'     
});

module.exports = conn;