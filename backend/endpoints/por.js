const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const proofDataPath = path.join(__dirname, "../public", "proofData.json");

router.get("/", (req, res) => {
  try {
    const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));
    res.status(200).json(proofData);
  } catch (error) {
    res.status(500).json({ error: "Failed to retrieve proof data." });
  }
});

module.exports = router;
