const express = require("express");
const sequelize = require('sequelize');
const op = sequelize.Op;
const router = express.Router();
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
var endOfWeek = require('date-fns/endOfWeek');
var addWeeks = require('date-fns/addWeeks');
var addMonths = require('date-fns/addMonths')

module.exports = class Utils { 
    calcularProximoEvento(idevento) {
        var result = null;
        var dataEvento = null;
        var valorEvento = null;
        
        // Pegar dados do Evento

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
        .then ( evento => {
            if( evento != undefined ){
                var maximoParticipantes = evento.numMaximo;
                var periodicidade = evento.periodicidade;
                dataEvento = evento.dataProximoEvento;
                var valorEvento = evento.valorConvidado;

                // Pegar número Participantes até o momento

                EventosParticipantes
                .findAndCountAll({
                    where: {
                        idEvento: evento.id,
                        [op.and]: {
                            dataParticipacao: evento.dataProximoEvento
                        }
                    },
                    offset: 10,
                    limit: 2
                })
                .then( result => {
                    var quantidadeParticipantes = result.count
                    
                    console.log("--->" + quantidadeParticipantes);
                    console.log("--->" + maximoParticipantes);
                    console.log("--->" + periodicidade);

                    if( quantidadeParticipantes > maximoParticipantes){
                        dataEvento = calculoProximoEvento(periodicidade, )
                    }
                    console.log("--->" + dataEvento);
                })
                .catch ( erro => {
                    console.log(erro);
                });
            } else {
                console.log("sem registros")
            }
        })
        .catch ( erro => {
            console.log(erro);
        })
    
        return result
    };

    calculoProximoEvento(periodicidade, data){
        var data = undefined;

        if(periodicidade == 'Semanal'){
            data = addWeeks(data, 1)
        }

        if(periodicidade == 'Ultimo Sábado do Mes'){

            data = new Date()
        }

        console.log(data);
        return data;
    }

    parseDateBR_ENG(dataBR){
        var Saida = new Date();

        if (dataBR.length == 10){
            Saida = new Date(dataBR.substr(6,4), 
                         dataBR.substr(3,2)-1,
                         dataBR.substr(0,2));
        }
        return Saida;
    }

    chkXama(email){
        return true;
    }
};