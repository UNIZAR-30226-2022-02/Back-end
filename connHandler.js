//manejador de conexiones (parejas clave valor (username -> socket)


module.exports = class ConnHandler {

	ConnHandler(){
		this.dict = {};
	
	}	
	static async asociarSocket(socket, username) {		
		this.dict[username] = socket;
	}

}
