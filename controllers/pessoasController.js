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
const UtilsGrupos = require("../public/js/utilsGrupos");
const utilsGrupos = new UtilsGrupos();  
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
            [sequelize.fn('date_format', sequelize.col('dtUltimaParticipacao'), '%d/%m/%Y'), 'dtUltimaParticipacao'],
            'idFranqueado'
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
    var idFranqueado = req.body.idFranqueado;
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
            grupoId              : grupoId,
            nmPessoa             : nmPessoa,
            dtNascimento         : dtNascimento,
            endPessoa            : endPessoa,
            endComplemento       : endComplemento,
            cepPessoa            : cepPessoa,
            fonePessoa           : fonePessoa,
            Ativo                : Ativo,
            receberEmails        : receberEmails,
            emailPessoa          : emailPessoa,
            sexoPessoa           : sexoPessoa,
            cidadePessoa         : cidadePessoa,
            dtEntrada            : dtEntrada,
            VIP                  : VIP,
            idFranqueado         : idFranqueado,
            dtDesligamento       : dtDesligamento,
            dtUltimaParticipacao : dtUltimaParticipacao
        })
        .then(() => {
            res.redirect("/pessoas");
        });
    } else {
        res.redirect("/pessoas/new");
    }
});

//   --->    Grava a participação na Roda - Verifica se a pessoa é Xamã ou Visitante
router.post("/pessoas/saveRoda", (req, res) => {    
    var nmPessoa = req.body.nmPessoa;
    var TodayDate = new Date();
    var Ativo         = 1;
    var valorEvento   = req.body.valorEvento;
    var emailPessoa   = req.body.emailPessoa == '' ? '' : req.body.emailPessoa;
    var observacao    = req.body.observacao;
    var id            = req.body.ID == '' ? 0 : req.body.ID;
    var receberEmails = req.body.emailPessoa == '' ? 0 : 1;
    var grupoId       = req.body.Grupo == '' ? 1 : req.body.Grupo;
    var idFranqueado  = req.body.idFranqueado;
    var dtEntrada     = utils.parseDateBR_ENG(TodayDate);
    var dtEvento      = req.body.dtEvento;
    var presenca      = req.body.presenca;
    
    if(valorEvento == undefined){
        valorEvento = utilseventos.getValorEvento(1,1) ;
    }

    if(id != 0){
        // Tem cadastro
        utilseventos.addParticipacaoEvento(1, id, grupoId, dtEvento, emailPessoa, presenca, valorEvento, observacao, idFranqueado);
    } else {
//   --->   Grava Última participação de uma pessoa em um evento        
        // Não tem cadastro
        var newItem =
        {   grupoId              : grupoId,
            nmPessoa             : nmPessoa,
            Ativo                : Ativo,
            VIP                  : 0,
            receberEmails        : receberEmails,
            emailPessoa          : emailPessoa,
            sexoPessoa           : '',
            cepPessoa            : '',
            dtEntrada            : dtEntrada,            
            idFranqueado         : idFranqueado,
            dtUltimaParticipacao : dtEntrada = dtEvento ? dtEvento : null
        };

        var model = Pessoas;
        var where = {
            nmPessoa    : nmPessoa, 
            grupoId     : grupoId
        };       
          
        utils.updateOrCreate (model, where, newItem)
        .then((result) => {
            utilseventos.addParticipacaoEvento(1, result.item.id, result.item.grupoId, dtEvento, emailPessoa, presenca, valorEvento, observacao);
        })
        .catch(erro => {
            console.log(erro);
        });
    }

    if(presenca==0){
        res.redirect("/admin");
    }else 
    {
        res.redirect("/listas/"+ dtEvento);
    }
});

router.post("/pessoas/edit/update", (req, res) => {
    var id                   = req.body.id;
    var grupoId              = req.body.grupoId;
    var nmPessoa             = req.body.nmPessoa;
    var dtNascimento         = utils.parseDateBR_ENG(req.body.dtNascimento);
    var endPessoa            = req.body.endPessoa;
    var endComplemento       = req.body.endComplemento;
    var cepPessoa            = req.body.cepPessoa;
    var fonePessoa           = req.body.fonePessoa;
    var Ativo                = req.body.Ativo         == 'false' ? 0 : 1;
    var VIP                  = req.body.VIP           == 'false' ? 0 : 1;
    var receberEmails        = req.body.receberEmails == 'false' ? 0 : 1;
    var idFranqueado         = req.body.idFranqueado  == 'false' ? 0 : 1;
    var emailPessoa          = req.body.emailPessoa;
    var sexoPessoa           = req.body.sexoPessoa;
    var cidadePessoa         = req.body.cidadePessoa;
    var dtEntrada            = utils.parseDateBR_ENG(req.body.dtEntrada);
    var dtDesligamento       = utils.parseDateBR_ENG(req.body.dtDesligamento);
    var dtUltimaParticipacao = utils.parseDateBR_ENG(req.body.dtUltimaParticipacao);

    Pessoas
    .update(
        {
            grupoId              : grupoId,
            nmPessoa             : nmPessoa,
            dtNascimento         :  dtNascimento,
            endPessoa            : endPessoa,
            endComplemento       : endComplemento,
            cepPessoa            : cepPessoa,
            fonePessoa           : fonePessoa,
            Ativo                : Ativo,
            receberEmails        : receberEmails,
            emailPessoa          : emailPessoa,
            sexoPessoa           : sexoPessoa,
            cidadePessoa         : cidadePessoa,
            VIP                  : VIP,
            idFranqueado         : idFranqueado,
            dtEntrada            : dtEntrada,
            dtDesligamento       : dtDesligamento,
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
            [sequelize.fn('date_format', sequelize.col('dtUltimaParticipacao'), '%d/%m/%Y'), 'dtUltimaParticipacao'],
            'idFranqueado'
        ]
    })
    .then ( pessoa => {
        if( pessoa != undefined ){
            var grupos = utilsGrupos.getGrupos();
            res.render("pessoas/edit", { pessoa , grupos });
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
    var availableTags = [];

    utilseventos.calcularProximoEvento(1)
    .then( proximaRoda => {        
        //console.log("-=-=-=-=-=   Fim     " + proximaRoda + "        =-=-=-=-=-");

        utilsPessoas.getNomePessoas()
        .then( aPessoas => {
            var availableTags = JSON.stringify(aPessoas);
            var dataEvento = utils.parseDateBR_ENG(proximaRoda);
            res.render("./pessoas/cadRoda", {dataEvento, proximaRoda, availableTags});
        })
        .catch(erro => {
            console.log(erro);
        });
    })
    .catch(erro => {
        console.log(erro);
    });
});

router.get("/pessoas/cadRodaDia/:dataEventoSelecao", (req, res) => {
    // Pegar a data do Próximo Evento de Roda de Cura
    
    var availableTags = [];
    var dataEventoSelecao = req.params.dataEventoSelecao;

    utilseventos.calcularProximoEvento(1)
    .then( dataProximoEvento => {
        //console.log("-=-=-=-=-=   Fim     " + proximaRoda + "        =-=-=-=-=-");

        utilsPessoas.getNomePessoas()
        .then( aPessoas => {
            var dataEvento = utils.parseDateENG_BR(dataEventoSelecao);

            if(dataEventoSelecao == "0"){
                dataEventoSelecao = dataProximoEvento;
                dataEvento = utils.parseDateENG_BR(dataProximoEvento);
            }

            var availableTags = JSON.stringify(aPessoas);
           
            res.render("./pessoas/cadRodaDia", {dataEvento, dataEventoSelecao, availableTags});
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