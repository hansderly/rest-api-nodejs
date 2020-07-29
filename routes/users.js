const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRound = 10;
const jwt = require('jsonwebtoken');
const config = require('config');

const db = require('../database/db');
const upload = require('../utils/multer');

router.post('/signup', upload.single('avatar'), (req, res, next) => {
	const { email, password } = req.body;
	if (email.length != 0 && password.length != 0) {
		// ! Check if email exists
		let isexsist;
		let sql1 = 'SELECT * FROM users WHERE email = ?';
		db.query(sql1, email, (err, result) => {
			isexsist = result.length;
			if (isexsist > 0)
				return res.status(409).json({ error: 'email already exist' });

			const image = req.file.destination + req.file.filename;
			const baseURL = config.get('baseURL');
			const imagePath = baseURL + image;
			console.log(imagePath, image);

			// ! hash password & add the user on the database
			const hashPassword = bcrypt.hashSync(password, saltRound);
			let sql =
				'INSERT INTO users (email, password, avatar) VALUES (?, ?, ?)';
			db.query(sql, [email, hashPassword, imagePath], (err, result) => {
				if (err) throw err;
			});

			res.json({ message: `User ${email} added successfuly` });
		});
	}
});

router.post('/signin', (req, res, next) => {
	const { email, password } = req.body;
	let sql = 'SELECT * FROM users WHERE email = ?';
	db.query(sql, email, async (err, result) => {
		const { password: hashPassword, avatar } = result[0];
		// console.log(hashPassword, avatar);

		const isMatch = bcrypt.compareSync(password, hashPassword);
		if (isMatch) {
			const token = jwt.sign(
				{
					username: result[0].username,
					email: email,
					avatar,
				},
				'privatekey',
				{ expiresIn: '1h' }
			);
			// let headers =  new Headers();
			// headers.append('Authorization', token)
			// req.headers.authorization = token;
			// console.log(req.headers);

			const decode = jwt.verify(token, 'privatekey');
			console.log(decode)
			res.status(201).json({ messaege: 'user sigin' });
		}
	});
});

module.exports = router;
