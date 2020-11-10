const express = require("express");
const router = express.Router();
const EventosParticipantes = require("../models/EventosParticipantes");
const Pessoas = require("../models/Pessoas");
const UtilsEventos = require("../public/js/utilsEventos");
const utilseventos = new UtilsEventos();


const Utils = require("../public/js/utils");     // retirar
const utils = new Utils();    // retirar

router.post('/cadPresenca', (req, res) => {
    const idEvento = req.body.idEvento;
    const idPessoa = req.body.pessoaId;
    const presenca = req.body.presenca=='on' ? 1 : 0;
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
        {   idEvento        : idEvento, 
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
    utilseventos.calcularProximoEvento(2)
    .then( dataEvento => {
        dataEvento = '05/11/2020';    // retirar
        EventosParticipantes
        .findAll({
            attributes: [
                'id',
                'idEvento',
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
            order: [['pessoaId', 'ASC']]
        })
        .then(eventosRoda => {
            res.render("listas/roda/index", {
                eventosRoda : eventosRoda,
                dataEvento : dataEvento
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