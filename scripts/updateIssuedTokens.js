import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proofDataPath = path.join(__dirname, '..', 'proofData.json');

function updateIssuedTokens(amount) {
  const proofData = JSON.parse(fs.readFileSync(proofDataPath, 'utf8'));

  // Ajusta los tokens emitidos y la reserva total
  proofData.issuedTokens += amount;
  proofData.totalReserve -= amount;

  // Asegúrate de que la reserva no sea negativa
  if (proofData.totalReserve < 0) {
    throw new Error("Insufficient reserve to issue tokens.");
  }

  // Actualiza el timestamp
  proofData.timestamp = new Date().toISOString();

  // Guarda los cambios en el archivo
  fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), 'utf8');
  console.log('proofData.json updated:', proofData);
}

// Ejemplo: Emite 10000 tokens
updateIssuedTokens(10000);
