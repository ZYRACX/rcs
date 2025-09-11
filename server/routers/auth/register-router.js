const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const bcrypt = require("bcrypt");

// Database connection
const db = require("../../connection");

// Register route
router.post('/', (req, res) => {
    const sql = "INSERT INTO user (`username`, `email`, `password`) VALUES (?)"
    bcrypt.hash(req.body.password, 10, (err, hash) => {
        if (err) {
            console.log("Hashing error: ", err);
            return res.status(500).json({ error: "Internal server error" });
        }
        const values = [
            req.body.username,
            req.body.email,
            hash
        ]
        db.query(sql, [values], (error, result) => {
            if (error) {
                console.log("Database error while inserting: ", error);
                if(error.code === 'ER_DUP_ENTRY'){
                    return res.status(409).json({ error: "User already exists" });
                }
                return res.status(500).json({ error: "Database error" });
            }
            
            return res.status(201).json({ message: "User registered successfully" });
        })

    })
})


module.exports = router;