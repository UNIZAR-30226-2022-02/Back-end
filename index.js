const express = require("express");
const bodyparser = require("body-parser");
const app = express();
var api = require("./controllers/api");

app.listen(3000, function () {
    console.log("Servidor escuchando en el puerto 3000.");
});

//app.use(bodyparser.urlencoded({extended:false}))
app.use(bodyparser.json())
app.use(express.urlencoded({extended:false}));



//routes


app.post("/register", async(req, res) => {
	if(api.apiRegisterUser(req)){
		//res.send("Usuario registrado");
		
	}	
	else{	
		//res.send("Fallo en el registro");
		console.log("Fallo en el registro");
	}
});

app.get("/login", async(req, res) => {
	if(api.apiLogin(req)){
		//res.send("Usuario registrado");
		
	}	
	else{	
		//res.send("Fallo en el registro");
		console.log("Fallo en el login");
	}
});




