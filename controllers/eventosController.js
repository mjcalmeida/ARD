const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const Eventos = require("../models/Eventos");
const {format} = require('date-fns');

const Utils = require("../public/js/utils");
const utils = new Utils();

const UtilsEventos = require("../public/js/utilsEventos");
const utilsEventos = new UtilsEventos();

router.get("/eventos", (req, res) => {
    Eventos
    .findAll({
         attributes: [
            'id',
            'nomeEvento',
            'periodicidade',
            [sequelize.fn('date_format', sequelize.col('dataProximoEvento'), '%d/%m/%Y'), 'dataProximoEvento'],
            'horaProximoEvento',
            'numMinimo',
            'numMaximo',
            'valorConvidado',
            'valorXama'], 
        raw: true,
        order: [['id', 'ASC']]
    })
    .then(eventos => {
        res.render("eventos/index", {
            eventos : eventos
        });
    });
});

router.get("/eventos/new", (req, res) => {
    res.render("./eventos/new");
});

router.post("/eventos/save", (req,res) => {
    var nomeEvento = req.body.nomeEvento;
    var periodicidade = req.body.periodicidade;
    var dataProximoEvento = utils.parseDateBR_ENG(req.body.dataProximoEvento);
    var horaProximoEvento = req.body.horaProximoEvento;
    var numMinimo = req.body.numMinimo;
    var numMaximo = req.body.numMaximo;
    var valorConvidado = req.body.valorConvidado;
    var valorXama = req.body.valorXama;

    if(nomeEvento != undefined){
        Eventos
        .create({
            nomeEvento: nomeEvento,
            periodicidade: periodicidade,
            dataProximoEvento: dataProximoEvento,
            horaProximoEvento: horaProximoEvento,
            numMinimo: numMinimo,
            numMaximo: numMaximo,
            valorConvidado: valorConvidado,
            valorXama: valorXama
        })      
        .then(() => {
            res.redirect("/eventos");
        })
    } else {
        res.redirect("/eventos/new");
    }
}); 

router.post("/eventos/edit/update", (req, res) => {
    var id = req.body.id;
    var nomeEvento = req.body.nomeEvento;
    var periodicidade = req.body.periodicidade;
    var dataProximoEvento = utils.parseDateBR_ENG(req.body.dataProximoEvento);
    var horaProximoEvento = horaProximoEvento;
    var numMinimo = req.body.numMinimo;
    var numMaximo = req.body.numMaximo;
    var valorConvidado = req.body.valorConvidado;
    var valorXama = req.body.valorXama;

    if(nomeEvento != undefined){
        Eventos
        .update({
            nomeEvento: nomeEvento,
            periodicidade: periodicidade,
            dataProximoEvento: dataProximoEvento,
            horaProximoEvento: horaProximoEvento,
            numMinimo: numMinimo,
            numMaximo: numMaximo,
            valorConvidado: parseFloat(valorConvidado),
            valorXama: parseFloat(valorXama)
        }, {         
            where: { id: id },
            returning: true, // needed for affectedRows to be populated
            plain: true      // makes sure that the returned instances are just plain objects
        })
        .then(() => {
            res.redirect("/eventos");
        })
        .catch( error =>  {
            console.log(error);
        });
    }
});

router.get("/eventos/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)){
        res.redirect("/eventos");
    }

    Eventos
    .findByPk(id, {
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
            evento.valorConvidado = utils.convDoubleBR(evento.valorConvidado);
            evento.valorXama      = utils.convDoubleBR(evento.valorXama);

            utilsEventos.getTimeline(evento.id)
            .then(timeline => {
                res.render("eventos/edit", { evento, timeline });
            })
            .catch(erro => {
                console.log(erro);
            });            
        } else {
            res.redirect("/eventos");
        }
    })
    .catch ( erro => {
        console.log(erro);
        res.redirect("/eventos");
    })
});

router.post("/eventos/delete", (req, res) => {
    var id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Eventos
                .destroy({
                   where: {id: id}
                })
                .then(() => {
                    res.redirect("/eventos");
                })
        } else {
            // Não é número
            res.redirect("/eventos");
        }
    } else {
        // É nulo
        res.redirect("/eventos")
    }
});

module.exports = router;