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
            type:Sequelize.DATEONLY,
            allowNull: true
        },
        endPessoa:{
            type:Sequelize.TEXT,
            allowNull: true
        },
        endComplemento:{
            type:Sequelize.TEXT,
            allowNull: true
        },
        cepPessoa:{
            type:Sequelize.TEXT,
            allowNull: true
        },
        fonePessoa:{
            type:Sequelize.TEXT,
            allowNull: true
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
        VIP:{
            type:Sequelize.BOOLEAN,
            allowNull: false
        },
        sexoPessoa:{
            type:Sequelize.TEXT,
            allowNull: true
        },
        cidadePessoa:{
            type:Sequelize.TEXT,
            allowNull: true
        },
        dtEntrada:{
            type:Sequelize.DATEONLY,
            allowNull: false
        },
        dtDesligamento:{
            type:Sequelize.DATEONLY,
            allowNull: true
        },
        dtUltimaParticipacao:{
            type:Sequelize.DATEONLY,
            allowNull: true
        }
    });

// Criação da tabela somente em caso de alteração ou se a tabela não existe no banco
Pessoas
.sync({force: false})
.then(() => {
    console.log("Tabela Pessoas criada com sucesso!!!")
})
.catch(err => {
    console.log("ERRO => " + err.message);
});

module.exports = Pessoas;