const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config(); // Carga las variables de entorno desde .env

// Rutas a los archivos relevantes
const proofDataPath = path.join(__dirname, "services/public/proofData.json");
const aesFilePath = path.join(__dirname, "aesFiles", "23B.AES");

const app = express();
app.use(express.json()); // Middleware para manejar JSON

const PORT = process.env.PORT || 3001;

// Middleware de Autenticación
function authenticateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(403).json({ error: "Token required" });

  jwt.verify(token.split(" ")[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = user;
    next();
  });
}

// Función para leer y actualizar proofData.json
function readProofData() {
  return JSON.parse(fs.readFileSync(proofDataPath, "utf8"));
}

function writeProofData(data) {
  fs.writeFileSync(proofDataPath, JSON.stringify(data, null, 2), "utf8");
}

// Endpoint para acceder al estado actual de Proof of Reserve (Público)
app.get("/por", (req, res) => {
  const proofData = readProofData();
  const secureData = { ...proofData };
  delete secureData.cid; // Elimina el CID sin asignarlo a una variable
  res.json(secureData);
});



// Endpoint para acceder al archivo en IPFS usando el CID (Protegido)
app.get("/access/cid", authenticateToken, (req, res) => {
  const proofData = readProofData();
  if (!proofData.cid) {
    return res.status(404).json({ error: "CID not found in proof data." });
  }

  const ipfsGateway = `https://gateway.pinata.cloud/ipfs/${proofData.cid}`;
  res.json({ message: "Access granted", url: ipfsGateway });
});

// Endpoint para subir un archivo nuevo a IPFS (Protegido)
app.post("/upload", authenticateToken, async (req, res) => {
  try {
    // Lógica para subir el archivo a IPFS
    const { uploadToIPFS } = require("./scripts/uploadToIPFS");
    const cid = await uploadToIPFS(aesFilePath);

    // Actualiza proofData.json con el nuevo CID
    const proofData = readProofData();
    proofData.cid = cid;
    proofData.timestamp = new Date().toISOString(); // Actualiza el timestamp
    writeProofData(proofData);

    res.status(200).json({ message: "File uploaded to IPFS successfully.", cid });
  } catch (err) {
    console.error("Error uploading file to IPFS:", err);
    res.status(500).json({ error: "Failed to upload file to IPFS." });
  }
});

// Endpoint para generar tokens de acceso
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } else {
    res.status(403).json({ error: "Invalid credentials" });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Proof of Reserve API running on http://localhost:${PORT}/por`);
});
