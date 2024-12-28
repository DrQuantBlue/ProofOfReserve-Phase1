const express = require('express');
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config(); // Carga las variables de entorno desde .env

// Archivo JSON para los datos PoR
const proofDataPath = path.join(__dirname, './proofData.json');

// Funciones auxiliares para manejar proofData.json
function readProofData() {
  return JSON.parse(fs.readFileSync(proofDataPath, 'utf8'));
}

function writeProofData(data) {
  fs.writeFileSync(proofDataPath, JSON.stringify(data, null, 2), 'utf8');
}

const app = express();
app.use(express.json()); // Middleware para manejar JSON

const PORT = process.env.PORT || 3000;

// Middleware de Autenticación
function authenticateToken(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) return res.status(403).json({ error: 'Token required' });

  jwt.verify(token.split(' ')[1], process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token' });
    req.user = user;
    next();
  });
}

// Ruta para generar un token de acceso
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Validación básica (reemplaza con tu propia lógica de autenticación)
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '1h' });
    res.json({ token });
  } else {
    res.status(403).json({ error: 'Invalid credentials' });
  }
});

// Endpoint principal para Proof of Reserve
app.get('/por', (req, res) => {
  const proofData = readProofData();
  res.json(proofData); // Devuelve el contenido de proofData.json
});

// Endpoint para emitir tokens (protegido)
app.post('/issue-tokens', authenticateToken, (req, res) => {
  const { amount } = req.body;
  try {
    const proofData = readProofData();
    proofData.issuedTokens += amount;
    proofData.totalReserve -= amount;

    if (proofData.totalReserve < 0) {
      throw new Error('Insufficient reserve to issue tokens.');
    }

    proofData.timestamp = new Date().toISOString(); // Actualiza el timestamp
    writeProofData(proofData);

    res.status(200).json({ message: 'Tokens issued successfully.', proofData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Endpoint para quemar tokens (protegido)
app.post('/burn-tokens', authenticateToken, (req, res) => {
  const { amount } = req.body;
  try {
    const proofData = readProofData();
    proofData.burnedTokens = (proofData.burnedTokens || 0) + amount;
    proofData.totalReserve += amount;

    proofData.timestamp = new Date().toISOString(); // Actualiza el timestamp
    writeProofData(proofData);

    res.status(200).json({ message: 'Tokens burned successfully.', proofData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Proof of Reserve API running on http://localhost:${PORT}/por`);
});
