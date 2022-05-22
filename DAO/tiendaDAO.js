const pool = require("../db");




module.exports = class TiendaDAO {

	static async comprarObjeto(username, objeto) {
		try {
			if (checkPuntos(username, objeto)
		} catch (err){
			console.log(err);
			return false;
		}
	}


	static async checkPuntos(username, objeto) {
		try{
			const res = await pool.query("SELECT puntos from Usuario where nombre = ($1)", [username]);
			const puntos = await pool.query("SELECT precio from Objeto where objeto = ($1)", [objeto]);
			return res.rows[0] >= puntos.rows[0];			
		} catch(err){
			console.log(err);
		}
	}
}
