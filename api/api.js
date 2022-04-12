const userController = require("./usuariosController");



const api = {}


//register


api.registerUser = async(req, res)=>{
	try {
		const username = req.body.username;
		if (!(await userController.checkUser(username))) {
			const passwd = req.body.passwd;
			const puntos = req.body.puntos;
			const email = req.body.email;
			if (await userController.registerUser(username, passwd, email)){
				res.send("Usuario registrado.");
			}
		}
		else
			res.send("Ya existe este usuario.");
	} catch (err){
		console.log(err);
		res.send("Fallo en el registro.");
	}
}


//login

api.login = async(req, res)=>{
	try {		
		const username = req.body.username;
		if (await userController.checkUser(username)){
			const passwd = req.body.passwd;
			if (await userController.login(username, passwd))
				res.send("Usuario logeado.");
			else
				res.send("Usuario o contraseña incorrecta.");
		}
		else
			res.send("Usuario o contraseña incorrecta.");
	} catch(err){
		console.log(err);
		res.send("Fallo en el login.");
	}
}



api.deleteUser = async(req, res)=>{
	const username = req.body.username
	if (await userController.checkUser(username)){
		userService.deleteUser(username)
		res.send("Usuario eliminado.")
	}
	else
		res.send("Usuario incorrecto.")
}


module.exports = api
