const Sequelize = require('sequelize');
const conn = require('./database/database');
const Pessoas = require('./Pessoas');
const Eventos = require('./Eventos');

console.log("Tabela de Participantes dos Eventos em Criação");

const eventosparticipantes = conn.define(
    'eventosparticipantes', {
        dataParticipacao: {
            type: Sequelize.DATEONLY,
            allowNulls: true
        },
        valorPago:{
            type: Sequelize.DECIMAL,
            precision: "10,2",
            allowNulls: false
        },
        observacao:{
            type: Sequelize.TEXT,
            allowNulls: true
        },
        presenca: {
            type: Sequelize.BOOLEAN,
            allowNulls: false
        },
        pessoaId: {
            type: Sequelize.INTEGER,
            allowNulls: false
        },
        eventoId: {
            type: Sequelize.INTEGER,
            allowNulls: false
        }
    }
);

Pessoas.hasMany(eventosparticipantes);
eventosparticipantes.belongsTo(Pessoas);

Eventos.hasMany(eventosparticipantes);
eventosparticipantes.belongsTo(Eventos);

eventosparticipantes
    .sync({force: false})
    .then(() => {
        console.log("Tabela participação em Eventos criada com sucesso!!!");
    });

module.exports = eventosparticipantes;