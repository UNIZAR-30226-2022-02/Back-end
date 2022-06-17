const express = require("express");
const bodyparser = require("body-parser");
const app = express();
//require("dotenv").config();
const server = require("http").Server(app);
const cors = require("cors");
const io = require('socket.io')(server);
const conn = require('./connHandler');
const partidaDAO = require('./DAO/partidaDAO');
const jugadaDAO = require('./DAO/jugadaDAO');
const pool = require('./db');
const routes = require('./controllers/index.routes');


const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});

/*async function prueba2(){	
	var respuesta = await partidaDAO.unirPartidaPublica("javi");
	//var respuesta2 = await partidaDAO.unirPartidaPublica("juan");	
	console.log(respuesta);
	console.log(respuesta2);
}*/


/*async function prueba(){
	var res, idPartida;
	var respuesta = await partidaDAO.crearPartida("jesus", "Sincrona", "Publica", 2);
	res = respuesta.respuesta;
	idPartida = respuesta.idPartida;	
	console.log(res, "", idPartida);
	prueba2();
}*/



io.on('connection', function (socket) {    
    console.log("Nuevo jugador conectado");    
    //const jugada = {type: "crearPartida", userId: -1, idPartida: 1, listaJugadores: ["juan", "isma", "sergio", "jesus", "javi"], partidaSincrona: true};
    //socket.emit('nueva_jugada', jugada);   
    
    socket.on('registro', function(registro){   			
		conn.asociarSocket(socket.id, registro.username);
		console.log(registro.username);
		console.log("jugador asociado a socket");
		//const jugada = {type: "crearPartida", userId: -1, idPartida: 1, listaJugadores: ["juan", "isma", "sergio", "jesus", "javi"], partidaSincrona: true};
		//socket.emit('clientes', jugada);    
	}); 
	
    socket.on('cliente_falso', async function(){
	    	var respuesta = await partidaDAO.unirPartidaPublica("papel");
		//var respuesta2 = await partidaDAO.unirPartidaPublica("juan");	
		console.log(respuesta);
		//console.log(respuesta2);    
    });
    socket.on('nueva_jugada', function(jugada){
    		console.log(jugada);    
    		jugadaDAO.insertarJugada(jugada);
    		var rooms = [];
    		console.log(socket.rooms); 
    		for(var i in socket.rooms)
    			rooms.push([i, socket.rooms [i]]);   			  		
		for (var i = 0; i<rooms.length; i++){
			if(rooms[i] != socket.id.toString()){
				io.to(rooms[i][i]).emit('nueva_jugada', jugada);
				break;							
			}						
		}
    		//socket.emit('nueva_jugada', jugada);    
    });
    
    socket.on('disconnect', function () {
        console.log('Jugador desconectado');        
    });
});

//prueba2();

//app.use(bodyparser.urlencoded({extended:false}))
app.use(cors());
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));
app.use(routes);

exports.io = io;

