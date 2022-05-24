const pool = require("../db");

module.exports = class JugadaDAO {	

	static async insertarJugada(tipo, TerritorioAtacante,ResultadoDadosAtaque,idTerritorio,cartasUtilizadas,idTerritorioDestino,idTerritorioOrigen,numTropas,cartaRecibida,
							ResultadoDadosDefensa,TerritorioAtacado,Partida_idPartida,Usuario_nombre) {
		try {
		
			switch(tipo){
			
				case "crearPartida": 
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
					
				
				case "finTurno":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "ponerTropas":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, idTerritorio, numTropas) VALUES ($1, $2, $3, $4, $5)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, idTerritorio, numTropas],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "moverTropas":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, idTerritorioOrigen, idTerritorioDestino) VALUES ($1, $2, $3, $4, $5)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, idTerritorioOrigen, idTerritorioDestino],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "utilizarCartas":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, cartasUtilizadas) VALUES ($1, $2, $3, $4)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, cartasUtilizadas],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "ataqueSincrono":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque) VALUES ($1, $2, $3, $4, $5, $6)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				case "defensaSincrona":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosDefensa) VALUES ($1, $2, $3, $4, $5, $6)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosDefensa],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "ataqueSincrono":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque,ResultdoDadosDefensa)" 
		  				+ "VALUES ($1, $2, $3, $4, $5, $6, $7)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, TerritorioAtacante, TerritorioAtacado, ResultadoDadosAtaque,ResultdoDadosDefensa],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "pedirCarta":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre, carta_recibida) VALUES ($1, $2, $3, $4)",
		  				values: [tipo, Partida_idPartida, Usuario_nombre, carta_recibida],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);
					break;
				
				case "finPartida":
					const query = {
		  				text: "INSERT INTO Jugada (tipo,Partida_idPartida, Usuario_nombre) VALUES ($1, $2, $3) ",
		  				values: [tipo, Partida_idPartida, Usuario_nombre],
		  				rowMode: 'array',
					}
					const res = await pool.query(query);			
			}			
						
		} catch(err){
			console.log(err);
		}
	}
	
	static async obtenerJugadas(nombre, idPartida) {	
		try {
			const query = {
  				text: "SELECT * from Jugada where Partida_idPartida=($1)",
  				values: [idPartida],  				
			}
			const res = await pool.query(query);
			return res;						
		} catch(err){
			console.log(err);
		}	
	}
	
	static async generarListaJugadas(nombre, idPartida){
	
		listaJugadas = [];
	
		jugadas = obtenerJugadas(nombre, idPartida);
		
		for(var jugada in jugadas.rows){		
			switch(jugada.tipo){				
				case "crearPartida":				
					const jugadores = await pool.query(
					"SELECT Usuario_nombre from participa where idPartida=$1", [jugada.Partida_idPartida]);
					const tipoPartida = await pool.query(
					"SELECT tipo from Partida where idPartida=$1", [jugada.Partida_idPartida]);				
					listaJugadas.add({type: jugada.tipo, userId: -1, idPartida: jugada.Partida_idPartida, listaJugadores: jugadores.rows, partidaSincrona: tipoPartida.rows[0]});			
					break;				
				case "finTurno":				
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida});					
					break;				
				case "ponerTropas":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, idTerritorio: jugada.idTerritorio, numTropas: jugada.numTropas});
					break;				
				case "moverTropas":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, idTerritorioOrigen: jugada.idTerritorioOrigen,
									idTerritorioDestino: jugada.idTerritorioDestino, numTropas: jugada.numTropas});					
					break;
				
				case "utilizarCartas":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, cartasUtilizadas: jugada.cartasUtilizadas});
					break;				
				case "ataqueSincrono":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, TerritorioAtacante: jugada.TerritorioAtacante,
								TerritorioAtacado: jugada.TerritorioAtacado, resultadoDadosAtaque: jugada.ResultadoDadosAtaque});
					
					break;
				case "defensaSincrona":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, TerritorioAtacante: jugada.TerritorioAtacante,
								TerritorioAtacado: jugada.TerritorioAtacado, resultadoDadosDefensa: jugada.ResultadoDadosDefensa});					
					break;
				
				case "ataqueSincrono":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, TerritorioAtacante: jugada.TerritorioAtacante,
								TerritorioAtacado: jugada.TerritorioAtacado, resultadoDadosAtaque: jugada.ResultadoDadosAtaque, 
								resultadoDadosDefensa: jugada.ResultadoDadosDefensa});					
					break;
				
				case "pedirCarta":
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, cartaRecibida: jugada.cartaRecibida});					
					break;
				
				case "finPartida":
					const jugadores = await pool.query(
					"SELECT Usuario_nombre from participa where idPartida=$1, order by (puesto)", [jugada.Partida_idPartida]);
					listaJugadas.add({type: jugada.tipo, userId: jugada.Usuario_nombre, idPartida: jugada.Partida_idPartida, listaJugadores: jugadores.rows});					
			}
		}		
		return listaJugadas;	
	}
}
