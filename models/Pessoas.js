const Sequelize = require("sequelize");
const conn = require("./database/database");
const Grupos = require('./Grupos');

console.log("Tabela Pessoas em criação!!!");

const pessoas = conn.define(
    'pessoas',{
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
        },
        grupoId:{
            type:Sequelize.INTEGER,
            allowNull: true
        },
        idFranqueado:{
            type:Sequelize.BOOLEAN,
            allowNull: false
        }
    });

class Pessoa {
    constructor(nmPessoa, dtNascimento, endPessoa, endComplemento, cepPessoa, fonePessoa, Ativo,
                receberEmails, emailPessoa, VIP, sexoPessoa, cidadePessoa, dtEntrada, dtDesligamento,
                dtUltimaParticipacao, grupoId){
        nmPessoa: nmPessoa; 
        dtNascimento : dtNascimento;
        endPessoa : endPessoa;
        endComplemento: endComplemento;
        cepPessoa : cepPessoa;
        fonePessoa : fonePessoa;
        Ativo : Ativo;
        receberEmails : receberEmails;
        emailPessoa : emailPessoa;
        VIP : VIP;
        sexoPessoa : sexoPessoa;
        cidadePessoa : cidadePessoa;
        dtEntrada : dtEntrada;
        dtDesligamento : dtDesligamento;
        dtUltimaParticipacao : dtUltimaParticipacao;
        grupoId : grupoId;
    }
}
                        
    // Criação da tabela somente em caso de alteração ou se a tabela não existe no banco

Grupos.hasMany(pessoas);
pessoas.belongsTo(Grupos);

pessoas
.sync({force: false})
.then(() => {
    console.log("Tabela Pessoas criada com sucesso!!!")
})
.catch(err => {
    console.log("ERRO => " + err.message);
});

module.exports = pessoas;