const express = require("express");
const bodyparser = require("body-parser");
const app = express();
require("dotenv").config();
const server = require("http").Server(app);
const io = require("socket.io")(server);

//const conn = require("./connHandler");

const PORT = process.env.PORT || 3000

/*app.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});*/

server.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});

io.on("connection", function (socket) {
  console.log("Un nuevo jugador se ha conectado");
  //conn.asociarSocket(socket); 
  io.sockets.emit("clientes", "heyy"); 
  socket.on("presentar_cliente", function(data){  	
  
  });

  socket.on("nueva_jugada", function (data) {	//insertarJugada(data);
	
	io.sockets.emit("jugadas", data);
  });
});


//app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json());
app.use(express.urlencoded({extended:false}));
app.use(require('./controllers/index.routes'));






