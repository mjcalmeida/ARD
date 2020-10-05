const express = require("express");
const Pessoas = require("../models/Pessoas");
const router = express.Router();

router.get("/pessoas", (req, res) => {
    Pessoas
    .findAll({
        raw: true,
        order: [['id', 'ASC']]
    })
    .then(pessoas => {
        res.render("pessoas/index", {
            pessoas : pessoas
        });
    });
});

module.exports = router;