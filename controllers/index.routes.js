const express = require('express');
const router = express.Router();
const api = require('./api');

router.post("/register", api.registerUser);

router.post("/login", api.login);

router.post("/login/items", api.consultarItemsUsados);

router.post("/login/delete", api.deleteUser);

router.post("/partida/crearPartida", api.crearPartida);

router.post("/partida/unirPartida", api.unirPartida);

router.post("/tienda", api.getItems);

router.post("/store/selectMapa", api.usarMapa);

router.post("/store/selectFichas", api.usarFichas);

router.post("/tienda/comprar", api.comprarItem);

router.post("/historial", api.obtenerHistorial);

router.post("/login/datos", api.getDatosUsuario);

router.post("/jugadas/obtenerJugadas", api.obtenerJugadas);

module.exports = router;
