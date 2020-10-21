const sequelize = require('sequelize');
const op = sequelize.Op;
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
const format = require('date-fns/format')

module.exports = class Utils {
    async calcularProximoEvento(idevento) {
        var dataProximoEvento = this.getEvento(idevento);

        return await dataProximoEvento;
    }

    getEvento(idevento) {
        var valorEvento = null;
        var maximoParticipantes = 0;
        var periodicidade = null;
        var quantidadeParticipantes = 0;
        var dataProximoEvento = null;
    
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
                periodicidade       = evento.periodicidade; 
                maximoParticipantes = evento.numMaximo;
                dataProximoEvento   = evento.dataProximoEvento.substr(3,2) + "-" +
                                      evento.dataProximoEvento.substr(0,2) + "-" +
                                      evento.dataProximoEvento.substr(6,4);
                valorEvento         = evento.valorConvidado;
        
                // Pegar número Participantes até o momento                
                quantidadeParticipantes = this.contaParticipantes(evento.id, dataProximoEvento)
                            
                if (quantidadeParticipantes > maximoParticipantes || ! this.TDate(dataProximoEvento)) {
                    dataProximoEvento = this.calculoProximoEvento(periodicidade, dataProximoEvento);
                }
                
<<<<<<< HEAD
                return new Promise(resolve => {
                    resolve(idevento);
                })
=======
                var quantidadeParticipantes = this.contaParticipantes(evento.id, dataProximoEvento);

                if (quantidadeParticipantes > maximoParticipantes || ! this.TDate(dataProximoEvento)) {
                    dataProximoEvento = this.calculoProximoEvento(periodicidade, dataProximoEvento);
                }

                return dataProximoEvento;
>>>>>>> 10b36f00d0158ad718755606480d8a1e83c27d4c
            } else {
                console.log("sem registros")
            }
        })
        .catch(erro => {
            console.log(erro);
        })
    };
            
    async calculoProximoEvento(periodicidade, dataProximoEvento) {
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

    contaParticipantes(evento, dataProximoEvento){
        EventosParticipantes
        .findAndCountAll({
            where: {
                idEvento: evento,
                [op.and]: {
                    dataParticipacao: dataProximoEvento
                }
            },
            offset: 10,
            limit: 2
        })
        .then(result => {
<<<<<<< HEAD
            var quantidadeParticipantes = result.count
            return dataProximoEvento;
        })
        .catch(erro => {
            console.log(erro);
        });
=======
            return result.count;
            })
        .catch(erro => {
            console.log(erro);
        });                
>>>>>>> 10b36f00d0158ad718755606480d8a1e83c27d4c
    }
};