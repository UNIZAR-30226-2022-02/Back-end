const express = require("express");
const bodyparser = require("body-parser");
const app = express();
//require("dotenv").config();
const server = require("http").Server(app);
const cors = require("cors");
const io = require('socket.io')(server);
const conn = require('./connHandler');


const PORT = process.env.PORT || 3000;

server.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});


//console.log("server started on port " + port);

io.on('connection', function (socket) {    
    console.log("Nuevo jugador conectado"); 
    
	socket.on('registro', function(username){
		conn = new ConnHandler();
		conn.asociarSocket(socket, username);
		console.log(data);   
    
	});   
    
    socket.on('disconnect', function () {
        console.log('client disconected');
        //delete players[thisPlayerId];
        //socket.broadcast.emit('disconnected', {id:thisPlayerId});
    });
});

//app.use(bodyparser.urlencoded({extended:false}))
app.use(cors());
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));
app.use(require('./controllers/index.routes'))





