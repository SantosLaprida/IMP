const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

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

// app.get('/hello', (req, res) => {
//     res.send('Hello, World!');
// });

// // New endpoint to fetch data from the database
// app.get('/fetchdata', (req, res) => {
//     let sql = 'SELECT * FROM I_MaestroJugadores'; 
//     db.query(sql, (err, results) => {
//         if(err) throw err;
//         res.send(results);
//     });
// });

app.get('/users/email/:email', (req, res) => {
    // Get the email from the request parameters.
    const email = req.params.email;
  
    // Declare the query.
    const sql = 'SELECT * FROM I_Members WHERE email = ?';

    // Execute the query.
    db.query(sql, [email], (err, results) => {
        if (err) throw err;
        // If the email exists, respond with a message saying the email is taken.
        // If the email does not exist, respond with a message saying the email is available.
        if (results.length > 0) {
            res.send('Email is taken');
        } else {
            res.send('Email is available');
        }
    });
  });


  app.post('/users/register', (req, res) => {
    const { email, password, firstName, lastName } = req.body;
    const status = 1; // Assuming status is always 1 for new users
    const user = email; // Assuming user is the same as email
  
    // Declare the query.
    const sql = 'INSERT INTO I_Members (name, last_name, email, status, user, password) VALUES (?, ?, ?, ?, ?, ?)';
  
    db.query(sql, [firstName, lastName, email, status, user, password], (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
      } else {
        res.status(200).json({ message: 'User registered successfully' });
      }
    });
  });



const port = 3000;
app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});