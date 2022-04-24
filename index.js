const express = require("express");
const bodyparser = require("body-parser");
const app = express();
require("dotenv").config();

const PORT = process.env.PORT || 3000

app.listen(PORT, function () {
    console.log(`Servidor escuchando en el puerto ${PORT}.`);
});

//app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));
app.use(require('./controllers/index.routes'))






