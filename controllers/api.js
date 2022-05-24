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


api.usarMapa = async(req, res) => {
	const username = req.body.username;
	const mapa = req.body.mapa;
	res.send(usuarioDAO.actualizarMapa(mapa, username));
}

api.usarFichas = async(req, res) => {
	const username = req.body.username;
	const fichas = req.body.fichas;
	res.send(usuarioDAO.actualizarFichas(fichas, username));
}

api.consultarItemsUsados = async(req, res) => {
	const username = req.body.username;
	res.send(usuarioDAO.getItemsUsados(username));
}

//PARTIDAS


api.crearPartida = async(req, res) =>{

	const publica = req.body.publica;
	const nombre = req.body.nombre;
	const tipo = req.body.tipo;
	const jugadores = req.body.jugadores;
	const maxJugadores = req.body.maxJugadores;	
	idPartida = await partidaDAO.crearPartida(nombre, jugadores, tipo, publica, maxJugadores);
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

api.consultarEnPartida = async(req, res) =>{
	const username = req.body.username;	
	res.send(partidaDAO.consultarEnPartida(username));
}

api.obtenerJugadas = async(req, res) => {
	const username = req.body.username;
	const idPartida = req.body.idPartida;
	res.send(generarListaJugadas(username, idPartida));
}

api.obtenerHistorial = async(req,res) => {
	const username = req.body.username;
	res.send(partidaDAO.getHistorial(username));
}

//TIENDA

api.inventarioTienda = async(req, res) => {
	return(tiendaDAO.precios());
}

api.comprarItem = async(req, res) => {
	const username = req.body.username;
	const item = req.body.item;
	res.send(tiendaDAO.comprarObjeto(username, item));
}

api.getItems = async(req, res) => {
	const username = req.body.username;
	res.send(tiendaDAO.consultarObjetos(username));
}


module.exports = api
