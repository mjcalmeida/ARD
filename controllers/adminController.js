const express = require("express");
const bodyparser = require("body-parser");
const router = express.Router();

var app = express();
app.use(bodyparser.urlencoded({extended:true}));

router.get("/admin", (req, res) => {
    res.render("admin/index");
});

router.get("/formEmails", (req, res) => {
    res.render("admin/formEmails");
});


module.exports = router;