const pool = require("../db");

module.exports = class PartidaDAO {

	static async crearPartida(nombre, numJugadores, tipo, publica) {
		try {
		
			if (publica == true){			
				var values = [numJugadores, tipo];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (numJugadores,tipo) VALUES ($1, $2)", values);			
			}			
			else{
				codigo = generarCodigo(nombre);
				var values = [numJugadores, tipo, codigo];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (numJugadores,tipo,codigo) VALUES ($1, $2, $3)", values);			
			}		
			const maxIDPartida = await pool.query(
			"SELECT max(idPartida) from Partida");
			const participa = await pool.query(
			"INSERT INTO participa (Usuario_nombre, Partida_idPartida) VALUES ($1, $2)", [nombre, maxIDPartida]);
			return true, maxIDPartida;
		} catch (err){
			console.log(err);
			return false;
		}
	}
	
	static async generarCodigo(nombre){		
		codigo = nombre + (Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000).toString();
		return codigo;	
	}
	
	static async getCodigoPartida(idPartida){
		const codigo = await pool.query(
		"SELECT codigo from Partida where idPartida = ($1)", [idPartida]);
		return codigo;	
	}
	
	static async getNumJugadores(idPartida) {
			try {
				const query = {
	  				text: "SELECT count(*) from participa where idPartida = ($1) group by (nombre)",
	  				values: [idPartida],
	  				rowMode: 'array',
				}			
				
			} catch (err){
				console.log(err);
				return false;
			}
	}

	static async insertarJugada(tipo) {
		try {
			const query = {
  				text: "INSERT INTO Jugada (tipo) VALUES ($1) ",
  				values: [tipo],
  				rowMode: 'array',
			}
			const res = await pool.query(query);			
		} catch(err){
			console.log(err);
		}
	}
	
	static async obtenerJugadas(idPartida) {	
		try {
			const query = {
  				text: "SELECT * from Jugada where Partida_idPartida=($1)",
  				values: [idPartida],
  				rowMode: 'array',
			}
			const res = await pool.query(query);			
		} catch(err){
			console.log(err);
		}	
	}

}
