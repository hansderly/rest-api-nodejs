const express = require('express');
const router = express.Router();
const db = require('../database/db');
const config = require('config');
const multer = require('multer');
// const upload = multer({dest: 'uploads/'})

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'uploads/');
	},
	filename: (req, file, cb) => {
		// console.log(file);
		const date = new Date();
		const month = date.getUTCMonth() + 1
		const day = date.getUTCDate()
		const year = date.getUTCFullYear()
		const fullDate = year.toString() + month.toString() + day.toString()
		cb(null, 'IMG-' + fullDate + '-' + file.originalname );
	},
});

const fileFilter = (req, file, cb) => {
	if(file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
		cb(null, true)
	}
	 else {
		 cb(null, false)
	 }
}

const upload = multer({ storage });

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
	const { title, author, year } = req.body;
	const baseURL = config.get("baseURL")
	const imagePath = baseURL + image;
	console.log(imagePath, image);
	let sql = 'INSERT INTO books ( title, author, img, year) VALUES (?,?,?,?)';
	db.query(sql, [title, author, imagePath, year], (err, result) => {
		if (err) throw err;
		// console.log(result);
	});
	res.json({ message: 'Book added successfully' });
});

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
