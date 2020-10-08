const Sequelize = require('sequelize');
const conn = require('./database/database');

console.log("Tabela de Participantes dos Eventos em Criação");

const Eventos = conn.define(
    'eventosparticipantes', {
        idEvento : {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        idPessoa: {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        dataParticipacao: {
            type: Sequelize.DATEONLY,
            allowNulls: true
        },
        valorPago:{
            type: Sequelize.DECIMAL,
            precision: "10,2",
            allowNulls: false
        },
        presenca: {
            type: Sequelize.BOOLEAN,
            allowNulls: false
        }
    }
);

Eventos
    .sync({force: false})
    .then(() => {
        console.log("Tabela participação em Eventos criada com sucesso!!!");
    });

module.exports = Eventos;