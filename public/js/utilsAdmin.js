const dbKnex = require("../../models/database/db_Knex");
const Utils = require("./utils");
const utils = new Utils();

module.exports = class UtilsAdmin {
    getDados(eventoId){
        return new Promise( resolve => {

            var Saida=[];
            
            dbKnex
            .select( "eventosparticipantes.dataParticipacao", 
            "grupoId",
            dbKnex.raw("SUM(valorPago) as valor"),
            dbKnex.raw("count(valorPago) as quantidade")
            )
            .table("EventosParticipantes")
            .innerJoin("Pessoas", "pessoas.id", "eventosParticipantes.pessoaId")
            .where({ presenca : 1 })
            .groupBy("eventosparticipantes.dataParticipacao", "grupoId")
            .orderBy("eventosparticipantes.dataParticipacao", "desc", "grupoId", "asc")
            .then( data => {
                var n = 0;
                
                data.forEach(dtEvento => {
                    var dt = utils.parseDateENG_BR(dtEvento.dataParticipacao)
                    var dt2 = dtEvento.dataParticipacao;
                    
                    if(utils.chkArray(Saida, 0, dt) == false){
                        Saida[n]=[dt, 0, 0, 0, 0, dt2];
                        n++;
                    }

                    if( dtEvento.grupoId == 1 ){
                        Saida[n-1][1] = dtEvento.quantidade;
                        Saida[n-1][3] = dtEvento.valor;
                    }
                    
                    if( dtEvento.grupoId == 2 ){
                        Saida[n-1][2] = dtEvento.quantidade;
                        Saida[n-1][4] = dtEvento.valor;                      
                    }               
                });
                
                resolve(Saida);
            })
            .catch( err => {
                console.log(err);
            })
        });
    } 
}