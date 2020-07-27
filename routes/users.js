const express = require('express');
const router = express.Router();
const db = require('../database/db');

router.post('/', (req, res, next) => {
	const { email, password } = req.body;
	if (email.length != 0 && password.length != 0) {
		let sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
		db.query(sql, [email, password], (err, result) => {
			if (err) throw err;
			console.log(result);
		});
		res.json({ message: 'User added successfuly' });
	}
});

module.exports = router;
