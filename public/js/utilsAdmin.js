const sequelize = require('sequelize');
const Pessoas = require("../../models/Pessoas");
const Eventos = require("../../models/Eventos");
const EventosParticipantes = require("../../models/EventosParticipantes");
const Grupos = require('../../models/Grupos');
const conn   = require("../../models/database/database");


module.exports = class UtilsAdmin {
    async getDados(eventoId){

        EventosParticipantes
        .findAll({
            attributes: {
                include : [
                    [sequelize.literal(
                        '(Select Count(*) From EventosParticipantes ep inner join Pessoas pe on ep.pessoaId = pe.id where pe.grupoId = 1 )'
                    ), 'qtConvidados']
                ]
            },           
            include : [{
                model: Pessoas,
                include : [{
                    model: Grupos,
                    required : true
                }],
                required: true
            }],
            where : { presenca : 1 },
            group: ['dataParticipacao'],
            raw: true,
            order: [['dataParticipacao', 'DESC']]
        })
        .then(eventos => {
            console.log(eventos);           
        })
        .catch((error) => {
            console.log(error);
        });


    } 
}