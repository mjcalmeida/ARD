const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const Pessoas = require("../models/Pessoas");
const Eventos = require("../models/Eventos");
const {format} = require('date-fns');
const Utils = require("../public/js/utilsPessoas");
const utils = new Utils();   

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
    var dtNascimento = utils.parseDateBR_ENG(req.body.dtNascimento);
        dtNascimento = format(dtNascimento,'yyyy-MM-dd');
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo;
    var receberEmails = req.body.receberEmails;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = utils.parseDateBR_ENG(req.body.dtEntrada);
        dtEntrada = format(dtEntrada,'yyyy-MM-dd');
    var dtDesligamento = utils.parseDateBR_ENG(req.body.dtDesligamento);
        dtDesligamento = format(dtDesligamento,'yyyy-MM-dd');
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtUltimaParticipacao);
        dtUltimaParticipacao = format(dtUltimaParticipacao,'yyyy-MM-dd');
   
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

router.post("/pessoas/edit/update", (req, res) => {
    var id = req.body.id;
    var idGrupo = req.body.idGrupo;
    var nmPessoa = req.body.nmPessoa;
    var dtNascimento = utils.parseDateBR_ENG(req.body.dtNascimento);
        dtNascimento = format(dtNascimento,'yyyy-MM-dd');
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo;
    var receberEmails = req.body.receberEmails;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = utils.parseDateBR_ENG(req.body.dtEntrada);
        dtEntrada = format(dtEntrada,'yyyy-MM-dd');
    var dtDesligamento = utils.parseDateBR_ENG(req.body.dtDesligamento);
        dtDesligamento = format(dtDesligamento,'yyyy-MM-dd');
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtUltimaParticipacao);
        dtUltimaParticipacao = format(dtUltimaParticipacao,'yyyy-MM-dd');    
    Pessoas
    .update(
        {
            idGrupo : idGrupo,
            nmPessoa : nmPessoa,
            dtNascimento :  dtNascimento,
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
        }, {
            where: { id: id },
            returning: true, // needed for affectedRows to be populated
            plain: true      // makes sure that the returned instances are just plain objects
        }        
    )
    .then( () => {
        res.redirect("/pessoas");
    })
    .catch( err =>  {
        console.log(err);
    });
});

router.get("/pessoas/edit/:id", (req, res) => {
    var id = req.params.id;

    if (isNaN(id)){
        res.redirect("/pessoas");
    }

    Pessoas
    .findByPk(id,{
        attributes:[
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
        ]
    })
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

router.post("/pessoas/delete", (req, res) => {
    var id = req.body.id;

    if(id != undefined){
        if(!isNaN(id)){
            Pessoas
                .destroy({
                   where: {id: id}
                })
                .then(() => {
                    res.redirect("/pessoas");
                })
        } else {
            // Não é número
            res.redirect("/pessoas");
        }
    } else {
        // É nulo
        res.redirect("/pessoas")
    }
});

router.get("/pessoas/cadRoda", (req, res) => {    
    // Pegar a data do Próximo Evento de Roda de Cura
    var  proximaRoda = null;
    var availableTags = [];

    utils.calcularProximoEvento(2)
    .then( dataProximoEvento => {
        proximaRoda = dataProximoEvento;

        //console.log("-=-=-=-=-=   Fim     " + proximaRoda + "        =-=-=-=-=-");

        utils.getNomePessoas()
        .then( aPessoas => {
            var availableTags = JSON.stringify(aPessoas);
            res.render("./pessoas/cadRoda", {dataProximoEvento, availableTags});
        })
        .catch(erro => {
            console.log(erro);
        });
    })
    .catch(erro => {
        console.log(erro);
    });
});

module.exports = router;