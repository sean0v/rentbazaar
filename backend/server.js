require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
const path    = require('path'); 
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use(
  '/uploads',                             
  express.static(path.join(__dirname, 'uploads')) 
);

const pool = new Pool({
  connectionString: process.env.DB_URL,
  ssl: { rejectUnauthorized: false }    
});

app.use('/api/users', require('./routes/userRoutes.js'));
app.use('/api/offers', require('./routes/offerRoutes.js'));
app.use('/api/reviews', require('./routes/reviewRoutes.js'));
app.use('/api/orders', require('./routes/orderRoutes.js'));

app.get('/api/test', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.json({ success: true, time: result.rows[0] });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, error: err.message });
    }
});

app.use(express.static(path.join(__dirname, 'client', 'build')));
app.get('*', (_req, res) =>
  res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'))
);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log('[DB_URL]', process.env.DB_URL);
});
