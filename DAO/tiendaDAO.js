const pool = require("../db");



module.exports = class TiendaDAO {

	static async comprarObjeto(username, objeto) {
		try {
			const res = await pool.query("SELECT puntos from Usuario where nombre = ($1)", [username]);
			const puntos = await pool.query("SELECT precio from item where idItem = ($1)", [objeto]);
			console.log(res.rows[0].puntos, puntos.rows[0].precio);
			if (res.rows[0].puntos >= puntos.rows[0].precio){				
				const query = {
  				text: "INSERT INTO posee VALUES($1, $2)", 
  				values: [username, objeto], 				
  				rowMode: 'array',
				}
				await pool.query(query);				
				var total = res.rows[0].puntos - puntos.rows[0].precio;
				console.log("Total: " + total);
				const query2 = {
  				text: "UPDATE Usuario SET puntos = ($1) WHERE nombre = ($2)", 
  				values: [total, username], 				
  				rowMode: 'array',
				}
				await pool.query(query2);
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
			var items = [];
			const res = await pool.query("SELECT * from item");
			for(var i = 0; i < res.rows.length; i++){
				items.add(res.rows[i]);			
			}
			items;
		} catch (err){
			console.log(err);
			return false;
		}	
	}
		
	static async consultarObjetos(nombre){
		try {
			var objetos = [];
			const res = await pool.query("SELECT * from posee where usuario_nombre=($1)", [nombre]);
			//console.log(res.rows[0].item_iditem);	
			for(var i = 0; i < res.rows.length; i++){
				objetos.add(res.rows[i].item_iditem);
			
			}		
			return objetos;
		} catch (err){
			console.log(err);
			return false;
		
		}	
	}
}
