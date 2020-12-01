const express = require("express");
const router = express.Router();
const EventosParticipantes = require("../models/EventosParticipantes");
const Pessoas = require("../models/Pessoas");
const Grupos = require("../models/Grupos");
const UtilsEventos = require("../public/js/utilsEventos");
const utilseventos = new UtilsEventos();

const Utils = require("../public/js/utils");   
const utils = new Utils();

router.post('/cadPresenca', (req, res) => {
    const eventoId = req.body.eventoId;
    const idPessoa = req.body.pessoaId;
    const presenca =  1;
    const valorPago = req.body.valorPago;
    const observacao = req.body.observacao;
    const dataEvento = utils.parseDateBR_ENG(req.body.dataEvento);

    //  Atualizando Pessoas

    Pessoas
    .update(
        { dtUltimaParticipacao : dataEvento },
        {
            where: { id: idPessoa },
            returning: true, // needed for affectedRows to be populated
            plain: true      // makes sure that the returned instances are just plain objects
        }
    )
    .then( () => {
        var newItem =
            {   dataParticipacao: dataEvento,
                valorPago       : valorPago,
                presenca        : presenca,
                observacao      : observacao,
            };
        var model = EventosParticipantes;
        var where = 
        {   eventoId        : eventoId, 
            pessoaId        : idPessoa,
            dataParticipacao: dataEvento
        };

        utils.updateOrCreate (model, where, newItem)
        .then( () => {
            console.log("Cadastro Atualizado");
            res.redirect("/listas");
            
        })
        .catch(err =>  {
            console.log(err);
        })
    })
    .catch( err =>  {
        console.log(err);
    });
});

router.get("/listas", (req, res) => {
    utilseventos.calcularProximoEvento(1)
    .then( dataEvento => {
        EventosParticipantes
        .findAll({
            attributes: [
                'id',
                'eventoId',
                'pessoaId',
                'valorPago',
                'observacao',
                'presenca',
                'dataParticipacao',
                'pessoa.nmPessoa'
            ],
            where : {dataParticipacao : utils.parseDateBR_ENG(dataEvento)},
            include : [{
                model: Pessoas,
                required: true
            }],
            raw: true,
            order: [['pessoa','nmPessoa', 'ASC']]
        })
        .then(eventosRoda => {
            res.render("listas/roda/index", {
                eventosRoda : eventosRoda,
                dataEvento : utils.parseDateENG_BR(dataEvento)
            });
        })
        .catch(err => {
            console.log("ERRO => " + err.message);
        });
    })
    .catch(erro => {
        console.log(erro);
    });
});

module.exports = router;