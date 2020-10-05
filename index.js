const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conn = require("./models/database/database");

// Importando os Models
const Pessoa = require("./models/Pessoas");
const Rituais = require("./models/Rituais");
const RituaisDatas = require("./models/RituaisDatas");

// View Engine
app.set('view engine', 'ejs');

//Static
app.use(express.static('public'));

//Body-parser
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

// Database
conn
    .authenticate()
    .then(() => {
        console.log("Conexão efetuada com sucesso!");
    })
    .catch((error) => {
        console.log(error);
    });

app.get("/", (req, res) => {
    res.render("index");
});

// Importando os Controllers
const rituaisController = require("./controllers/rituaisController");
const pessoasController = require("./controllers/pessoasController");
app.use("/controllers", rituaisController);
app.use("/controllers", pessoasController);

app.listen(8080, () => {
    console.log("O serviço está rodando!");
});