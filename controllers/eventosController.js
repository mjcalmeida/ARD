const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const Eventos = require("../models/Eventos");

router.get("/eventos", (req, res) => {
    Eventos
    .findAll({
         attributes: [
            'id',
            'nomeEvento',
            'periodicidade',
            [sequelize.fn('date_format', sequelize.col('dataStart'), '%d/%m/%Y %h:%m:%s'), 'dataEvento'],
            'numMinimo',
            'numMaximo',
            'valorConvidado',
            'valorXama'], 
        raw: true,
        order: [['id', 'AsC']]
    })
    .then(eventos => {
        console.log('\033[2J');
        console.log(eventos);
        
        res.render("eventos/index", {
            eventos : eventos
        });
    });
});

router.get("/new", (req, res) => {
    res.render("eventos/new");
});

router.post("/salvarEvento", (req,res) => {
    console.log(req.body);

    var nomeEvento = req.body.nomeEvento;
    var periodicidade = req.body.periodicidade;
    var dataStart = req.body.dataStart;
    var numMinimo = req.body.numMinimo;
    var numMaximo = req.body.numMaximo;
    var valorConvidado = req.body.valorConvidado;
    var valorXama = req.body.valorXama;

Eventos
    .create({
        nomeEvento: nomeEvento,
        periodicidade: periodicidade,
        dataStart: dataStart,
        numMinimo: numMinimo,
        numMaximo: numMaximo,
        valorConvidado: valorConvidado,
        valorXama: valorXama
    })      
    .then(() => {
        console.log('Evento ' + nomeEvento + ' incluído com sucesso!!!');
        res.redirect("/controllers/eventos");
    })
}); 

router.post("/deleteEvento", (req, res) => {

});

module.exports = router;