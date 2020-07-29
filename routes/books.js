const express = require('express');
const router = express.Router();
const config = require('config');

const db = require('../database/db');
const auth = require('../middleware/auth');
const upload = require('../utils/multer');

//  GET API
router.get('/', (req, res) => {
	let sql = 'SELECT * FROM books';
	let data;
	db.query(sql, (err, result) => {
		if (err) throw err;
		// console.log(JSON.parse(JSON.stringify(result)));
		if (result.length == 0) data = { response: 'ok', message: 'no data' };
		if (result.length > 0) {
			const resultNumber = result.length;
			data = {
				response: 'ok',
				status: 'succes',
				result: resultNumber,
				data: JSON.parse(JSON.stringify([...result])),
			};
		}
		res.json(data);
	});
});

router.get('/:id', (req, res) => {
	const id = req.params.id;

	let sql = 'SELECT * FROM books WHERE id = ?';
	db.query(sql, id, (err, result) => {
		if (err) throw err;

		let data;
		// console.log(result);
		if (result.length == 0) data = { response: 'ok', message: 'no data' };
		if (result.length > 0) {
			const resultNumber = result.length;
			data = {
				response: 'ok',
				status: 'succes',
				result: resultNumber,
				data: JSON.parse(JSON.stringify([...result])),
			};
		}
		res.status(200).json(data);
	});
});

// ! .replace(/\s+/g, '')  => function to remove space from a string

router.post('/', upload.single('image'), (req, res) => {
	const image = req.file.destination + req.file.filename;
	const baseURL = config.get('baseURL');
	const imagePath = baseURL + image;
	console.log(imagePath, image);

	const { title, author, year } = req.body;
	let sql = 'INSERT INTO books ( title, author, img, year) VALUES (?,?,?,?)';
	db.query(sql, [title, author, imagePath, year], (err, result) => {
		if (err) throw err;
		// console.log(result);
	});

	res.json({ message: 'Book added successfully' });
});

setInterval(function () {
	let sql = 'SELECT * FROM books WHERE id = 1'
	db.query(sql, (results) => {
		console.log('1')
	});
}, 9000);
// router.put()

router.delete('/:id', (req, res) => {
	const id = req.params.id;

	let sql = 'DELETE FROM books WHERE id = ?';
	db.query(sql, id, (err, result) => {
		if (err) throw err;
		console.log(result);
	});
	res.json({ message: `Book ${id} deleted` });
});

module.exports = router;
