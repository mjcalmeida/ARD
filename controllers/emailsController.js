const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const Emails = require("../models/Emails");
const Eventos = require("../models/Eventos");
const slugify = require("slugify");

router.get("/emails", (req, res) => {
    Emails
    .findAll({
         attributes: [
            'id',
            'titulo',
            'eventoId',
            'evento.nomeEvento',
            'slug'], 
            include : [{
                model: Eventos,
                required: true
            }],
        raw: true,
        order: [['id', 'ASC']]
    })
    .then(_emails => {
        res.render("admin/emails/formEmails", {
            emails : _emails
        });
    })
    .catch( error => {
        console.log(error);
    });
});

router.post("/emails/save", (req, res) => {
    var titulo = req.body.titulo;
    var body   = req.body.body;
    var eventoId = req.body.eventoSelecao;

    if(titulo != 'undefined'){
        Emails
        .create ({
            titulo   : titulo,
            eventoId : eventoid,
            slug     : slugify(titulo),
            body     : body
        })
        .then( () => {
            res.redirect("/")
        });
    }else{
        res.redirect(admin/emails/formEmails);
    }
});

module.exports = router;