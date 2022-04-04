const express = require('express')
const router = express.Router()
const api = require("../controllers/api.controller")

router.post("/register", api.registerUser);

router.get("/login", api.login);

router.post("/login/delete", api.deleteUser);

module.exports = router
