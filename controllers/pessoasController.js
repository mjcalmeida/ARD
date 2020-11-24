const express = require("express");
const sequelize = require('sequelize');
const router = express.Router();
const Pessoas = require("../models/Pessoas");
const Utils = require("../public/js/utils");
const utils = new Utils();
const UtilsEventos = require("../public/js/utilsEventos");
const utilseventos = new UtilsEventos();
const UtilsPessoas = require("../public/js/utilsPessoas");
const utilsPessoas = new UtilsPessoas();  
const {format} = require('date-fns');

router.get("/pessoas", (req, res) => {
    Pessoas
    .findAll({
        attributes: [
            'id',
            'grupoId',
            'nmPessoa',
            [sequelize.fn('date_format', sequelize.col('dtNascimento'), '%d/%m/%Y'), 'dtNascimento'],
            'endPessoa',
            'endComplemento',
            'cepPessoa',
            'fonePessoa',
            'Ativo',
            'receberEmails',
            'emailPessoa',
            'VIP',
            'sexoPessoa',
            'cidadePessoa',
            [sequelize.fn('date_format', sequelize.col('dtEntrada'), '%d/%m/%Y'), 'dtEntrada'],
            [sequelize.fn('date_format', sequelize.col('dtDesligamento'), '%d/%m/%Y'), 'dtDesligamento'],
            [sequelize.fn('date_format', sequelize.col('dtUltimaParticipacao'), '%d/%m/%Y'), 'dtUltimaParticipacao']
        ], 
        raw: true,
        order: [['nmPessoa', 'ASC']]
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
    var TodayDate = new Date();
    var grupoId = req.body.grupoId;
    var nmPessoa = req.body.nmPessoa;
    var dtNascimento = utils.parseDateBR_ENG(req.body.dtNascimento);
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo == '' ? 1 : req.body.Ativo;
    var receberEmails = req.body.receberEmails== '' ? 1 : req.body.Ativo;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var VIP = req.body.VIP == '' ? 0 : req.body.VIP;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = req.body.dtEntrada == '' ? TodayDate : utils.parseDateBR_ENG(req.body.dtEntrada);        
    var dtDesligamento = utils.parseDateBR_ENG(req.body.dtDesligamento);        
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtUltimaParticipacao);
          
    if(emailPessoa != undefined){
        Pessoas
        .create({
            grupoId : grupoId,
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
            VIP : VIP,
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

router.post("/pessoas/saveRoda", (req, res) => {    
    var nmPessoa = req.body.nmPessoa;
    var TodayDate = new Date();
    var Ativo = 1;
    var valorEvento = req.body.valorEvento == '' ? 0 : req.body.valorEvento;
    var emailPessoa = req.body.emailPessoa == '' ? '' : req.body.emailPessoa;
    var observacao = req.body.observacao;
    var id = req.body.ID == '' ? 0 : req.body.ID;
    var receberEmails = req.body.emailPessoa == '' ? 0 : 1;
    var grupoId = req.body.Grupo == '' ? 1 : req.body.Grupo;
    var dtEntrada = utils.parseDateBR_ENG(TodayDate);
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtEvento);
    var dtUltimaRoda = dtUltimaParticipacao;
    var presenca = req.body.presenca;
    var grupoId = 1;

    if(id != 0){
        utilseventos.addParticipacaoEvento(1, id, grupoId, dtUltimaRoda, emailPessoa, presenca, valorEvento, observacao);
    } else {
        var newItem =
        {   grupoId : grupoId,
            nmPessoa : nmPessoa,
            Ativo : Ativo,
            VIP : 0,
            receberEmails : receberEmails,
            emailPessoa : emailPessoa,
            sexoPessoa : '',
            cepPessoa : '',
            dtEntrada : dtEntrada,
            dtUltimaParticipacao : dtUltimaParticipacao,
            valorEvento : valorEvento
        };

        var model = Pessoas;
        var where = {
            nmPessoa    : nmPessoa, 
            grupoId     : grupoId
        };       
          
        utils.updateOrCreate (model, where, newItem)
        .then((result) => {
            utilseventos.addParticipacaoEvento(2, result.item.id, result.item.grupoId, dtUltimaRoda, emailPessoa, presenca, valorEvento, observacao);
        })
        .catch(erro => {
            console.log(erro);
        });
    }
    if(presenca==0){
        res.redirect("/admin");
    }else 
    {
        res.redirect("/listas");
    }
});

router.post("/pessoas/edit/update", (req, res) => {
    var id = req.body.id;
    var grupoId = req.body.grupoId;
    var nmPessoa = req.body.nmPessoa;
    var dtNascimento = utils.parseDateBR_ENG(req.body.dtNascimento);
    var endPessoa = req.body.endPessoa;
    var endComplemento = req.body.endComplemento;
    var cepPessoa = req.body.cepPessoa;
    var fonePessoa = req.body.fonePessoa;
    var Ativo = req.body.Ativo;
    var VIP = req.body.VIP == 0 ? 0 : 1;
    var receberEmails = req.body.receberEmails;
    var emailPessoa = req.body.emailPessoa;
    var sexoPessoa = req.body.sexoPessoa;
    var cidadePessoa = req.body.cidadePessoa;
    var dtEntrada = utils.parseDateBR_ENG(req.body.dtEntrada);
    var dtDesligamento = utils.parseDateBR_ENG(req.body.dtDesligamento);
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtUltimaParticipacao);
    Pessoas
    .update(
        {
            grupoId : grupoId,
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
            VIP : VIP,
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
            'grupoId',
            'nmPessoa',
            [sequelize.fn('date_format', sequelize.col('dtNascimento'), '%d/%m/%Y'), 'dtNascimento'],
            'endPessoa',
            'endComplemento',
            'cepPessoa',
            'fonePessoa',
            'Ativo',
            'VIP',
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

    utilseventos.calcularProximoEvento(1)
    .then( dataProximoEvento => {
        proximaRoda = dataProximoEvento;

        //console.log("-=-=-=-=-=   Fim     " + proximaRoda + "        =-=-=-=-=-");

        utilsPessoas.getNomePessoas()
        .then( aPessoas => {
            var availableTags = JSON.stringify(aPessoas);
            dataProximoEvento = utils.parseDateENG_BR(dataProximoEvento);
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

router.get("/pessoas/cadRodaDia", (req, res) => {    
    // Pegar a data do Próximo Evento de Roda de Cura
    
    var availableTags = [];

    utilseventos.calcularProximoEvento(1)
    .then( dataProximoEvento => {
        //console.log("-=-=-=-=-=   Fim     " + proximaRoda + "        =-=-=-=-=-");

        utilsPessoas.getNomePessoas()
        .then( aPessoas => {
            var availableTags = JSON.stringify(aPessoas);
            dataProximoEvento = utils.parseDateENG_BR(dataProximoEvento);
            res.render("./pessoas/cadRodaDia", {dataProximoEvento, availableTags});
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