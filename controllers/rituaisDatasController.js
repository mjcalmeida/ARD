const express = require("express");
const router = express.Router();

router.get("/rituaisDatas", (req, res) => {
    res.send("Rota de Datas de Rituais");
});

module.exports = router;