const Sequelize = require('sequelize');
const conn = require('./database/database');

console.log("Tabela de Eventos em Criação");

const Eventos = conn.define(
    'eventos', {
        nomeEvento : {
            type: Sequelize.TEXT,
            allowNulls: false
        },
        periodicidade: {
            type: Sequelize.TEXT,
            allowNulls: false
        },
        dataProximoEvento: {
            type: Sequelize.DATEONLY,
            allowNulls: true
        },
        horaProximoEvento:{
            type: Sequelize.TEXT
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

Eventos
    .sync({force: false})
    .then(() => {
        console.log("Tabela Eventos criada com sucesso!!!");
    });

module.exports = Eventos;