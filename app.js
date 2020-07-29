const express = require('express');
const morgan = require('morgan')
const books = require('./routes/books');
const user = require('./routes/users')

const app = express();

app.use(express.static('public'));
app.use(express.json());
app.use(morgan('dev'));
app.use('/uploads',express.static('uploads'))

//  API ROUTES
app.use('/api/books', books);
app.use('/api/users',user)

app.use((req, res, next) => {
    const method = req.method;
    // console.log(req.method)
    res.json({
        message: `Can not ${method} in this route`
    })
    next();
})

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
