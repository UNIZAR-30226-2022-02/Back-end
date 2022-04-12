const Pool = require("pg").Pool;
require("dotenv").config();

const connection = process.env.DATABASE_URL;

const pool = new Pool({
	connection,
	ssl: {
        rejectUnauthorized: false,
    	},
});


module.exports = pool;
