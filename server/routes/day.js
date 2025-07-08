const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_DIR = path.join(__dirname, '../data');
const DAYS = ['monday','tuesday','wednesday','thursday','friday','saturday','sunday'];

// GET /api/day/:day
router.get('/:day', (req, res) => {
  const day = req.params.day.toLowerCase();
  if (!DAYS.includes(day)) {
    return res.status(400).json({ error: 'Invalid day' });
  }
  const filePath = path.join(DATA_DIR, `${day}.json`);
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Could not read file' });
    }
    try {
      res.json(JSON.parse(data));
    } catch (e) {
      res.status(500).json({ error: 'Invalid JSON format' });
    }
  });
});

// POST /api/day/:day
router.post('/:day', (req, res) => {
  const day = req.params.day.toLowerCase();
  if (!DAYS.includes(day)) {
    return res.status(400).json({ error: 'Invalid day' });
  }
  const filePath = path.join(DATA_DIR, `${day}.json`);
  const newData = req.body;
  fs.writeFile(filePath, JSON.stringify(newData, null, 2), err => {
    if (err) {
      return res.status(500).json({ error: 'Could not write file' });
    }
    res.json({ success: true });
  });
});

module.exports = router; 