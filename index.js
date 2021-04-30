const express    = require("express");
const app        = express();
const conn       = require("./models/database/database");
const appHttp    = require('http').createServer(resposta); // Criando o servidor
const fs         = require('fs'); // Sistema de arquivos
const io         = require('socket.io')(appHttp); // Socket.IO
var   usuarios   = []; // Lista de usuários
var   ultimas_mensagens = []; // Lista com ultimas mensagens enviadas no chat

// Importando os Models
const UtilsAdmin = require("./public/js/utilsAdmin");
const utilsadmin = new UtilsAdmin();

// View Engine
app.set('view engine', 'ejs');

//Static
app.use(express.static('public'));

//Body-parser
app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

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
    res.render("index")
});

app.get("/goMobile", (req, res) => {
    var admin = [];
    
    utilsadmin.getDados(2)
    .then(data => {
        utilsadmin.getSaldos()
        .then( saldos => {
            res.render("\Principal_Mobile", { data, saldos })
        })
        .catch(error => { 
            console.log(error) 
        })
    })
    .catch(error => {
        console.log(error);
    });
});

app.get("/goDesktop", (req, res) => {
    var admin = [];
    
    utilsadmin.getDados(2)
    .then(data => {
        utilsadmin.getSaldos()
        .then( saldos => {
            res.render("\Principal_Desktop", { data, saldos })
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

appHttp.listen(8081, () => {
    console.log("Aplicação está em execução...");
});









// Função principal de resposta as requisições do servidor
function resposta (req, res) {
	var arquivo = "";
	if(req.url == "/"){
		arquivo = __dirname + '/index.html';
	}else{
		arquivo = __dirname + req.url;
	}
	fs.readFile(arquivo,
		function (err, data) {
			if (err) {
				res.writeHead(404);
				return res.end('Página ou arquivo não encontrados');
			}

			res.writeHead(200);
			res.end(data);
		}
	);
}

io.on("connection", function(socket){
	// Método de resposta ao evento de entrar
	socket.on("entrar", function(apelido, callback){
		if(!(apelido in usuarios)){
			socket.apelido = apelido;
			usuarios[apelido] = socket; // Adicionadno o nome de usuário a lista armazenada no servidor

			// Enviar para o usuário ingressante as ultimas mensagens armazenadas.
			for(indice in ultimas_mensagens){
				socket.emit("atualizar mensagens", ultimas_mensagens[indice]);
			}


			var mensagem = "[ " + pegarDataAtual() + " ] " + apelido + " acabou de entrar na sala";
			var obj_mensagem = {msg: mensagem, tipo: 'sistema'};

			io.sockets.emit("atualizar usuarios", Object.keys(usuarios)); // Enviando a nova lista de usuários
			io.sockets.emit("atualizar mensagens", obj_mensagem); // Enviando mensagem anunciando entrada do novo usuário

			armazenaMensagem(obj_mensagem); // Guardando a mensagem na lista de histórico

			callback(true);
		}else{
			callback(false);
		}
	});


	socket.on("enviar mensagem", function(dados, callback){

		var mensagem_enviada = dados.msg;
		var usuario = dados.usu;
		if(usuario == null)
			usuario = ''; // Caso não tenha um usuário, a mensagem será enviada para todos da sala

		mensagem_enviada = "[ " + pegarDataAtual() + " ] " + socket.apelido + " diz: " + mensagem_enviada;
		var obj_mensagem = {msg: mensagem_enviada, tipo: ''};

		if(usuario == ''){
			io.sockets.emit("atualizar mensagens", obj_mensagem);
			armazenaMensagem(obj_mensagem); // Armazenando a mensagem
		}else{
			obj_mensagem.tipo = 'privada';
			socket.emit("atualizar mensagens", obj_mensagem); // Emitindo a mensagem para o usuário que a enviou
			usuarios[usuario].emit("atualizar mensagens", obj_mensagem); // Emitindo a mensagem para o usuário escolhido
		}
		
		callback();
	});

	socket.on("disconnect", function(){
		delete usuarios[socket.apelido];
		var mensagem = "[ " + pegarDataAtual() + " ] " + socket.apelido + " saiu da sala";
		var obj_mensagem = {msg: mensagem, tipo: 'sistema'};


		// No caso da saída de um usuário, a lista de usuários é atualizada
		// junto de um aviso em mensagem para os participantes da sala		
		io.sockets.emit("atualizar usuarios", Object.keys(usuarios));
		io.sockets.emit("atualizar mensagens", obj_mensagem);

		armazenaMensagem(obj_mensagem);
	});

});


// Função para apresentar uma String com a data e hora em formato DD/MM/AAAA HH:MM:SS
function pegarDataAtual(){
	var dataAtual = new Date();
	var dia = (dataAtual.getDate()<10 ? '0' : '') + dataAtual.getDate();
	var mes = ((dataAtual.getMonth() + 1)<10 ? '0' : '') + (dataAtual.getMonth() + 1);
	var ano = dataAtual.getFullYear();
	var hora = (dataAtual.getHours()<10 ? '0' : '') + dataAtual.getHours();
	var minuto = (dataAtual.getMinutes()<10 ? '0' : '') + dataAtual.getMinutes();
	var segundo = (dataAtual.getSeconds()<10 ? '0' : '') + dataAtual.getSeconds();

	var dataFormatada = dia + "/" + mes + "/" + ano + " " + hora + ":" + minuto + ":" + segundo;
	return dataFormatada;
}

// Função para guardar as mensagens e seu tipo na variável de ultimas mensagens
function armazenaMensagem(mensagem){
	if(ultimas_mensagens.length > 5){
		ultimas_mensagens.shift();
	}

	ultimas_mensagens.push(mensagem);
}