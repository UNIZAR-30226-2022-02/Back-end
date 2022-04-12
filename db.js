const Pool = require("pg").Pool;
require("dotenv").config();

connection = process.env.DATABASE_URL;

const pool = new Pool({

/*	user: process.env.DB_USER,
	password: process.env.DB_PASSWD,
	database: process.env.DB_NAME,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,*/
	connection,
	ssl: {
        rejectUnauthorized: false,
    }
});


module.exports = pool;
