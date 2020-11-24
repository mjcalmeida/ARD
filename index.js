const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conn = require("./models/database/database");

// Importando os Models
const Grupos = require("./models/Grupos");
const Eventos = require("./models/Eventos");
//const Pessoas = require("./models/Pessoas");
//const eventosParticipantes = require("./models/EventosParticipantes")

const UtilsAdmin = require("./public/js/utilsAdmin");
const utilsadmin = new UtilsAdmin();

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
 //   utilsadmin.getDados(2);
    res.render("index");
});

// Importando os Controllers
const eventosController = require("./controllers/eventosController");
const pessoasController = require("./controllers/pessoasController");
const adminController   = require("./controllers/adminController");
const listasController  = require("./controllers/listasController");

app.use(eventosController);
app.use(pessoasController);
app.use(adminController);
app.use(listasController);

app.listen(8080, () => {
    console.log("O serviço está rodando!");
});