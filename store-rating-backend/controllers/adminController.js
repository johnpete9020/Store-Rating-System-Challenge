const db = require('../config/db');
const bcrypt = require('bcrypt');

// Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const users = await db.query('SELECT COUNT(*) FROM users');
    const stores = await db.query('SELECT COUNT(*) FROM stores');
    const ratings = await db.query('SELECT COUNT(*) FROM ratings');

    res.json({
      totalUsers: parseInt(users.rows[0].count),
      totalStores: parseInt(stores.rows[0].count),
      totalRatings: parseInt(ratings.rows[0].count)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Get Users with Sorting & Filtering
exports.getUsers = async (req, res) => {
  try {
    const { name, email, address, role } = req.query;

    // Join users with stores and ratings to calculate average if they are an owner
    let queryStr = `
      SELECT u.id, u.name, u.email, u.address, u.role,
             (CASE WHEN u.role = 'store_owner' THEN COALESCE(ROUND(AVG(r.rating), 1), 0) ELSE NULL END) as store_rating
      FROM users u
      LEFT JOIN stores s ON u.id = s.owner_id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (name) { queryStr += ` AND u.name ILIKE $${paramIndex++}`; queryParams.push(`%${name}%`); }
    if (email) { queryStr += ` AND u.email ILIKE $${paramIndex++}`; queryParams.push(`%${email}%`); }
    if (address) { queryStr += ` AND u.address ILIKE $${paramIndex++}`; queryParams.push(`%${address}%`); }
    if (role) { queryStr += ` AND u.role = $${paramIndex++}`; queryParams.push(role); }

    queryStr += ` GROUP BY u.id ORDER BY u.name ASC`;

    const result = await db.query(queryStr, queryParams);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching users' });
  }
};

// Get Stores with Owner Names & Ratings for Admin
exports.getStores = async (req, res) => {
  try {
    const { name, email, address } = req.query;
    
    let queryStr = `
      SELECT s.id, s.name, s.email, s.address, u.name as owner_name,
             COALESCE(ROUND(AVG(r.rating), 1), 0) as average_rating
      FROM stores s
      LEFT JOIN users u ON s.owner_id = u.id
      LEFT JOIN ratings r ON s.id = r.store_id
      WHERE 1=1
    `;
    const queryParams = [];
    let paramIndex = 1;

    if (name) { queryStr += ` AND s.name ILIKE $${paramIndex++}`; queryParams.push(`%${name}%`); }
    if (email) { queryStr += ` AND s.email ILIKE $${paramIndex++}`; queryParams.push(`%${email}%`); }
    if (address) { queryStr += ` AND s.address ILIKE $${paramIndex++}`; queryParams.push(`%${address}%`); }

    queryStr += ` GROUP BY s.id, u.name ORDER BY s.name ASC`;

    const result = await db.query(queryStr, queryParams);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: 'Server error fetching stores' });
  }
};

// Add a New User (Normal, Admin, or Store Owner)
exports.addUser = async (req, res) => {
  const { name, email, password, address, role } = req.body;
  
  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);
    
    const newUser = await db.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, role',
      [name, email, password_hash, address, role || 'normal_user']
    );
    
    res.status(201).json({ message: 'User created', user: newUser.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ error: 'Email already exists' });
    res.status(500).json({ error: 'Server error' });
  }
};