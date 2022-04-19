const pool = require("../db");



//register

module.exports = class UserService {

static async registerUser(username, passwd, email) {
		try {
			var values = [username, passwd, email];
			const newUser = await pool.query(
			"INSERT INTO Usuario (Nombre, Contraseña, Puntos, Email) VALUES ($1, $2, '0', $3)", values);
			return true;
		} catch (err){
			console.log(err);
			return false;
		}
	}


//login

	static async login(username, passwd) {
		try {
			const query = {
  				text: "SELECT contraseña from Usuario where nombre = ($1)",
  				values: [username],
  				rowMode: 'array',
			}
			const res = await pool.query(query);
			if (String(res.rows[0]) === passwd){
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
}

