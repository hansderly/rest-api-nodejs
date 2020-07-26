const mysql = require('mysql');

const connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
	database: 'api_db',
});

// const connection = mysql.createConnection({
// 	host: '213.190.6.43',
// 	user: 'u191982321_dey',
// 	password: '#Princeandy95',
// 	database: 'u191982321_api',
// });

connection.connect(function (err) {
	if (err) throw err;

	console.log('DB connected');
});

module.exports = connection;
