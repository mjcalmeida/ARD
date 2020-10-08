const sequelize = require('sequelize');
const Eventos = require("../../models/Eventos");
var endOfWeek = require('date-fns/endOfWeek')

module.exports = class Utils { 
    calcularProximoEvento(evento) {
        var result = null;
console.log('********************************************************************      ' + evento)
        // Pegar dados do Evento

        Eventos
        .findByPk(evento, {
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
                console.log(evento);
            } else {
                res.redirect("../admin");
            }
        })
        .catch ( erro => {
            res.redirect("../admin");
        } )

        if (evento == 1){
            // Calcula a próxima date de evento
            result = endOfWeek(new Date(), {weekStartsOn: 5})
        }
        return result
    };

    parseDateBR_ENG(dataBR){
        var Saida = new Date();

        if (dataBR.length == 10){
            Saida = new Date(dataBR.substr(6,4), 
                         dataBR.substr(3,2)-1,
                         dataBR.substr(0,2));
        }
        return Saida;
    }
};