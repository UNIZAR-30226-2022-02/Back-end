const pool = require("../db");



//register

module.exports = class ConnHandler {

	var dict = {}
		 

	static async asociarSocket(socket ) {
		dict["socket"] = socket;
	}

}
