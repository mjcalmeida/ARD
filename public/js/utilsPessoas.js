const sequelize = require('sequelize');
const op = sequelize.Op;
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
const format = require('date-fns/format');
const getYear = require('date-fns/getYear')
const getMonth = require('date-fns/getMonth')
const getDate = require('date-fns/getDate');
const Pessoas = require('../../models/Pessoas');
module.exports = class UtilsPessoas {
    async calcularProximoEvento(idevento) {
        //console.log("+-+-+-+-+-+-         Entrada em calcularProximoEvento         +-+-+-+-+-+-");
       // console.log("Recebido de controller => " + idevento);
        
        var dataProximoEvento = await this.getEvento(idevento);
        
        //console.log("Recebido de getEvento => " + dataProximoEvento);

        var quantidadeParticipantes =  await this.contaParticipantes(idevento, dataProximoEvento);
        
        //console.log("Quantidade de participantes: " + quantidadeParticipantes);

        var maximoParticipantes = 2;
        var periodicidade = 'Semanal';

        if (quantidadeParticipantes > maximoParticipantes || ! this.TDate(dataProximoEvento)) {
            dataProximoEvento = this.calculoProximoEvento(periodicidade, dataProximoEvento);
        }

        //console.log("+-+-+-+-+-+-          Saida de calcularProximoEvento          +-+-+-+-+-+-");
        return dataProximoEvento;
    }

    async getNomePessoas(){
        var pessoas = await this.getPessoas();

        var aPessoas = "";

        for ( var i = 0; i < pessoas.length; i++){
            aPessoas += pessoas[i].nmPessoa + "-" + pessoas[i].id + "|" + pessoas[i].emailPessoa + ",";
        };
            
        return aPessoas.substring(0,aPessoas.length-1);
    }

    getPessoas(){
        return new Promise(resolve => {
            setTimeout(() => {
            Pessoas
            .findAll({
                attributes: [
                    'id',
                    'idGrupo',
                    'nmPessoa',
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
    
    getEvento(idevento) {
        return new Promise(resolve => {
            setTimeout(() => {
                var dataProximoEvento = null;
            //    console.log("+-+-+-+-+-+-               Entrada em getEvento               +-+-+-+-+-+-");
            //    console.log("Recebido o id do evento: " + idevento);

                // Pegar dados do Evento
                var valorEvento = null;
                var maximoParticipantes = 0;
                var periodicidade = null;
                var quantidadeParticipantes = 0;

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
                        resolve(dataProximoEvento);             
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
            var arrDataEvento = dataProximoEvento.split('-');
            dataProximoEvento = new Date(arrDataEvento[0], arrDataEvento[1] - 1, arrDataEvento[2]);

            while (! this.TDate(dataProximoEvento)) {
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
    
    parseDateBR_ENG(dataBR) {
        var Saida = new Date();
        
        if (dataBR.length == 10) {
            Saida = new Date(dataBR.substr(6, 4),
            dataBR.substr(3, 2) - 1,
            dataBR.substr(0, 2));
        }
        return Saida;
    };
    
    chkXama(email) {
        return true;
    }
    
    TDate(UserDate) {
        var TodayDate = new Date();        
        UserDate = new Date(UserDate);

        TodayDate = ( getYear(TodayDate)      * 10000) + 
                    ((getMonth(TodayDate) +1) *   100) + 
                    ( getDate(TodayDate));
        
        UserDate  = ( getYear(UserDate)       * 10000) + 
                    ((getMonth(UserDate) +1)  *   100) + 
                    ( getDate(UserDate));
        
    //    console.log(UserDate + " <= " + TodayDate + " = " + (UserDate <= TodayDate));

        if (UserDate < TodayDate) {
            return false;
        }
        return true;
    }
};