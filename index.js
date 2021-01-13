const express    = require("express");
const app        = express();
const bodyParser = require("body-parser");
const conn       = require("./models/database/database");

// Importando os Models
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
    var admin = [];
    
    utilsadmin.getDados(2)
    .then(data => {
        utilsadmin.getSaldos()
        .then( saldos => {
            res.render("index", { data, saldos })
        })
        .catch(error => { 
            console.log(error) 
        })
    })
    .catch(error => {
        console.log(error);
    });
});

// Importando os Controllers
const eventosController  = require("./controllers/eventosController");
const pessoasController  = require("./controllers/pessoasController");
const adminController    = require("./controllers/adminController");
const listasController   = require("./controllers/listasController");
const emailsController   = require("./controllers/emailsController");
const timelineController = require("./controllers/timelineController");

app.use(eventosController);
app.use(pessoasController);
app.use(adminController);
app.use(listasController);
app.use(emailsController);
app.use(timelineController);

app.listen(8080, () => {
    console.log("O serviço está rodando!");
});