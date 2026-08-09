const db = require('../config/db');

// Public or Normal User: Get all stores with average ratings
exports.getStores = async (req, res) => {
  try {
    const { search, sortBy = 'name', order = 'asc' } = req.query;
    
    // Prevent SQL injection by whitelisting columns
    const validColumns = ['name', 'email', 'address', 'average_rating'];
    const sortColumn = validColumns.includes(sortBy) ? sortBy : 'name';
    const sortOrder = order.toLowerCase() === 'desc' ? 'DESC' : 'ASC';

    let queryStr = `
      SELECT s.id, s.name, s.email, s.address, 
             COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating 
      FROM stores s
      LEFT JOIN ratings r ON s.id = r.store_id
    `;
    const queryParams = [];

    if (search) {
      queryStr += ` WHERE s.name ILIKE $1 OR s.address ILIKE $1`;
      queryParams.push(`%${search}%`);
    }

    queryStr += ` GROUP BY s.id ORDER BY ${sortColumn} ${sortOrder}`;

    const result = await db.query(queryStr, queryParams);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while fetching stores' });
  }
};

// Admin: Add a new store
exports.addStore = async (req, res) => {
  const { name, email, address, owner_id } = req.body;
  try {
    const newStore = await db.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, email, address, owner_id || null]
    );
    res.status(201).json(newStore.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Store email already exists' });
    res.status(500).json({ error: 'Server error while adding store' });
  }
};

// Normal User: Rate a store (Inserts new rating or updates existing one)
exports.rateStore = async (req, res) => {
  const { store_id } = req.params;
  const { rating } = req.body;
  const user_id = req.user.id;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const upsertQuery = `
      INSERT INTO ratings (user_id, store_id, rating) 
      VALUES ($1, $2, $3) 
      ON CONFLICT (user_id, store_id) 
      DO UPDATE SET rating = EXCLUDED.rating 
      RETURNING *;
    `;
    const result = await db.query(upsertQuery, [user_id, store_id, rating]);
    res.json({ message: 'Rating submitted successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while submitting rating' });
  }
};