const express = require('express');
const books = require('./routes/books');

const app = express();

app.use(express.static('public'));
app.use(express.json());

//  API ROUTES
app.use('/api/books', books);

const PORT = 8080;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
