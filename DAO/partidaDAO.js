const pool = require("../db");
const conn = require("../connHandler");
const io = require("socket.io");

module.exports = class PartidaDAO {

	static async crearPartida(nombre, jugadores, tipo, publica, maxJugadores) {
		try {		
			if (publica == true){			
				var values = [tipo, maxJugadores, jugadores];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (tipo,maxJugadores,iniciada,terminada,publica,jugadores) VALUES ($1, $2, 0, 0, 1, $3)", values);			
			}			
			else{
				codigo = generarCodigo(nombre);
				var values = [tipo, maxJugadores, codigo, jugadores];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (tipo,maxJugadores,codigo,iniciada,terminada,publica,jugadores) VALUES ($1, $2, $3, 0, 0, 0, $4)", values);		
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
			
			const maxJugadores = await pool.query(
				"SELECT maxJugadores from Partida where idPartida = ($1)", [idPartida]);				
			if(getNumJugadores(idPartida) >= maxJugadores) {	
				await pool.query(
				"UPDATE Partida set iniciada=1 where idPartida = ($1)", [idPartida]);						
					//obtener lista de jugadores, crear jugada crearPartida y enviarla a los jugadores de la partida consultando el connHandler					
				jugadores = await getListaJugadores(idPartida);															
				for (var jugador in jugadores){
					socketID = conn.getSocket(jugador);
					io.sockets.connected[socketID].join(idPartida);
					const jugadaCrearPartida = {listaJugadores: jugadores, partida: idPartida}; 
					io.to(idPartida).emit('crearPartida', jugadaCrearPartida);					
				}						
			}									
			
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
				if(getNumJugadores(idPartida) >= maxJugadores) {							
					//obtener lista de jugadores, crear jugada crearPartida y enviarla a los jugadores de la partida consultando el connHandler
					await pool.query(
					"UPDATE Partida set iniciada=1 where idPartida = ($1)", [idPartida]);
					jugadores = await getListaJugadores(idPartida);															
					for (var jugador in jugadores){
						socketID = conn.getSocket(jugador);
						io.sockets.connected[socketID].join(idPartida);
						const jugadaCrearPartida = {listaJugadores: jugadores, partida: idPartida}; 
						io.to(idPartida).emit('crearPartida', jugadaCrearPartida);					
					}						
				}		
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
  				text: "SELECT Usuario_nombre from participa where idPartida=($1)", 
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
	
	
	static async actualizarPuesto(nombre, idPartida) {	
		try {
			const query = {
  				text: "SELECT count(*) from participa where idPartida = ($1) and puesto IS NULL group by (nombre)",
  				values: [idPartida],
  				rowMode: 'array',
			}			
			const res = await pool.query(query);
			if(res.rows[0] == 1){			
				await pool.query(
				"UPDATE Partida set terminada=1 where idPartida = ($1)", [idPartida]);			
			}			
			await pool.query(
			"UPDATE participa set puesto = ($1) where Partida_idPartida = ($2) and Usuario_nombre=($3)", [res.rows[0], idPartida, nombre]);
			
			//Actualizar cantidad de puntos de los jugadores en función del puesto en el que quedan en la partida
			switch(res.rows[0]){
				case 6: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [100, nombre]);
					break;
				case 5: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [150, nombre]);
					break;
				case 4: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [200, nombre]);
					break;
				case 3: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [250, nombre]);
					break;
				case 2: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [300, nombre]);
					break;				
				case 1: await pool.query(
					"UPDATE usuario set puntos = puntos+($1) where nombre=($2)", [400, nombre]); 			
			}			
		} catch (err){
			console.log(err);
			return false;
		}
	}
	
	static async getHistorial(nombre){
		try {
			partidas = [];
			const query = {
  				text: "SELECT Partida_idPartida from participa,Partida p where nombre = ($1) and Partida_idPartida=p.idPartida and terminada=1  LIMIT 5",
  				values: [nombre],
  				rowMode: 'array',
			}			
			const res = await pool.query(query);
			const infoPartidas = await pool.query(
					"SELECT * fom participa where Partida_idPartida=($1) OR Partida_idPartida=($2) OR Partida_idPartida=($3) OR Partida_idPartida=($4) OR" + 
					"Partida_idPartida=($5)", res.rows[0], res.rows[1],res.rows[2],res.rows[3],res.rows[4]); 			
			for (var i = 0; i<res.rows.length; i++){
				partidas[i] = {nombre: infoPartidas[i].Usuario_nombre, puesto: infoPartidas[i].puesto};			
			}
			return partidas;			
						
		} catch (err){
			console.log(err);
			return false;
		}	
	}
	
	static async consultarEnPartida(nombre){
		const query = {
  				text: "SELECT p.idPartida as idPartida from participa,Partida p where nombre = ($1) and Partida_idPartida=p.idPartida and terminada=0 and iniciada=1",
  				values: [nombre],
  				rowMode: 'array',
			}			
		const res = await pool.query(query);		
		if(res.rows.length > 0){
			return res.rows.idPartida;
		}
		else
			return -1
	}
}
