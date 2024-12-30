const express = require("express");
const { updateAndUploadToIPFS } = require("../scripts/uploadToIPFS");
const router = express.Router();

router.post("/", async (req, res) => {
  const { action, amount } = req.body; // Espera recibir estas variables en la solicitud

  try {
    await updateAndUploadToIPFS(action, amount);
    res.status(200).json({ message: "Upload and update successful." });
  } catch (error) {
    res.status(500).json({ error: "Failed to upload and update.", details: error.message });
  }
});

module.exports = router;

module.exports = router;
