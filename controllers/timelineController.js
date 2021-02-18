const express = require("express");
const router = express.Router();
const dbKnex = require("../models/database/db_Knex");

const Utils = require("../public/js/utils");
const utils = new Utils();

router.get("/getTimeline/:id", (req, res) => {
    return new Promise( resolve => {
        var id = 1 ; //req.params.id;
        dbKnex
        .select("nomeEvento", "antesDepois", "quantidade", "unidade", "acao", "dataProximoEvento", 
                "horaProximoEvento", "periodicidade", "Timeline.emailId", "titulo", "body", 
                "numMinimo", "numMaximo", "valorConvidado", "valorXama", "grupoId", "pessoaId")
        .table("Timeline")
        .innerJoin("emails", "Timeline.emailId", "emails.id")
        .innerJoin("TimeLineDestinatarios", "TimeLineDestinatarios.emailId", "Timeline.id")
        .innerJoin("eventos", "Timeline.eventoId", "eventos.id")
        .where({ "Timeline.id" : id })
        .then( evento => {
            evento[0].antesDepois = evento[0].antesDepois == "-" ? "antes" : "depois"; 
            evento[0].dataProximoEvento=utils.parseDateENG_BR(evento[0].dataProximoEvento);
            res.render("eventos/timelineEdit", { evento });
        })
        .catch( err => {
            console.log(err);
        })
    });
})

module.exports = router;