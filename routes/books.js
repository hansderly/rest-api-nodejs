const express = require('express');
const router = express.Router();
const db = require('../database/db');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'})

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, file.fieldname + '_' + Date.now() + '.jpg');
	},
});

const upload = multer({ storage: storage });

router.get('/', (req, res) => {
	let sql = 'SELECT * FROM books';
	let data;
	db.query(sql, (err, result) => {
		if (err) throw err;
		console.log(JSON.parse(JSON.stringify(result)));
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
		console.log(result);
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

router.post('/', upload.any('image'), (req, res) => {
	const image = req.files;
	console.log(image);
	// const { title, author, year } = req.body;
	// let sql = 'INSERT INTO books ( title, author, img, year) VALUES (?,?,?,?)';
	// db.query(sql, [title, author, image, year], (err, result) => {
	// 	if (err) throw err;
	// 	console.log(result);
	// });
	res.json({ message: 'good' });
});

// router.put()

router.delete('/:id', (req, res) => {
	const id = req.params.id;

	let sql = 'DELETE FROM books WHERE id = ?';
	db.query(sql, id, (err, result) => {
		if (err) throw err;
		console.log(result);
	});
	res.json({ message: 'Book deleted' });
});

module.exports = router;
