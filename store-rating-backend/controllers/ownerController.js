const db = require('../config/db');

exports.getOwnerDashboard = async (req, res) => {
  const ownerId = req.user.id;

  try {
    // 1. Find the store owned by this user
    const storeResult = await db.query('SELECT * FROM stores WHERE owner_id = $1', [ownerId]);
    if (storeResult.rows.length === 0) {
      return res.status(404).json({ error: 'No store registered to this owner' });
    }
    const store = storeResult.rows[0];

    // 2. Get the average rating
    const avgResult = await db.query(
      'SELECT COALESCE(ROUND(AVG(rating), 1), 0) as average_rating FROM ratings WHERE store_id = $1', 
      [store.id]
    );

    // 3. Get list of users who rated this store
    const ratingsResult = await db.query(`
      SELECT u.name, u.email, r.rating, r.updated_at 
      FROM ratings r
      JOIN users u ON r.user_id = u.id
      WHERE r.store_id = $1
      ORDER BY r.updated_at DESC
    `, [store.id]);

    res.json({
      storeDetails: store,
      averageRating: parseFloat(avgResult.rows[0].average_rating),
      submittedRatings: ratingsResult.rows
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error loading owner dashboard' });
  }
};