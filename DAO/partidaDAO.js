const pool = require("../db");
const conn = require("../connHandler");
const socketio = require("../index");
const jugadaDAO = require('./jugadaDAO');

module.exports = class PartidaDAO {

	static generarCodigo(nombre){		
		var codigo = nombre + (Math.floor(Math.random() * (2000 - 1000 + 1)) + 1000).toString();		
		return codigo;	
	}

	static async crearPartida(nombre, tipo, publica, maxJugadores) {
		try {		
			if (publica == "Publica"){				
				if (tipo == "Sincrona"){
					tipo = 1;
				}
				else
					tipo = 0;
				var values = [tipo, maxJugadores];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (tipo,maxJugadores,iniciada,terminada,publica,jugadores) VALUES ($1, $2, 0, 0, 1, 1)", values);
				console.log("Partida creada correctamente");			
			}			
			else{
				var codigo = PartidaDAO.generarCodigo(nombre);
				console.log(codigo);
				if (tipo == "Sincrona"){
					tipo = 1;
				}
				else
					tipo = 0;
				var values = [tipo, maxJugadores, codigo];
				const nuevaPartida = await pool.query(
				"INSERT INTO Partida (tipo,maxJugadores,codigo,iniciada,terminada,publica, jugadores) VALUES ($1, $2, $3, 0, 0, 0, 1)", values);
				const maxIDPartida = await pool.query(
				"SELECT max(idPartida) from Partida");
				console.log(maxIDPartida.rows[0].max);
				const participa = await pool.query(
				"INSERT INTO participa (Usuario_nombre, Partida_idPartida) VALUES ($1, $2)", [nombre, maxIDPartida.rows[0].max]);
				return {respuesta: "OK", idPartida: maxIDPartida.rows[0].max, codigo: codigo};		
			}		
			const maxIDPartida = await pool.query(
			"SELECT max(idPartida) from Partida");
			console.log(maxIDPartida.rows[0].max);
			const participa = await pool.query(
			"INSERT INTO participa (Usuario_nombre, Partida_idPartida) VALUES ($1, $2)", [nombre, maxIDPartida.rows[0].max]);
			return {respuesta: "OK", idPartida: maxIDPartida.rows[0].max};	
		} catch (err){
			console.log(err);
			return false;
		}
	}
	
	static async unirPartidaPublica(nombre){
		try {
			const query = {
  				text: "SELECT max(idPartida) as idPartida from Partida where publica=1 and iniciada=0 LIMIT 1",  				
  				rowMode: 'array',
			}			
			const idPartida = await pool.query(query);
			console.log(idPartida.rows[0][0])			
			const query2 = {
  				text: "INSERT INTO participa (usuario_nombre, partida_idPartida) VALUES($1, $2)", 
  				values: [nombre, idPartida.rows[0][0]], 				
  				rowMode: 'array',
			}
			console.log("jugador unido a la partida");
			
			await pool.query(query2);
			await pool.query(
				"UPDATE Partida set jugadores=jugadores+1 where idPartida = ($1)", [idPartida.rows[0][0]]);	
			
			const maxJugadores = await pool.query(
				"SELECT maxJugadores from Partida where idPartida = ($1)", [idPartida.rows[0][0]]);	
			var numJugadores = await PartidaDAO.getNumJugadores(idPartida.rows[0][0]);			
			if(numJugadores >= maxJugadores.rows[0].maxjugadores) {	
				await pool.query(
				"UPDATE Partida set iniciada=1 where idPartida = ($1)", [idPartida.rows[0][0]]);						
					//obtener lista de jugadores, crear jugada crearPartida y enviarla a los jugadores de la partida consultando el connHandler					
				var jugadores = await PartidaDAO.getListaJugadores(idPartida.rows[0][0]);
				var io = socketio.io;	
				console.log(jugadores);														
				for (var i = 0; i<jugadores.length; i++){
					console.log(jugadores[i]);
					var socketID = conn.getSocket(jugadores[i]);
					io.sockets.connected[socketID].join(idPartida.rows[0][0]);					
				}
				const tipoPartida = await pool.query(
					"SELECT tipo from Partida where idPartida=$1", [idPartida.rows[0][0]]);				
				const jugadaCrearPartida = {type: "crearPartida", userId: "-1", idPartida: idPartida.rows[0][0], listaJugadores: jugadores, partidaSincrona: tipoPartida.rows[0].tipo}; 
				jugadaDAO.insertarJugada(jugadaCrearPartida);
				io.to(idPartida.rows[0][0]).emit('nueva_jugada', jugadaCrearPartida);
				io.sockets.emit("arrancar_jugada");										
			}			
			return {respuesta: "OK", idPartida: idPartida.rows[0][0]};			
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
				const query2= {
  				text: "INSERT INTO participa (Usuario_nombre, Partida_idPartida) VALUES($1, $2)", 
  				values: [nombre, idPartida.rows[0][0]], 				
  				rowMode: 'array',
				}			
				const res = await pool.query(query2);
				await pool.query(
				"UPDATE Partida set jugadores=jugadores+1 where idPartida = ($1)", [idPartida.rows[0][0]]);					
				const maxJugadores = await pool.query(
				"SELECT maxJugadores from Partida where idPartida = ($1)", [idPartida.rows[0][0]]);	
				var numJugadores = await PartidaDAO.getNumJugadores(idPartida.rows[0][0]);			
				if(numJugadores >= maxJugadores.rows[0].maxjugadores) {	
					await pool.query(
					"UPDATE Partida set iniciada=1 where idPartida = ($1)", [idPartida.rows[0][0]]);						
						//obtener lista de jugadores, crear jugada crearPartida y enviarla a los jugadores de la partida consultando el connHandler					
					var jugadores = await PartidaDAO.getListaJugadores(idPartida.rows[0][0]);
					var io = socketio.io;	
					console.log(jugadores);														
					for (var i = 0; i<jugadores.length; i++){
						console.log(jugadores[i]);
						var socketID = conn.getSocket(jugadores[i]);
						console.log(socketID);
						io.sockets.connected[socketID].join(idPartida.rows[0][0]);						
					}
					const tipoPartida = await pool.query(
						"SELECT tipo from Partida where idPartida=$1", [idPartida.rows[0][0]]);				
					const jugadaCrearPartida = {type: "crearPartida", userId: "-1", idPartida: idPartida.rows[0][0], listaJugadores: jugadores, partidaSincrona: tipoPartida.rows[0].tipo}; 
					jugadaDAO.insertarJugada(jugadaCrearPartida);
					io.to(idPartida.rows[0][0]).emit('nueva_jugada', jugadaCrearPartida);
					io.sockets.emit("arrancar_jugada");					
											
				}
							
				return {respuesta: "OK", idPartida: idPartida.rows[0][0]};			
			}								
			
		} catch (err){
			console.log(err);
			return false;
		}	
	}
	
	static async getCodigoPartida(idPartida){
		const codigo = await pool.query(
		"SELECT codigo from Partida where idPartida = ($1)", [idPartida]);
		return codigo.rows[0].codigo;	
	}
	
	static async getNumJugadores(idPartida) {
			try {
				const query = {
	  				text: "SELECT count(*) from participa where Partida_idPartida = ($1)",
	  				values: [idPartida],
	  				rowMode: 'array',
				}
				
				const res = await pool.query(query);
				return res.rows[0][0];				
				
			} catch (err){
				console.log(err);
				return false;
			}
	}
	
	static async getListaJugadores(idPartida) {
		try {
			const query = {
  				text: "SELECT Usuario_nombre from participa where Partida_idPartida=($1)", 
  				values: [idPartida],
  				rowMode: 'array',
			}
			
			const res = await pool.query(query);
			var jugadores = [];
			for(var i=0; i<res.rows.length; i++){
				jugadores[i] = res.rows[i][0];			
			}	
			return jugadores;			
			
		} catch (err){
			console.log(err);
			return false;
		}
	}	
	
	
	static async actualizarPuesto(nombre, idPartida) {	
		try {
			const query = {
  				text: "SELECT count(*) from participa where Partida_idPartida = ($1) and puesto IS NULL",
  				values: [idPartida],
  				rowMode: 'array',
			}			
			const res = await pool.query(query);
			if(res.rows[0][0] == 1){			
				await pool.query(
				"UPDATE Partida set terminada=1 where idPartida = ($1)", [idPartida]);			
			}			
			await pool.query(
			"UPDATE participa set puesto = ($1) where Partida_idPartida = ($2) and Usuario_nombre=($3)", [res.rows[0][0], idPartida, nombre]);
			
			//Actualizar cantidad de puntos de los jugadores en función del puesto en el que quedan en la partida
			switch(res.rows[0][0]){
				case 6: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [100, nombre]);
					break;
				case 5: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [150, nombre]);
					break;
				case 4: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [200, nombre]);
					break;
				case 3: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [250, nombre]);
					break;
				case 2: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [300, nombre]);
					break;				
				case 1: await pool.query(
					"UPDATE usuario set puntos = ($1) where nombre=($2)", [400, nombre]); 			
			}			
		} catch (err){
			console.log(err);
			return false;
		}
	}
	
	static async getHistorial(nombre){
		try {
			var partidas = [];
			const query = {
  				text: "SELECT Partida_idPartida from participa,Partida p where Usuario_nombre = ($1) and Partida_idPartida=p.idPartida and terminada=1  LIMIT 5",
  				values: [nombre],
  				rowMode: 'array',
			}			
			const res = await pool.query(query);
			const infoPartidas = await pool.query(
					"SELECT * fom participa where Partida_idPartida=($1) OR Partida_idPartida=($2) OR Partida_idPartida=($3) OR Partida_idPartida=($4) OR" + 
					"Partida_idPartida=($5)", res.rows[0][0], res.rows[1][0],res.rows[2][0],res.rows[3][0],res.rows[4][0]); 			
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
  				text: "SELECT p.idPartida as idPartida from participa,Partida p where Usuario_nombre = ($1) and Partida_idPartida=p.idPartida and terminada=0 and iniciada=1",
  				values: [nombre],
  				rowMode: 'array', 				
			}			
		const res = await pool.query(query);
		console.log(res.rows[0]);
		console.log("longitud: ", res.rows.length);				
		if(res.rows.length > 0){
			var io = socketio.io;
			var socketID = conn.getSocket(nombre);
			console.log(socketID);
			io.sockets.connected[socketID].join(res.rows[0][0]);				
			return res.rows[0][0];
		}
		else
			return -1
	}
}
