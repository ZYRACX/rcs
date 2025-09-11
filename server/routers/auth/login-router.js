const express = require('express');
const cors = require('cors');
const mysql = require("mysql2")
const bcrypt = require("bcrypt")

const router = express.Router();
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rcs'
})



router.post('/', (req, res) => {
    const sql = "SELECT * FROM user WHERE email = ?"
    db.query(sql, [req.body.email], (error, results) => {
        if (error) {
            console.log("Database error while selecting: ", error);
            return res.status(500).json({ error: "Database error" });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        bcrypt.compare(req.body.password, results[0].password, (err, isMatch) => {
            if (err) {
                console.log("Hash comparison error: ", err);
                return res.status(500).json({ error: "Internal server error" });
            }
            if (!isMatch) {
                return res.status(401).json({ error: "Invalid email or password" });
            }

            // Insert profile and then respond
            db.query("INSERT INTO profile (`userId`) VALUES (?)", [results[0].userId], (error) => {
                if (error) {
                    console.log("Database error while inserting profile: ", error);
                    return res.status(500).json({ error: "Database error" });
                }
                return res.status(200).json({ 
                    message: "Login successful and profile created", 
                    userId: results[0].userId 
                });
            })
        })
    })
})

module.exports = router;