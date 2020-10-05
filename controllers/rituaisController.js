const express = require("express");
const sequelize = require('sequelize');
const fns = require("date-fns");
const eoLocale = require('date-fns/locale/pt-BR')
const router = express.Router();
const Rituais = require("../models/Rituais");

router.get("/rituais", (req, res) => {
    Rituais
    .findAll({
        attributes: [
            'id',
            'nomeRitual',
            'periodicidade',
            [sequelize.fn('date_format', sequelize.col('dataStart'), '%d/%m/%Y %h:%m:%s'), 'dataEvento'],
            'numMinimo',
            'numMaximo',
            'valorConvidado',
            'valorXama'],
        raw: true,
        order: [['id', 'AsC']]
    })
    .then(rituais => {
        console.log('\033[2J');
        console.log(rituais);
        console.log(fns.format(
            new Date(2014, 6, 25),   
            'dd/MM/yyyy',
            {locale: eoLocale}
          ));
        res.render("rituais/index", {
            rituais : rituais
        });
    });
});

router.get("/new", (req, res) => {
    res.render("rituais/new");
});

router.post("/salvarEvento", (req,res) => {
    console.log(req.body);

    var nomeRitual = req.body.nomeRitual;
    var periodicidade = req.body.periodicidade;
    var dataStart = req.body.dataStart;
    var numMinimo = req.body.numMinimo;
    var numMaximo = req.body.numMaximo;
    var valorConvidado = req.body.valorConvidado;
    var valorXama = req.body.valorXama;

Rituais
    .create({
        nomeRitual: nomeRitual,
        periodicidade: periodicidade,
        dataStart: dataStart,
        numMinimo: numMinimo,
        numMaximo: numMaximo,
        valorConvidado: valorConvidado,
        valorXama: valorXama
    })      
    .then(() => {
        console.log('Evento ' + nomeRitual + ' incluído com sucesso!!!');
        res.redirect("/rituais");
    })
}); 

router.post("/deleteEvento", (req, res) => {


});

module.exports = router;