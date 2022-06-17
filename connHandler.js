//manejador de conexiones (parejas clave valor (username -> socket)

var dict = {}
connHandler = {};
	
connHandler.asociarSocket = (socket, username) => {
		console.log(socket);		
		dict[username] = socket;
		console.log(dict[username]);
}
connHandler.getSocket = (nombre) => {
		console.log(dict[nombre]);
		return dict[nombre];
	
}

module.exports = connHandler;


