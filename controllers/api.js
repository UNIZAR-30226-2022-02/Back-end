const userService = require("../services/usuariosService");



module.exports = class Api {


//register


	static async apiRegisterUser(req) {
		try {	
			console.log(req.body);
			const username = req.body.username;					
			if (!(await userService.checkUser(username))) {				
				const passwd = req.body.passwd;
				const puntos = req.body.puntos;
				const email = req.body.email;
				if (await userService.registerUser(username, passwd, puntos, email)){
					console.log("Usuario registrado");
					return true;				
				}
				return false;
									
			}
			console.log("error func checkuser");
			return false;
		} catch (err){	
			console.log(err);
			return false;
		}
	}


//login

	static async apiLogin(req) {
		try {
			const username = req.body.username;
			//console.log(userService.checkUser(username));
			var ok = await userService.checkUser(username);
			if (ok) {
				const passwd = req.body.passwd;	
				if (await userService.login(username, passwd)){
					console.log("User login success");
					return true;
				}
				console.log("Fallo func login");
				return false;
				
			}
			const passwd = req.body.passwd;
			//console.log(userService.login(username, passwd));
			console.log("Fallo func checkuser");
			
			return false;	
		} catch(err){	
			console.log(err);
		}
	}


	
	static apideleteUser(){	
		var result;
	}
		
	
}
