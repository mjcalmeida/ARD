const sequelize = require('sequelize');
const Pessoas = require('../../models/Pessoas');

module.exports = class UtilsPessoas {
    //   ---> Lista dados das pessoas para o autocomplete
    async getNomePessoas(){
        var pessoas = await this.getPessoas();

        var aPessoas = "";

        for ( var i = 0; i < pessoas.length; i++){
            aPessoas += pessoas[i].nmPessoa + "-" + 
                        pessoas[i].id + "|" + 
                        pessoas[i].emailPessoa + "_" + 
                        pessoas[i].grupoId + "?" + 
                        pessoas[i].idFranqueado + ",";
        };
            
        return aPessoas.substring(0,aPessoas.length-1);
    }
//   ---> Pega os dados de uma Pessoa
    getPessoas(){
        return new Promise(resolve => {
            setTimeout(() => {
            Pessoas
            .findAll({
                attributes: [
                    'id',
                    'grupoId',
                    'nmPessoa',
                    'idFranqueado',
                    'emailPessoa'
                ], 
                where: { Ativo: 1 },
                raw: true,
                order: [['nmPessoa', 'ASC']]
                })
            .then(pessoas => {
                return resolve(pessoas);
            })
            .catch(erro => {
                console.log(erro);
            })
            }, 1000);
        });
    }
};