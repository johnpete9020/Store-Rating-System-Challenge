const bcrypt = require('bcrypt');
const db = require('../config/db');

exports.updatePassword = async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.id;

  // Password validation (8-16 chars, 1 uppercase, 1 special char)
  const passRegex = /^(?=.*[A-Z])(?=.*[!@#\$%\^&\*]).{8,16}$/;
  if (!passRegex.test(newPassword)) {
    return res.status(400).json({ error: 'Password must be 8-16 characters, include 1 uppercase and 1 special character.' });
  }

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(newPassword, salt);
    
    await db.query('UPDATE users SET password_hash = $1 WHERE id = $2', [password_hash, userId]);
    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error while updating password' });
  }
};