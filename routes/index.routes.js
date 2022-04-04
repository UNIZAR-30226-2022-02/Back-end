const express = require('express')
const router = express.Router()
const api = require("../controllers/api.controller")

router.post("/register", api.apiRegisterUser);

router.get("/login", api.apiLogin);

router.get("/login/delete", api.apiDeleteUser);

module.exports = router
