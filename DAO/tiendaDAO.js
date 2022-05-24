const pool = require("../db");



module.exports = class TiendaDAO {

	static async comprarObjeto(username, objeto) {
		try {
			const res = await pool.query("SELECT puntos from Usuario where nombre = ($1)", [username]);
			const puntos = await pool.query("SELECT precio from item where idItem = ($1)", [objeto]);

			if (res.rows[0] >= puntos.rows[0]){
				
				const query = {
  				text: "INSERT INTO posee VALUES($1, $2)", 
  				values: [username, objeto], 				
  				rowMode: 'array',
				}
				const insert = await pool.query(query);  
				
				total = res.rows[0] - puntos.rows[0];

				const query = {
  				text: "UPDATE Usuario SET puntos = VALUES($1) WHERE nombre = VALUES($2)", 
  				values: [total, username], 				
  				rowMode: 'array',
				}
				const res = await pool.query(query);
				return true;				
			}
			return false;
		} catch (err){
			console.log(err);
			return false;
		}
	}		
		
	static async precios(){
		try {
			const res = await pool.query("SELECT * from item");
			return res.rows;
		} catch (err){
			console.log(err);
			return false;
		}	
	}
		
	static async consultarObjetos(nombre){
		try {
			const res = await pool.query("SELECT * from posee where Usuario_nombre=($1)", [nombre]);
			return res.rows;
		} catch (err){
			console.log(err);
			return false;
		
		}	
	}
}
