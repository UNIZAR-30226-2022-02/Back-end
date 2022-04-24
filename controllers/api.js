const userDAO = require("../DAO/usuarioDAO");



const api = {}


//register


api.registerUser = async(req, res)=>{
	try {
		const username = req.body.username;
		if (!(await userDAO.checkUser(username))) {
			const password = req.body.password;			
			const email = req.body.email;
			if (await userDAO.registerUser(username, password, email)){
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
		if (await userDAO.checkUser(username)){
			const passwd = req.body.password;
			if (await userDAO.login(username, password))
				res.status(200).send("OK");
			else
				res.status(200).send('Usuario o contraseña incorrecta');
				//res.send("Usuario o contraseña incorrecta.");
		}
		else
			res.status(200).send('Usuario o contraseña incorrecta');
			//res.send("Usuario o contraseña incorrecta.");
	} catch(err){
		console.log(err);
		res.sendStatus(500);
		//res.send("Fallo en el login.");
	}
}



api.deleteUser = async(req, res)=>{
	const username = req.body.username
	if (await userDAO.checkUser(username)){
		userService.deleteUser(username)
		res.send("Usuario eliminado.")
	}
	else
		res.send("Usuario incorrecto.")
}


module.exports = api
