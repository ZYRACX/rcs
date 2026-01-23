const express = require('express');
const router = express.Router();

const db = require("../../connection");

// Get all items or search by name
router.get('/', (req, res) => {
  const search = req.query.q || '';
  const sql = "SELECT itemId, itemName, itemValue, isCraftable FROM items WHERE itemName LIKE ?";
  db.query(sql, [`%${search}%`], (err, results) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(results);
  });
});

// Add new item
router.post('/', (req, res) => {
  const { itemName, itemValue, isCraftable } = req.body;
  const sql = "INSERT INTO items (itemName, itemValue, isCraftable) VALUES (?, ?, ?)";
  db.query(sql, [itemName, itemValue, isCraftable ? 1 : 0], (err, result) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.status(201).json({ message: "Item added successfully", itemId: result.insertId });
  });
});

// Update item
router.put('/:itemId', (req, res) => {
  const { itemId } = req.params;
  const { itemName, itemValue, isCraftable } = req.body;
  const sql = "UPDATE items SET itemName = ?, itemValue = ?, isCraftable = ? WHERE itemId = ?";
  db.query(sql, [itemName, itemValue, isCraftable ? 1 : 0, itemId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Item updated successfully" });
  });
});

// Delete item
router.delete('/:itemId', (req, res) => {
  const { itemId } = req.params;
  const sql = "DELETE FROM items WHERE itemId = ?";
  db.query(sql, [itemId], (err) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json({ message: "Item deleted successfully" });
  });
});

module.exports = router;