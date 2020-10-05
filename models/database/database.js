const Sequelize = require("sequelize");

const conn = new Sequelize('ARD', 'root', '1234', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+02:00'
});

module.exports = conn;