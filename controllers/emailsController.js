const express = require("express");
const router = express.Router();
const Emails = require("../models/Emails");
const slugify = require("slugify");

router.get("/emails", (req, res) => {
    Emails
    .findAll({
         attributes: [
            'id',
            'titulo',
            'slug'],
        raw: true,
        order: [['id', 'ASC']]
    })
    .then(_emails => {
        res.render("admin/emails/index", {
            emails : _emails
        });
    })
    .catch( error => {
        console.log(error);
    });
});

router.get("/formEmails", (req, res) => {
        res.render("admin/emails/formEmails");
});

router.get("/emails/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)){
        res.redirect("/emails");
    }

    Emails
    .findByPk(id, {
        attributes: [
            'id',
            'titulo',
            'slug',
            'body'
        ]
    })
    .then ( email => {
        if( email != undefined ){
            res.render("admin/emails/edit", { email });            
        } else {
            res.redirect("/emails");
        }
    })
    .catch ( erro => {
        console.log(erro);
        res.redirect("/emails");
    })
});

router.post("/emails/save", (req, res) => {
    var titulo = req.body.titulo;
    var body = req.body.body;
    var slug = slugify(titulo);

    Emails
    .create({
        titulo : titulo,
        slug   : slug,
        body   : body
    })
    .then(() => {
        res.redirect("/admin/emails")
    })
})

router.post("/emails/update", (req, res) => {
    var id = req.body.id;
    var titulo = req.body.titulo;
    var body = req.body.body;

    Emails
    .update({
        titulo : titulo,
        body   : body,
        slug   : slugify(titulo)
    }, {
    where: {id : id}})
    .then (() => {
        res.redirect("/emails");
    })
    .catch ( erro => {
        console.log(erro);
        res.redirect("/");
    })
})

module.exports = router;