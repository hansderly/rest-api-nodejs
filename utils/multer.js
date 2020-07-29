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
        cb(null, 'IMG-' + fullDate + '-' + file.originalname);
    },
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpg' || file.mimetype === 'image/png') {
        cb(null, true)
    }
    else {
        cb(null, false)
    }
}

const upload = multer({ storage });

module.exports = upload;