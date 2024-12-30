const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");
const endpoints = require("./backend/endpoints"); // Import modular endpoints

dotenv.config(); // Load environment variables from .env

// Paths to relevant files
const proofDataPath = path.join(__dirname, "public", "proofData.json");
const aesFilePath = path.join(__dirname, "backend", "aesFiles", "23B.AES");
const apiKeys = require("./config/apiKeys.json");

const app = express();
app.use(express.json()); // Middleware to handle JSON

const PORT = process.env.PORT || 3001;

// Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token is required" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Functions to read and update proofData.json
function readProofData() {
  return JSON.parse(fs.readFileSync(proofDataPath, "utf8"));
}

function writeProofData(data) {
  fs.writeFileSync(proofDataPath, JSON.stringify(data, null, 2), "utf8");
}

// Import modular endpoints
app.use("/api", endpoints);

// Endpoint to access the file on IPFS using the CID (Protected)
app.get("/access/cid", authenticateToken, (req, res) => {
  const proofData = readProofData();
  if (!proofData.cid) {
    return res.status(404).json({ error: "CID not found in proof data." });
  }

  const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${proofData.cid}`;
  res.json({ message: "Access granted", hash: proofData.hashes.latestHash });
});

// Endpoint to upload a new file to IPFS (Protected)
app.post("/upload", authenticateToken, async (req, res) => {
  try {
    const { uploadToIPFS } = require("./backend/scripts/uploadToIPFS");
    const cid = await uploadToIPFS(aesFilePath);

    // Update proofData.json with the new CID
    const proofData = readProofData();
    proofData.cid = cid;
    proofData.timestamp = new Date().toISOString(); // Update the timestamp
    writeProofData(proofData);

    res.status(200).json({ message: "File uploaded to IPFS successfully.", hash: proofData.hashes.latestHash });
  } catch (err) {
    console.error("Error uploading file to IPFS:", err);
    res.status(500).json({ error: "Failed to upload file to IPFS." });
  }
});

// Endpoint to generate access tokens
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(403).json({ error: "Invalid credentials" });
  }
});

// Rate-limiting middleware
const limiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 100, // Restrict to 100 requests per minute
  message: "Request limit exceeded. Please try again later."
});
app.use(limiter);

// Health endpoint
app.get("/health", (req, res) => {
  const healthStatus = {
    status: "ok",
    timestamp: new Date().toISOString(),
    services: {
      alchemy: "ok",
      pinata: "ok"
    }
  };
  res.status(200).json(healthStatus);
});

// Middleware to verify API keys
app.use((req, res, next) => {
  const apiKey = req.headers["x-api-key"];
  if (!apiKey || !Object.values(apiKeys).includes(apiKey)) {
    return res.status(403).json({ error: "Invalid or missing API key" });
  }
  next();
});

// Start the server
app.listen(PORT, () => {
  console.log(`Proof of Reserve API running on http://localhost:${PORT}/api`);
});
