const dbKnex = require("../../models/database/db_Knex");
const sequelize = require('sequelize');
const op = sequelize.Op;
const Pessoas = require("../../models/Pessoas");
const Eventos = require("../../models/Eventos");
const Timeline = require("../../models/Timeline");
const eventosparticipantes = require("../../models/EventosParticipantes");
const Utils = require("./utils");
const utils = new Utils();
const format = require('date-fns/format');

module.exports = class UtilsEventos {
    async calcularProximoEvento(eventoId) {
        //console.log("+-+-+-+-+-+-         Entrada em calcularProximoEvento         +-+-+-+-+-+-");
        // console.log("Recebido de controller => " + eventoId);
        
        let evento =  await this.getEvento(eventoId);
        
        var dataProximoEvento = utils.parseDateBR_ENG(evento.dataProximoEvento);

        //console.log("Recebido de getEvento => " + dataProximoEvento);

        var quantidadeParticipantes =  await this.contaParticipantes(eventoId, dataProximoEvento);
       
        //console.log("Quantidade de participantes: " + quantidadeParticipantes);

        if (quantidadeParticipantes > evento.numMaximo || ! utils.TDate(dataProximoEvento)) {
            dataProximoEvento = this.calculoProximoEvento(evento.periodicidade, dataProximoEvento);

            //  Cadastramento dos VIP´s
            this.putVips(dataProximoEvento);
        }

        //console.log("+-+-+-+-+-+-          Saida atualizado do Proximo Evento]          +-+-+-+-+-+-");
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
        var where = { id : eventoId };

        utils.updateOrCreate (model, where, newItem)
        .catch( error =>  {
            console.log(error);
        });

        return dataProximoEvento;
    }

    getEvento(eventoId) {
        return new Promise(resolve => {
            setTimeout(() => {
                var dataProximoEvento = null;
            //    console.log("+-+-+-+-+-+-               Entrada em getEvento               +-+-+-+-+-+-");
            //    console.log("Recebido o id do evento: " + eventoId);

                Eventos
                .findByPk(eventoId, {
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

    putVips(dataProximoEvento){
        Pessoas
        .findAll({
            attributes: [
                'id',
                'grupoId',
                'emailPessoa',
                'VIP'
            ],
            where : { VIP : 1 },
            raw: true
        })
        .then(pessoa => {
            for (var n = 0; pessoa.length -1; n++){
                this.addParticipacaoEvento(
                    1, 
                    pessoa[n].id, 
                    pessoa[n].grupoId, 
                    utils.parseDateBR_ENG(dataProximoEvento), 
                    pessoa[n].emailPessoa, 0, 0, '')
            }
        })
        .catch(err => {
            console.log("ERRO => " + err.message);
        });
    }
    
    //   --->    Grava a participação na Roda - Grava ou altera na tabela
    addParticipacaoEvento(eventoId, id, grupoId, dtProximaParticipacao, emailPessoa, presenca, valorEvento, observacao){
        var newItem =
        {   eventoId        : eventoId, 
            pessoaId        : id,
            valorPago       : valorEvento,
            presenca        : presenca,
            emailPessoa     : emailPessoa,
            observacao      : observacao,
            dataParticipacao : dtProximaParticipacao
        };
        
        var model = eventosparticipantes;
        var where = 
        {   eventoId        : eventoId, 
            pessoaId        : id,
            dataParticipacao: dtProximaParticipacao
        };
        
        utils.updateOrCreate (model, where, newItem);
    };
    
    async getValorEvento(eventoid, grupoId){
        let evento = await this.getEvento(eventoId);
        var valor = grupoId == 1 ? evento.valorConvidado : evento.valorXama;
        return valor;
    };
    
    contaParticipantes(eventoId, dataProximoEvento){
        return new Promise(resolve => {
            setTimeout(() => {
            //    console.log("+-+-+-+-+-+-            Entrada em contaParticipantes            +-+-+-+-+-+-");
            //    console.log("Recebido o id do evento: " + eventoId);
            //    console.log("Recebida data do evento: " + dataProximoEvento);

                var quantidadeParticipantes = 0;

                eventosparticipantes
                .findAndCountAll({
                    where: {
                        eventoId: eventoId,
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

    async getTimeline(eventoid){
        return new Promise(resolve => {            
            dbKnex.raw(
            `SELECT tl.id, ev.nomeEvento,
            tl.antesDepois,
            tl.quantidade,
            tl.unidade,
            tl.acao,
            em.Titulo,
            if(tl.unidade = "Dias", 
                if( tl.antesDepois = "-",
                    date_sub(ev.dataProximoEvento, interval tl.quantidade day),
                    date_add(ev.dataProximoEvento, interval tl.quantidade day)),
                    if( tl.unidade = "Meses", 
                        if( tl.antesDepois = "-",
                            date_sub(ev.dataProximoEvento, interval tl.quantidade month),
                            date_add(ev.dataProximoEvento, interval tl.quantidade month)),
                    if( tl.unidade = "Anos", 
                if( tl.antesDepois = "-",
                    date_sub(ev.dataProximoEvento, interval tl.quantidade day),
                    date_add(ev.dataProximoEvento, interval tl.quantidade day)), 
                "Erro")
            )) dataEmissao
            FROM ard.Timeline tl
            inner join eventos ev on ev.id = tl.eventoId
            inner join emails  em on em.id = tl.emailId
            order by dataEmissao asc`
            )
            .then(result => {
                var Saida = result[0];

                for(var n = 0; n < Saida.length; n++){
                    Saida[n].dataEmissao = utils.parseDateENG_BR(Saida[n].dataEmissao);
                };
                
                resolve(Saida);
            })
            .catch(erro => {
                console.log(erro);
            });
        })
    }
}