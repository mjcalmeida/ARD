const Sequelize = require("sequelize");
const conn = require("./database/database");

console.log("Tabela Pessoas em criação!!!");

const Pessoas = conn.define(
    'pessoas',{
        idGrupo: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        nmPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        dtNascimento:{
            type:Sequelize.DATE,
            allowNull: false
        },
        endPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        endComplemento:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        cepPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        fonePessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        nmPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        Ativo:{
            type:Sequelize.BOOLEAN,
            allowNull: false
        },
        receberEmails:{
            type:Sequelize.BOOLEAN,
            allowNull: false
        },
        emailPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        sexoPessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        cidadePessoa:{
            type:Sequelize.TEXT,
            allowNull: false
        },
        dtEntrada:{
            type:Sequelize.DATE,
            allowNull: false
        },
        dtDesligamento:{
            type:Sequelize.DATE,
            allowNull: true
        },
        dtUltimaParticipacao:{
            type:Sequelize.DATE,
            allowNull: true
        }
    });

// Criação da tabela somente em caso de alteração ou se a tabela não existe no banco

Pessoas
    .sync({force: false})
    .then(() => {
        console.log("Tabela Pessoas criada com sucesso!!!")
    });

module.exports = Pessoas;