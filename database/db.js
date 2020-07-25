const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'api_db',
});



connection.connect(function (err) {
	if (err) throw err;

	console.log('DB connected');
});

module.exports = connection;
