const crypto = require("crypto");
const fs = require("fs");
const path = require("path");

function generateFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath);
  const hashSum = crypto.createHash("sha256");
  hashSum.update(fileBuffer);
  return hashSum.digest("hex");
}

// Export the function
module.exports = generateFileHash;

// Ejemplo de uso
const aesFilePath = path.join(__dirname, "..", "aesFiles", "23B.AES");
const hash = generateFileHash(aesFilePath);
console.log(`Hash for ${aesFilePath}:`, hash);
