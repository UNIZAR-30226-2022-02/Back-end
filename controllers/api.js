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
			const password = req.body.password;
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
	const username = req.body.username;
	if (await userDAO.checkUser(username)){
		userService.deleteUser(username);
		res.send("Usuario eliminado.");
	}
	else
		res.send("Usuario incorrecto.");
}

//PARTIDAS


api.crearPartida = async(req, res) =>{

	const publica = req.body.publica;
	const nombre = req.body.nombre;
	const tipo = req.body.tipo;
	const numJugadores = req.body.numJugadores;
	idPartida = await partidaDAO.crearPartida(nombre, numJugadores, tipo, publica);
	if (!publica)
		res.send("Partida creada correctamente con el codigo: ", partidaDAO.getCodigoPartida(idPartida)); 	
	else
		res.send("Partida creada correctamente. Espera al resto de jugadores");
}

api.unirPartida = async(req, res) =>{

	const username = req.body.username;
	const tipoPartida = req.body.tipoPartida
	if (tipoPartida == "privada"){	
		const codigo = req.body.codigo;
		if(await partidaDAO.unirPartidaPrivada(username, codigo))
			res.send("Unido a la partida correctamente");
		else
			res.send("Codigo incorrecto");
			
	}
	else{	
		await partidaDAO.unirPartidaPublica(username);
		res.send("Unido a la partida correctamente");	
	}	
}


module.exports = api
