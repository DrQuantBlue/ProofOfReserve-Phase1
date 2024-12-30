require("dotenv").config(); // Cargar variables de entorno desde .env
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const FormData = require("form-data");

const proofDataPath = path.join(__dirname, "..", "public", "proofData.json");
const filePath = path.join(__dirname, "..", "aesFiles", "23B.AES");

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

// Verificar que las claves de API estén configuradas
if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
  console.error("[ERROR] Pinata API keys are not set. Please check your .env file.");
  process.exit(1);
}

/**
 * Calcula el hash SHA-256 de un archivo.
 * @param {string} filePath - Ruta del archivo.
 * @returns {string} - Hash SHA-256 del archivo.
 */
function calculateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hash = crypto.createHash("sha256");
  hash.update(fileBuffer);
  return hash.digest("hex");
}

/**
 * Sube un archivo cifrado a Pinata y devuelve el CID.
 * @param {string} filePath - Ruta del archivo.
 * @returns {string} - CID del archivo en IPFS.
 */
async function uploadToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const fileStream = fs.createReadStream(filePath);

  const formData = new FormData();
  formData.append("file", fileStream);

  try {
    const response = await axios.post(url, formData, {
      headers: {
        ...formData.getHeaders(),
        pinata_api_key: PINATA_API_KEY,
        pinata_secret_api_key: PINATA_SECRET_KEY,
      },
    });
    return response.data.IpfsHash;
  } catch (error) {
    console.error("[ERROR] Failed to upload to Pinata:", error.response?.data || error.message);
    throw new Error("Failed to upload file to Pinata.");
  }
}

/**
 * Actualiza proofData.json con el hash del archivo.
 */
async function updateProofData() {
  try {
    // Calcular el hash del archivo cifrado
    const fileHash = calculateFileHash(filePath);
    console.log("[INFO] Calculated file hash:", fileHash);

    // Subir el archivo a Pinata
    const cid = await uploadToPinata(filePath);
    console.log("[INFO] File uploaded to IPFS with CID:", cid);

    // Leer y actualizar proofData.json
    const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));
    proofData.hashes.latestHash = fileHash;
    proofData.hashes.previousHashes.push(fileHash); // Almacenar el historial de hashes
    proofData.timestamp = new Date().toISOString(); // Actualizar el timestamp

    fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), "utf8");
    console.log("[SUCCESS] Updated proofData.json with latest hash.");
  } catch (error) {
    console.error("[ERROR] Failed to update proofData.json:", error.message);
  }
}

// Ejecutar la actualización
updateProofData().catch((err) => console.error("[ERROR] Unhandled error in updateProofData:", err.message));
