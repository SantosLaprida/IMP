const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

const corsOptions = {
  origin: '*', // Temporarily allow all origins for testing
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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




app.post('/users/login', (req, res) => {

  //console.log("inside login endpoint")

  const email = req.body.email;
  const password = req.body.password;

  const sql = 'SELECT * FROM I_Members WHERE email = ? AND password = ?';

  db.query(sql, [email, password], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    } else {

      if (results.length > 0) {
        // Send back the first user found in the results
        
        res.status(200).json({ message: 'Login successful', user: results[0] });
      } else {
        res.status(401).json({ message: 'Login failed' });
      }
    }
  });
});


/**
 * Endpoint that checks if an email exists in the database.
 * @param {object} req - The request object, containing parameters.
 * @param {object} res - The response object, used to send responses back to the client.
 */
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




  /**
   * Endpoint that inserts a new user in the database.
   * @param {object} req - The request object, containing parameters.
   * @param {object} res - The response object, used to send responses back to the client.
   */
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

/**
 * Endpoint that fetches all players from the database.
 * @param {object} req - The request object.
 * @param {object} res - The response object, used to send responses back to the client.
 */
app.get('/players', (req, res) => {

  console.log("Inside players endpoint")

  // Declare the query.
  const sql = 'SELECT id_player, name, ranking FROM I_Players';

  db.query(sql, (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});



/**
 * Endpoint that inserts a new team in the database with the userID.
 * @param {object} req - The request object, containing parameters.
 * @param {object} res - The response object, used to send responses back to the client.
 */
app.post('/teams', (req, res) => {

  console.log(req.body); // Log the request body

  const { userId: { userId, team } } = req.body;

  // console.log(userId);
  // console.log(team);

  // Check if a team already exists for the user
  const checkSql = 'SELECT * FROM I_Apuestas WHERE id_member = ?';
  db.query(checkSql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });

      // console.log("results length")
      // console.log(results.length);

    } else if (results.length > 0) {
      // If a team already exists, send a response indicating this
      res.status(409).json({ message: 'Team already stored for this user' });
    } else {
      // If no team exists, proceed with storing the team
      team.forEach(element => {
        // Declare the query.
        const sql = 'INSERT INTO I_Apuestas (id_member, id_player) VALUES (?, ?)';
        db.query(sql, [userId, element], (err, results) => {
          if (err) {
            console.error(err);
            res.status(500).json({ message: 'Server error' });
          }
        });
      });

      // Send a response back to the client after all players have been inserted
      res.status(200).json({ message: 'Team stored' });
    }
  });
});


/**
 * Endpoint that fetches a given user_id team.
 * @param {object} req - The request object.
 * @param {object} res - The response object, used to send responses back to the client.
 */
app.get('/getTeam/:userId', (req, res) => {


  // console.log("Inside getTeam");
  
  const userId = req.params.userId;

  // Declare the query.
  const sql = 'SELECT * FROM I_Apuestas WHERE id_member = ?';

  db.query(sql, [userId], (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error', error: err.message });
    } else {
      res.status(200).json(results);
    }
  });
});

const port = 3000;

app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
});


