const Sequelize = require('sequelize');
const conn = require('./database/database');

console.log("Tabela de Timeline em Criação");

const Timeline = conn.define(
    'Timeline', {
        eventoId:{
            type:Sequelize.INTEGER,
            allowNull:false
        },
        antesDepois:{
            type:Sequelize.STRING(1),
            allowNull: false
        },
        quantidade:{
            type:Sequelize.INTEGER,
            allowNull: false
        },
        unidade:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        acao:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        emailId:{
            type:Sequelize.INTEGER,
            allowNull: false
        }
    }
);

Timeline
    .sync({force: false})
    .then(() => {
        console.log("Tabela Timeline criada com sucesso!!!");
    });

module.exports = Timeline;