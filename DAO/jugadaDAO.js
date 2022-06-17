const pool = require("../db");

module.exports = class JugadaDAO {	

	static async insertarJugada(jugada) {
		try {
		
			switch(jugada.type){
			
				case "crearPartida": 
					const query1 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId],
		  				rowMode: 'array',
					}
					await pool.query(query1);
					break;
					
				
				case "finTurno":
					const query2 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId],
		  				rowMode: 'array',
					}
					await pool.query(query2);
					break;
				
				case "ponerTropas":
					const query3 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, idTerritorio, numTropas) VALUES ($1, $2, $3, $4, $5)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.idTerritorio, jugada.numTropas],
		  				rowMode: 'array',
					}
					await pool.query(query3);
					break;
				
				case "moverTropas":
					const query4 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, idTerritorioOrigen, idTerritorioDestino) VALUES ($1, $2, $3, $4, $5)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.idTerritorioOrigen, jugada.idTerritorioDestino],
		  				rowMode: 'array',
					}
					await pool.query(query4);
					break;
				
				case "utilizarCartas":
					const query5 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, cartasUtilizadas) VALUES ($1, $2, $3, $4)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.cartasUtilizadas],
		  				rowMode: 'array',
					}
					await pool.query(query5);
					break;
				
				case "ataqueSincrono":
					const query6 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque) VALUES ($1, $2, $3, $4, $5, $6)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.TerritorioAtacante, jugada.TerritorioAtacado, jugada.ResultadoDadosAtaque],
		  				rowMode: 'array',
					}
					await pool.query(query6);
					break;
				case "defensaSincrona":
					const query7 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosDefensa) VALUES ($1, $2, $3, $4, $5, $6)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.TerritorioAtacante, jugada.TerritorioAtacado, jugada.ResultadoDadosDefensa],
		  				rowMode: 'array',
					}
					await pool.query(query7);
					break;
				
				case "ataqueAsincrono":
					const query8 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque,ResultdoDadosDefensa)" 
		  				+ "VALUES ($1, $2, $3, $4, $5, $6, $7)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.TerritorioAtacante, 
		  						jugada.TerritorioAtacado, jugada.ResultadoDadosAtaque,jugada.ResultdoDadosDefensa],
		  				rowMode: 'array',
					}
					await pool.query(query8);
					break;
				
				case "pedirCarta":
					const query9 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, carta_recibida) VALUES ($1, $2, $3, $4)",
		  				values: [jugada.type, jugada.idPartida, jugada.userId, jugada.cartaRecibida],
		  				rowMode: 'array',
					}
					await pool.query(query9);
					break;
				
				case "finPartida":
					const query10 = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3) ",
		  				values: [jugada.type, jugada.idPartida, jugada.userId],
		  				rowMode: 'array',
					}
					await pool.query(query10);			
			}			
						
		} catch(err){
			console.log(err);
		}
	}
	
	static async obtenerJugadas(nombre, idPartida) {	
		try {
			const query = {
  				text: "SELECT * from jugada where Partida_idPartida=($1)",
  				values: [idPartida],
  				 				
			}
			const res = await pool.query(query);							
			return res.rows;						
		} catch(err){
			console.log(err);
		}	
	}	
	static async generarListaJugadas(nombre, idPartida){
	
		var listaJugadas = [];	
		var jugadas = await JugadaDAO.obtenerJugadas(nombre, idPartida);	
		var primeraJugada						
		for(var jugada of jugadas) {								
			switch(jugada.tipo){				
				case "crearPartida":				
					const jugadores = await pool.query(
					"SELECT Usuario_nombre from participa where Partida_idPartida=($1)", [jugada.partida_idpartida]);
					var players = [];
					
					for(var i = 0; i < jugadores.rows.length; i++){
						await players.push(jugadores.rows[i].usuario_nombre);						
					}					
					const tipoPartida = await pool.query(
					"SELECT tipo from Partida where idPartida=$1", [jugada.partida_idpartida]);				
					primeraJugada = {type: jugada.tipo, userId: "-1", idPartida: jugada.partida_idpartida, listaJugadores: players, 
									partidaSincrona: tipoPartida.rows[0].tipo};								
					break;				
				case "finTurno":				
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida});					
					break;				
				case "ponerTropas":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, 
										idTerritorio: jugada.idterritorio, numTropas: jugada.numtropas});
					break;				
				case "moverTropas":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, idTerritorioOrigen: jugada.idterritorioorigen,
									idTerritorioDestino: jugada.idterritoriodestino, numTropas: jugada.numtropas});					
					break;
				
				case "utilizarCartas":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, cartasUtilizadas: jugada.cartasutilizadas});
					break;				
				case "ataqueSincrono":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, territorioAtacante: jugada.territorioatacante,
								territorioAtacado: jugada.territorioatacado, resultadoDadosAtaque: jugada.resultadodadosataque});
					
					break;
				case "defensaSincrona":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, territorioAtacante: jugada.territorioatacante,
								territorioAtacado: jugada.territorioatacado, resultadoDadosDefensa: jugada.resultadodadosdefensa});					
					break;
				
				case "ataqueSincrono":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, territorioAtacante: jugada.territorioatacante,
								territorioAtacado: jugada.territorioatacado, resultadoDadosAtaque: jugada.resultadodadosataque, 
								resultadoDadosDefensa: jugada.resultadodadosdefensa});					
					break;
				
				case "pedirCarta":
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, 
										cartaRecibida: jugada.cartarecibida});					
					break;
				
				case "finPartida":
					const jugadores2 = await pool.query(
					"SELECT Usuario_nombre from participa where Partida_idPartida=$1, order by (puesto)", [jugada.partida_idpartida]);
					await listaJugadas.push({type: jugada.tipo, userId: jugada.usuario_nombre, idPartida: jugada.partida_idpartida, 
									listaJugadores: jugadores2.rows[0].usuario_nombre});					
			}			
		}		
		await listaJugadas.unshift(primeraJugada);
		console.log(listaJugadas);			
		return listaJugadas;	
	}
}
