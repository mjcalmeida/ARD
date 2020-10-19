const sequelize = require('sequelize');
const op = sequelize.Op;
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
const format = require('date-fns/format')

module.exports = class Utils {
    calcularProximoEvento(idevento) {
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
        .then(evento => {
            if (evento != undefined) {
                var maximoParticipantes = evento.numMaximo;
                var periodicidade       = evento.periodicidade;
                var dataProximoEvento   = evento.dataProximoEvento.substr(3,2) + "-" +
                                          evento.dataProximoEvento.substr(0,2) + "-" +
                                          evento.dataProximoEvento.substr(6,4);
                    valorEvento         = evento.valorConvidado;
     
                // Pegar número Participantes até o momento
                
                EventosParticipantes
                .findAndCountAll({
                    where: {
                        idEvento: evento.id,
                        [op.and]: {
                            dataParticipacao: dataProximoEvento
                        }
                    },
                    offset: 10,
                    limit: 2
                })
                .then(result => {
                    var quantidadeParticipantes = result.count
                    
                    if (quantidadeParticipantes > maximoParticipantes || ! this.TDate(dataProximoEvento)) {
                            dataProximoEvento = this.calculoProximoEvento(periodicidade, dataProximoEvento);
                        }
                        
                        return dataProximoEvento;
                    })
                .catch(erro => {
                    console.log(erro);
                });                
            } else {
                console.log("sem registros")
            }
        })
        .catch(erro => {
            console.log(erro);
        })
    };
            
    calculoProximoEvento(periodicidade, dataProximoEvento) {
        if (periodicidade == 'Semanal') {
            while ( ! this.TDate(dataProximoEvento)) {
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
        var ToDate = new Date();
          
        if (new Date(UserDate).getTime() <= ToDate.getTime()) {
            return false;
        }
        return true;
    }
};