const Sequelize = require('sequelize');
const conn = require('./database/database');
const Eventos = require('./Eventos');
const Pessoas = require('./Pessoas');

console.log("Tabela de Participantes dos Eventos em Criação");

const EventosParticipantes = conn.define(
    'eventosparticipantes', {
        idEvento : {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        pessoaId: {
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

Pessoas.hasMany(EventosParticipantes, { foreignKey: {name : 'pessoaId' }});
EventosParticipantes.belongsTo(Pessoas);

EventosParticipantes
    .sync({force: false})
    .then(() => {
        console.log("Tabela participação em Eventos criada com sucesso!!!");
    });

module.exports = EventosParticipantes;