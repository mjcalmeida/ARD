const Sequelize = require('sequelize');
const conn = require('./database/database');

console.log("Tabela de Rituais em Criação");

const Rituais = conn.define(
    'rituais', {
        nomeRitual : {
            type: Sequelize.TEXT,
            allowNulls: false
        },
        periodicidade: {
            type: Sequelize.TEXT,
            allowNulls: false
        },
        dataStart: {
            type: Sequelize.DATE,
            allowNulls: true
        },
        numMinimo: {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        numMaximo: {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        valorConvidado: {
            type: Sequelize.DECIMAL,
            precision: "10,2",
            allowNulls: false
        }, 
        valorXama: {
            type: Sequelize.DECIMAL,
            allowNulls: false
        }
    }
);

Rituais
    .sync({force: false})
    .then(() => {
        console.log("Tabela Rituais criada com sucesso!!!");
    });

module.exports = Rituais;