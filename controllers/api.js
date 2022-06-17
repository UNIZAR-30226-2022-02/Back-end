const usuarioDAO = require("../DAO/usuarioDAO");
const partidaDAO = require("../DAO/partidaDAO");
const tiendaDAO = require("../DAO/tiendaDAO");
const jugadaDAO = require("../DAO/jugadaDAO");



const api = {};


//register


api.registerUser = async(req, res)=>{
	try {
		const username = req.body.username;
		if (!(await usuarioDAO.checkUser(username))) {
			const password = req.body.password;			
			const email = req.body.email;
			if (await usuarioDAO.registerUser(username, password, email)){
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
		if (await usuarioDAO.checkUser(username)){
			const password = req.body.password;
			if (await usuarioDAO.login(username, password))
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
	if (await usuarioDAO.checkUser(username)){
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
	result = await usuarioDAO.getItemsUsados(username);
	res.send(result);
}

api.getDatosUsuario = async(req, res) => {
	const username = req.body.username;
	console.log(username);
	var items = await usuarioDAO.getItemsUsados(username);
	var comprados = await tiendaDAO.consultarObjetos(username);
	var inPartida = await partidaDAO.consultarEnPartida(username);	
	console.log(items);
	console.log(inPartida);
	console.log(comprados.item_iditem);
	if (comprados.item_iditem == undefined){
		comprados = [1, 2];	
	}
	resultado = {mapaSel: items.mapa, fichaSel: items.fichas, enPartida: inPartida, objetosComprados: comprados, idPartida: inPartida};
	res.send(resultado);
}

//PARTIDAS


api.crearPartida = async(req, res) =>{
	const publica = req.body.publica;
	const username = req.body.username;
	var tipo = req.body.tipo;	
	const maxJugadores = req.body.maxJugadores;
	console.log(username);
	console.log(publica, " ", tipo, " ", maxJugadores);	
	var respuesta = await partidaDAO.crearPartida(username, tipo, publica, maxJugadores);	
	if (publica == "Privada")
		res.send(respuesta);	
	else
		res.send(respuesta);
}

api.unirPartida = async(req, res) =>{
	const username = req.body.username;
	const tipoPartida = req.body.tipoPartida		
	if (tipoPartida == "Privada"){	
		const codigo = req.body.codigo;
		respuesta = await partidaDAO.unirPartidaPrivada(username, codigo);		
		if(respuesta === false)
			res.send("Codigo incorrecto");
		else
			res.send(respuesta);			
	}
	else{		
		respuesta = await partidaDAO.unirPartidaPublica(username);
		res.send(respuesta);
	}	
}

api.consultarEnPartida = async(req, res) =>{
	const username = req.body.username;	
	res.send(partidaDAO.consultarEnPartida(username));
}

api.obtenerJugadas = async(req, res) => {
	const username = req.body.username;
	const idPartida = req.body.idPartida;
	console.log(username, idPartida);
	respuesta = await jugadaDAO.generarListaJugadas(username, idPartida)
	res.send(respuesta);
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
	if(tiendaDAO.comprarObjeto(username, item)){
		res.send("true");	
	}
	else
		res.send("false");	
	
}

api.getItems = async(req, res) => {
	const username = req.body.username;
	res.send(tiendaDAO.consultarObjetos(username));
}


module.exports = api;
