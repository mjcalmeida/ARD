const Sequelize = require('sequelize');
const conn = require('./database/database');
const Rituais = require("./Rituais");

console.log("Tabela de Datas de Rituais em Criação");

const RituaisDatas = conn.define(
    'rituaisDatas', {
        data: {
            type: Sequelize.DATE,
            allowNulls: false
        },
        quantidadePresentes: {
            type: Sequelize.INTEGER
        }
    }
);

Rituais.hasMany(RituaisDatas);
RituaisDatas.belongsTo(Rituais);

// RituaisDatas.sync({force: true})

RituaisDatas
    .sync({force: false})
    .then(() => {
        console.log("Tabela Datas de Rituais criada com sucesso!!!")
    });

module.exports = RituaisDatas;

