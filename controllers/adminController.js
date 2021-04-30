const express = require("express");
const router = express.Router();

var app = express();
app.use(express.urlencoded({
    extended: true
  }));

router.get("/admin", (req, res) => {
    res.render("admin/index");
});

module.exports = router;