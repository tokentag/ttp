const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

const pool = new Pool({
  user: 'toppfesp',
  host: 'peanut.db.elephantsql.com',
  database: 'toppfesp',
  password: 'xfWH1RVjIBjcqEkBuO-X6-r-tutIaxDS',
  port: 5432,
});

app.use(cors());
app.use(bodyParser.json());

app.post('/submit', async (req, res) => {
  try {
    const { userID, email, twclid } = req.body;
    const domain = req.get('origin');
    const submission = new Date();

    let re = /\S+@\S+\.\S+/;
    if (!userID || !email || !re.test(email) || userID.length < 32) {
      return res.status(403).json({ error: 'Invalid userID or email' });
    }

    const query = 'INSERT INTO email_list (userID, email, twclid, domain, submission) VALUES ($1, $2, $3, $4, $5)';
    const values = [userID, email, twclid, domain, submission];

    await pool.query(query, values);

    return res.status(200).json({ status: 200, message: 'Data submitted successfully'});
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({"status": 500, error: 'Internal Server Error with error message: \n ' + error });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
