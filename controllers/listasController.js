const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const EventosParticipantes = require("../models/EventosParticipantes");
const Pessoas = require("../models/Pessoas");
const UtilsEventos = require("../public/js/utilsEventos");
const utilseventos = new UtilsEventos();

router.get("/listas", (req, res) => {
    utilseventos.calcularProximoEvento(2)
    .then( dataEvento => {
        EventosParticipantes
        .findAll({
            attributes: [
                'id',
                'idEvento',
                'pessoaId',
                'valorPago',
                'presenca',
                'pessoa.nmPessoa'
            ],
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