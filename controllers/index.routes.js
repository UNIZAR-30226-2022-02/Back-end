const express = require('express')
const router = express.Router()
const api = require('./api')

router.post("/register", api.registerUser);

router.post("/login", api.login);

router.post("/login/delete", api.deleteUser);

module.exports = router
