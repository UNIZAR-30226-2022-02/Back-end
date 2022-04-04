const express = require("express");
const bodyparser = require("body-parser");
const app = express();

app.listen(3000, function () {
    console.log("Servidor escuchando en el puerto 3000.");
});

//app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));
app.use(require('./routes/index.routes'))






