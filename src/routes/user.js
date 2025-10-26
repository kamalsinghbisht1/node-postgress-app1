const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

/**
 * @swagger
 * /api/user/users:
 *   get:
 *     summary: Get logged-in user details
 *     description: Returns user information along with their role based on the JWT token.
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 ID:
 *                   type: integer
 *                   example: 2
 *                 email:
 *                   type: string
 *                   example: user@example.com
 *                 role_name:
 *                   type: string
 *                   example: user
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */
router.get('/users', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT u."ID", u.email, r.name AS role_name
      FROM public."User" u
      JOIN public.roles r ON u.role_id = r.id
      WHERE u."ID" = $1;
    `;

    const result = await pool.query(query, [userId]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


