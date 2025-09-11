const express = require("express");
const router = express.Router();


// Database connection
const db = require("../../connection");

router.get('/inventory', (req, res) => {
    // Fetch userId from request (e.g., from query params or headers)
    const userId = req.body.userId;
    if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
    }

    
    const sql = "SELECT profileId FROM profile WHERE userId = ?";
    // Query to get profileId from userId
    db.query(sql, [userId], (error, results) => {

        if (error) {
            console.log("Database error while fetching profile: ", error);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Profile not found" });
        }

        const profileId = results[0].profileId;
        const inventorySql = "SELECT * FROM inventory WHERE profileId = ?";

        db.query(inventorySql, [profileId], (error, items) => {
            if (error) {
                console.log("Database error while fetching inventory: ", error);
                return res.status(500).json({ error: "Database error" });
            }
            
            // const balanceSql = "SELECT balance FROM profile WHERE profileId = ?";
            // db.query(balanceSql, [profileId], (error, balanceResults) => {
            //     if (error) {
            //         console.log("Database error while fetching balance: ", error);
            //         return res.status(500).json({ error: "Database error" });
            //     }
            //     const balance = balanceResults[0].balance;
            //     return res.status(200).json({ items, balance });
            // });
        });
    })
})


module.exports = router;