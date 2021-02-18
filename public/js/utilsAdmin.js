const dbKnex = require("../../models/database/db_Knex");
const Utils = require("./utils");
const utils = new Utils();

module.exports = class UtilsAdmin {
    getDados(eventoId){
        return new Promise( resolve => {

            var Saida=[];
            
            dbKnex
            .select( "dataParticipacao", 
                     "grupoId",
                     dbKnex.raw("SUM(valorPago) as valor"),
                     dbKnex.raw("count(valorPago) as quantidade")
            )
            .table("eventosparticipantes")
            .innerJoin("pessoas", "pessoas.id", "eventosparticipantes.pessoaId")
            .where({ presenca : 1 })
            .groupBy("dataParticipacao", "grupoId")
            .orderBy("dataParticipacao", "desc", "grupoId", "asc")
            .then( data => {
                var n = 0;
                
                data.forEach(dtEvento => {
                    var dt = utils.parseDateENG_BR(dtEvento.dataParticipacao)
                    var dt2 = dtEvento.dataParticipacao;
                    var dt3 = dt.toString().substring(0,5)
                    var preSaldo = 0;

                    if(utils.chkArray(Saida, 0, dt) == false){
                        Saida[n]=[dt, 0, 0, 0, 0, 0, dt2, dt3];
                        n++;
                    }

                    if( dtEvento.grupoId == 1 ){
                        Saida[n-1][1] = dtEvento.quantidade;
                        Saida[n-1][3] = utils.convDoubleBR(dtEvento.valor);
                        preSaldo = parseFloat(Saida[n-1][5]) + parseFloat(dtEvento.valor)
                        Saida[n-1][5] = utils.convDoubleBR(preSaldo);
                        Saida[n-1][5] = parseFloat(Saida[n-1][5]) + parseFloat(dtEvento.valor);
                    }
                    
                    if( dtEvento.grupoId == 2 ){
                        Saida[n-1][2] = dtEvento.quantidade;
                        Saida[n-1][4] = utils.convDoubleBR(dtEvento.valor);
                        
                        preSaldo = parseFloat(Saida[n-1][5]) + parseFloat(dtEvento.valor)
                        Saida[n-1][5] = utils.convDoubleBR(preSaldo);
                    }               
                });
                
                resolve(Saida);
            })
            .catch( err => {
                console.log(err);
            })
        });
    }

    getSaldos(){
        return new Promise( resolve => {
            dbKnex
            .select("nmPessoa",
                    dbKnex.raw("SUM(valorPago) - count(pessoaId) * 10 as Saldo") 
            )
            .table("eventosparticipantes")
            .innerJoin("pessoas", "pessoas.id", "eventosparticipantes.pessoaId")
            .where({ "pessoas.idFranqueado" : "0" })
            .having( "Saldo","<>", "0")
            .groupBy("pessoas.nmPessoa")            
            .orderBy("pessoas.id")
            .then( data => {
                data.forEach(reg => {
                    reg.Saldo = utils.convDoubleBR(reg.Saldo);
                });
                resolve(data);
            })
            .catch( err => {
                console.log(err);
            })
        });
    }
}