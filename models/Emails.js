const Sequelize = require('sequelize');
const conn = require('./database/database');
const Eventos = require('./Eventos');

console.log("Tabela de Emails em Criação");

const Emails = conn.define(
    'emails', {
        titulo:{
            type:Sequelize.STRING,
            allowNull: false
        },
        slug:{
            type:Sequelize.STRING,
            allowNull: false
        },
        body: {
            type:Sequelize.TEXT,
            allowNull: false
        }
    }
);

Emails
    .sync({force: true})
    .then(() => {
        console.log("Tabela Emails criada com sucesso!!!");
    });

module.exports = Emails;