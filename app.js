const express = require('express');
const fs = require('fs');
const proofData = require('./proofData.json'); // Archivo JSON para los datos PoR

const app = express();
const PORT = process.env.PORT || 3000;

// Endpoint principal para Proof of Reserve
app.get('/por', (req, res) => {
  res.json(proofData); // Devuelve el contenido de proofData.json
});

app.listen(PORT, () => {
  console.log(`Proof of Reserve API running on http://localhost:${PORT}/por`);
});
