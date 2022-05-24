const pool = require("../db");



//register

module.exports = class UserDAO {

	static async registerUser(username, password, email) {
		try {
			var values = [username, password, email];
			const newUser = await pool.query(
			"INSERT INTO Usuario (Nombre, Contraseña, Puntos, Email, mapa_idItem, fichas_idItem) VALUES ($1, $2, '0', $3, 0, 0)", values);
			return true;
		} catch (err){
			console.log(err);
			return false;
		}
	}

//login

	static async login(username, password) {
		try {
			const query = {
  				text: "SELECT contraseña from Usuario where nombre = ($1)",
  				values: [username],
  				rowMode: 'array',
			}
			const res = await pool.query(query);
			if (String(res.rows[0]) === password){
				return true;
			}
			return false;
		} catch(err){
			console.log(err);
		}
	}

	static async checkUser(username) {
		try{
			const res = await pool.query("SELECT * from Usuario where nombre = ($1)", [username]);
			return !(res.rows.length === 0);
		} catch(err){
			console.log(err);
		}
	}
	static async deleteUser(username){
		const res = await pool.query("DELETE FROM Usuario where nombre = ($1)", [username]);
		console.log(res.rows[0]);
	}	
	
	static async actualizarMapa(mapa, username){
		const res = await pool.query("UPDATE Usuario set mapa_idItem = ($1) where nombre = ($2)", [mapa, username]);	
	}
	
	static async actualizarFichas(fichas, username){
		const res = await pool.query("UPDATE Usuario set fichas_idItem = ($1) where nombre = ($2)", [fichas, username]);	
	}
	
	static async getItemsUsados(username) {			
		const res = await pool.query("SELECT mapa_idItem, fichas_idItem where nombre = ($1)", [username]);
		var items = {mapa: res.rows.mapa_idItem, fichas: res.rows.fichas_idItem};
		return items;	
	}
}

