const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: User login
 *     description: Logs in a user using email and password and returns a JWT token.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: user123
 *     responses:
 *       200:
 *         description: Successful login
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: your_jwt_token_here
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Server error
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ message: 'Provide email and password' });

  try {
    const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
    if (result.rows.length === 0)
      return res.status(400).json({ message: 'Invalid email or password' });

    const user = result.rows[0];
    const isMatch = password === user.password || await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: 'Invalid email or password' });

    const token = jwt.sign(
      { userId: user.ID, roleId: user.role_id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;










// const express = require('express');
// const router = express.Router();
// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const pool = require('../config/db');

// // POST /api/auth/login
// router.post('/login', async (req, res) => {
//   const { email, password } = req.body;
//   if (!email || !password)
//     return res.status(400).json({ message: 'Provide email and password' });

//   try {
//     // Check if user exists by email
//     const result = await pool.query('SELECT * FROM "User" WHERE email = $1', [email]);
//     if (result.rows.length === 0)
//       return res.status(400).json({ message: 'Invalid email or password' });

//     const user = result.rows[0];

//     // Compare password (if not hashed yet, just use plain text compare temporarily)
//     const isMatch = password === user.password || await bcrypt.compare(password, user.password);
//     if (!isMatch)
//       return res.status(400).json({ message: 'Invalid email or password' });

//     // Generate JWT
//     // const token = jwt.sign(
//     //   { userId: user.id, roleId: user.role_id, email: user.email },
//     //   process.env.JWT_SECRET,
//     //   { expiresIn: '1h' }
//     // );

//     const token = jwt.sign(
//   { userId: user.ID, roleId: user.role_id, email: user.email },
//   process.env.JWT_SECRET,
//   { expiresIn: '1h' }
// );


//     res.json({ token });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error' });
//   }
// });

// module.exports = router;













