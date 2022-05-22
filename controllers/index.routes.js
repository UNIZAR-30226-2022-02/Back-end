const express = require('express')
const router = express.Router()
const api = require('./api')

router.post("/register", api.registerUser);

router.post("/login", api.login);

router.post("/login/delete", api.deleteUser);

router.post("/partida/crearPartida", api.crearPartida);

router.post("/partida/unirPartida", api.unirPartida);

module.exports = router
