const express = require("express");
const router = express.Router();


// Database connection
const db = require("../../connection");

// 1️⃣ Search users by username or email
router.get('/users', (req, res) => {
    const search = req.query.q || '';
    const sql = "SELECT userId, email, username FROM user WHERE email LIKE ? OR username LIKE ?";
    db.query(sql, [`%${search}%`, `%${search}%`], (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" + err });
        res.json(results);
    });
});

// 2️⃣ Update user
router.put('/users/:userId', (req, res) => {
    const userId = req.params.userId;
    const { email, username } = req.body;

    const sql = "UPDATE user SET email = ?, username = ? WHERE userId = ?";
    db.query(sql, [email, username, userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User updated successfully" });
    });
});

// 3️⃣ Delete user
router.delete('/users/:userId', (req, res) => {
    const userId = req.params.userId;

    const sql = "DELETE FROM user WHERE userId = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) return res.status(500).json({ error: "Database error" });
        res.json({ message: "User deleted successfully" });
    });
});




module.exports = router;