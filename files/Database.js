const { Pool } = require('pg');
const auth = require('../auth.json');
const pool = new Pool({
	user: 'postgres',
	host: 'localhost',
	database: 'Ayako_DB',
	password: auth.pSQLpw,
	port: 5432,
});
pool.query('SELECT NOW() as now', (err) => {
	if (err) {
		console.log(`| Couldnt connect to DataBase\n ${err.stack}`);
	} else {
		console.log('| Established Connection to DataBase');
	}
});
pool.connect((err) => {
	if (err) {
		console.log(err.stack);
	}
});
  
pool.on('error', (err) => {
	console.error('Unexpected error on idle client', err);
});
module.exports = { pool };