import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proofDataPath = path.join(__dirname, "..", "proofData.json");

function updateBurnedTokens(amount) {
  const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));

  // Ajusta los tokens quemados y el balance de reservas
  proofData.burnedTokens += amount;
  proofData.totalReserve += amount;

  // Actualiza el timestamp
  proofData.timestamp = new Date().toISOString();

  // Guarda los cambios en el archivo
  fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), "utf8");
  console.log("proofData.json updated:", proofData);
}

// Ejemplo: Quema 5000 tokens
updateBurnedTokens(5000);
