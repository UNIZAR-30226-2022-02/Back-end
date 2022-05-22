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
	
	static async unirPartidaPublica(nombre){
		try {
			const query = {
  				text: "SELECT idPartida from Partida where publica=1 and iniciada=0 LIMIT 1",  				
  				rowMode: 'array',
			}			
			const idPartida = await pool.query(query);			
			const query = {
  				text: "INSERT INTO participa VALUES($1, $2)", 
  				values: [nombre, idPartida], 				
  				rowMode: 'array',
			}
			
			const res = await pool.query(query);						
			
		} catch (err){
			console.log(err);
			return false;
		}	
	}
	
	static async unirPartidaPrivada(nombre, codigo){
		try {
			const query = {
  				text: "SELECT idPartida from Partida where publica=0 and iniciada=0 and codigo=($1)",
  				values: [codigo],  				
  				rowMode: 'array',
			}	
					
			const idPartida = await pool.query(query);	
			if (idPartida.rows.length == 0)
				return false;
			else{
				const query = {
  				text: "INSERT INTO participa VALUES($1, $2)", 
  				values: [nombre, idPartida], 				
  				rowMode: 'array',
				}
			
				const res = await pool.query(query);
				
				const maxJugadores = await pool.query(
				"SELECT maxJugadores from Partida where idPartida = ($1)", [idPartida]);
				
				/*if(getNumJugadores >= maxJugadores){
					//obtener lista de jugadores, crear jugada crearPartida y enviarla a los jugadores de la partida consultando el connHandler					
				
				}*/			
			}								
			
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
				
				const res = await pool.query(query);
				return res.rows;				
				
			} catch (err){
				console.log(err);
				return false;
			}
	}
	
	static async getListaJugadores(idPartida) {
		try {
			const query = {
  				text: "SELECT nombre from participa where idPartida = ($1)",
  				values: [idPartida],
  				rowMode: 'array',
			}
			
			const res = await pool.query(query);	
			return res.rows[0];			
			
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
