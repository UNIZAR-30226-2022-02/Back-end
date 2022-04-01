const pool = require("../db");



//register

module.exports = class UserService {


	static async registerUser(username, passwd, puntos, email) {
		try {					
			var values = [username, passwd, puntos, email];				
			const newUser = await pool.query(
			"INSERT INTO Usuario (Nombre, Contraseña, Puntos, Email) VALUES ($1, $2, $3, $4)", values);			
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
			console.log(res.rows[0]);			
			console.log(passwd);				
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
			console.log(res.rows);									
			return !(res.rows.length === 0);			
			
			
		} catch(err){
			console.log(err);
		
		}
	}
	
	static deleteUser(){	
		var result;
		//result = await pool.query("DELETE FROM Usuario where nombre = $1", username);	
	}
	
}

