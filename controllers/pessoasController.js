const express = require("express");
const sequelize = require('sequelize');
const fns = require("date-fns");
const router = express.Router();
const Pessoas = require("../models/Pessoas");

router.get("/pessoas", (req, res) => {
    Pessoas
    .findAll({
        attributes: [
            'id',
            'idGrupo',
            'nmPessoa',
            [sequelize.fn('date_format', sequelize.col('dtNascimento'), '%d/%m/%Y'), 'dtNascimento'],
            'endPessoa',
            'endComplemento',
            'cepPessoa',
            'fonePessoa',
            'Ativo',
            'receberEmails',
            'emailPessoa',
            'sexoPessoa',
            'cidadePessoa',
            [sequelize.fn('date_format', sequelize.col('dtEntrada'), '%d/%m/%Y'), 'dtEntrada'],
            [sequelize.fn('date_format', sequelize.col('dtDesligamento'), '%d/%m/%Y'), 'dtDesligamento'],
            [sequelize.fn('date_format', sequelize.col('dtUltimaParticipacao'), '%d/%m/%Y'), 'dtUltimaParticipacao']
        ], 
        raw: true,
        order: [['id', 'ASC']]
    })
    .then(pessoas => {
        console.log('\033[2J');
        console.log(pessoas);
        res.render("pessoas/index", {
            pessoas : pessoas
        });
    });
});

router.get("/pessoas/new", (req, res) => {
    res.render("./pessoas/new");
});

router.post("/pessoas/save", (req, res) => {
    var idGrupo = req.body.idGrupo;
    var nmPessoa = req.body.nmPessoa;
    var dtNascimento = req.body.dtNascimento;
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo;
    var receberEmails = req.body.receberEmails;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = req.body.dtEntrada;
    var dtDesligamento = req.body.dtDesligamento;
    var dtUltimaParticipacao = req.body.dtUltimaParticipacao;

    if(emailPessoa != undefined){
        Pessoas
        .create({
            idGrupo : 1,
            nmPessoa : nmPessoa,
            dtNascimento : dtNascimento,
            endPessoa : endPessoa,
            endComplemento : endComplemento,
            cepPessoa : cepPessoa,
            fonePessoa : fonePessoa,
            Ativo : Ativo,
            receberEmails : receberEmails,
            emailPessoa : emailPessoa,
            sexoPessoa : sexoPessoa,
            cidadePessoa : cidadePessoa,
            dtEntrada : dtEntrada,
            dtDesligamento : dtDesligamento,
            dtUltimaParticipacao : dtUltimaParticipacao
        })
        .then(() => {
            res.redirect("/pessoas");
        });
    } else {
        res.redirect("/pessoas/new");
    }
});

router.post("/pessoas/update", (req, res) => {
    console.log("Cheguei aqui");
    var idGrupo = req.body.idGrupo;
    var nmPessoa = req.body.nmPessoa;
    var dtNascimento = req.body.dtNascimento;
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo;
    var receberEmails = req.body.receberEmails;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = req.body.dtEntrada;
    var dtDesligamento = req.body.dtDesligamento;
    var dtUltimaParticipacao = req.body.dtUltimaParticipacao;

    Pessoas
    .update({
        idGrupo : 1,
        nmPessoa : nmPessoa,
        dtNascimento : dtNascimento,
        endPessoa : endPessoa,
        endComplemento : endComplemento,
        cepPessoa : cepPessoa,
        fonePessoa : fonePessoa,
        Ativo : Ativo,
        receberEmails : receberEmails,
        emailPessoa : emailPessoa,
        sexoPessoa : sexoPessoa,
        cidadePessoa : cidadePessoa,
        dtEntrada : dtEntrada,
        dtDesligamento : dtDesligamento,
        dtUltimaParticipacao : dtUltimaParticipacao
    })
    .then(() => {
        res.redirect("pessoas");
    });
});

router.get("/pessoas/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)){
        res.redirect("/pessoas");
    }

    Pessoas
    .findByPk(id)
    .then ( pessoa => {
        if( pessoa != undefined ){
            res.render("pessoas/edit", { pessoa : pessoa });
        } else {
            res.redirect("/pessoas");
        }
    })
    .catch ( erro => {
        res.redirect("/pessoas");
    } )
});

router.get("/pessoas/cadRoda", (req, res) => {
    res.render("./pessoas/cadRoda");
});
module.exports = router;