const sequelize = require('sequelize');
const op = sequelize.Op;
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
const Utils = require("./utils");
const utils = new Utils();
const format = require('date-fns/format');

module.exports = class UtilsEventos {
    async calcularProximoEvento(idevento) {
        //console.log("+-+-+-+-+-+-         Entrada em calcularProximoEvento         +-+-+-+-+-+-");
        // console.log("Recebido de controller => " + idevento);
        
        let evento =  await this.getEvento(idevento);
        
        var dataProximoEvento = utils.parseDateBR_ENG(evento.dataProximoEvento);

        //console.log("Recebido de getEvento => " + dataProximoEvento);

        var quantidadeParticipantes =  await this.contaParticipantes(idevento, dataProximoEvento);
       
        //console.log("Quantidade de participantes: " + quantidadeParticipantes);

        if (quantidadeParticipantes > evento.numMaximo || ! utils.TDate(dataProximoEvento)) {
            dataProximoEvento = this.calculoProximoEvento(evento.periodicidade, dataProximoEvento);
        }

        //console.log("+-+-+-+-+-+-          Saida atualizada do Proximo Evento]          +-+-+-+-+-+-");
        var newItem = 
            {   dataProximoEvento: utils.parseDateBR_ENG(dataProximoEvento),
                nomeEvento : evento.nomeEvento,
                periodicidade : evento.periodicidade,
                horaProximoEvento : evento.horaProximoEvento,
                numMinimo : evento.numMinimo,
                numMaximo : evento.numMaximo,
                valorConvidado : evento.valorConvidado,
                valorXama : evento.valorXama
            };
        var model = Eventos;
        var where = { id : idevento };

        utils.updateOrCreate (model, where, newItem)
        .catch( error =>  {
            console.log(error);
        });

        var x =  utils.parseDateENG_BR(dataProximoEvento);
        return x;
    }

    getEvento(idevento) {
        return new Promise(resolve => {
            setTimeout(() => {
                var dataProximoEvento = null;
            //    console.log("+-+-+-+-+-+-               Entrada em getEvento               +-+-+-+-+-+-");
            //    console.log("Recebido o id do evento: " + idevento);

                Eventos
                .findByPk(idevento, {
                    attributes: [
                        'id',
                        'nomeEvento',
                        'periodicidade',
                        [sequelize.fn('date_format', sequelize.col('dataProximoEvento'), '%d/%m/%Y'), 'dataProximoEvento'],
                        'horaProximoEvento',
                        'numMinimo',
                        'numMaximo',
                        'valorConvidado',
                        'valorXama'
                    ]
                })
                .then( evento => {
                    if (evento != undefined) {
                        dataProximoEvento   = evento.dataProximoEvento.substr(6,4) + "-" +
                        evento.dataProximoEvento.substr(3,2) + "-" +
                        evento.dataProximoEvento.substr(0,2);                      

                //        console.log("Retornando a data cadastrada de próximo evento: " + dataProximoEvento);
                        
               //         console.log("+-+-+-+-+-+-              Saida em getEvento              +-+-+-+-+-+-");
                        resolve(evento);             
                    } else {
                        console.log("sem registros")
                    }
                })
                .catch(erro => {
                    console.log(erro);
                })
            }, 1000)
        }); 
    }

    contaParticipantes(idevento, dataProximoEvento){
        return new Promise(resolve => {
            setTimeout(() => {
            //    console.log("+-+-+-+-+-+-            Entrada em contaParticipantes            +-+-+-+-+-+-");
            //    console.log("Recebido o id do evento: " + idevento);
            //    console.log("Recebida data do evento: " + dataProximoEvento);

                var quantidadeParticipantes = 0;
                dataProximoEvento = utils.parseDateBR_ENG(dataProximoEvento);

                EventosParticipantes
                .findAndCountAll({
                    where: {
                        idEvento: idevento,
                        [op.and]: {
                            dataParticipacao: dataProximoEvento
                        }
                    },
                    offset: 10,
                    limit: 2
                })
                .then(result => {
                    if(result != undefined) { 
        //                console.log("Retornando a quantidade: " + result.count);                       
        //                console.log("+-+-+-+-+-+-              Saida contaParticipantes              +-+-+-+-+-+-");               
                        return resolve(result.count);
                    } else {
                        return resolve(0);
                    }
                })
                .catch(erro => {
                    console.log(erro);
                });
            }, 1000)
        });
    }

    calculoProximoEvento(periodicidade, dataProximoEvento) {
//        console.log("+-+-+-+-+-+-            Entrada em calculoProximoEvento            +-+-+-+-+-+-");
//        console.log("Recebida data do evento: " + dataProximoEvento);
//        console.log("Recebida a Periodicidade: " + periodicidade);
        
        if (periodicidade == 'Semanal') {
            while (! utils.TDate(dataProximoEvento)) {
                dataProximoEvento = new Date(dataProximoEvento);
                dataProximoEvento.setDate(dataProximoEvento.getDate()+7);
                dataProximoEvento = dataProximoEvento.getTime()
            }
            dataProximoEvento = new Date(dataProximoEvento);
        }
        
        if (periodicidade == 'Ultimo Sábado do Mes') {
            data = new Date();
        }        
        
        return format(dataProximoEvento,'dd/MM/yyyy');
    };

    addParticipacaoEvento(idEvento, id, idGrupo, dtProximaParticipacao){
        dtProximaParticipacao = utils.parseDateBR_ENG(dtProximaParticipacao);

        this.getValorEvento(idEvento, idGrupo)
        .then( valorEvento => {
            var newItem =
                {   idEvento        : idEvento, 
                    pessoaId        : id, 
                    dataParticipacao: dtProximaParticipacao,
                    valorPago       : valorEvento,
                    presenca        : 0
                };

            var model = EventosParticipantes;
            var where = 
                {   idEvento        : idEvento, 
                    pessoaId        : id,
                    dataParticipacao: dtProximaParticipacao
                };

            utils.updateOrCreate (model, where, newItem);
        });
    };
    
    async getValorEvento(idEvento, idGrupo){
        let evento =  await this.getEvento(idEvento);
        var valor = idGrupo == 0 ? evento.valorConvidado : evento.valorXama;
        return valor;
    };
}