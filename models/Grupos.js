const Sequelize = require('sequelize');
const conn = require('./database/database');

console.log("Tabela de Grupos em Criação");

const Grupos = conn.define(
    'grupos', {
        nmGrupo:{
            type:Sequelize.TEXT,
            allowNull: false
        }
    }
);

Grupos
    .sync({force: false})
    .then(() => {
        console.log("Tabela Grupos criada com sucesso!!!");
    });

module.exports = Grupos;