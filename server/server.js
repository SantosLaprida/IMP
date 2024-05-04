const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host: '35.199.107.210',
    user: 'claprida',
    password: 'lapridac',
    database: 'laprida_obras2'
});

db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('Connected to database');
});

app.get('/hello', (req, res) => {
    res.send('Hello, World!');
});

const port = 3000;
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});