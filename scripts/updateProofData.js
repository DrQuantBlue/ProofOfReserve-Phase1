const fs = require('fs');
const path = require('path');
const generateFileHash = require('./generateHash');

const proofDataPath = path.join(__dirname, '..', 'proofData.json');
const aesFilePath = path.join(__dirname, '..', 'aesFiles', 'swift_certificate.aes');

function updateProofData() {
  const hash = generateFileHash(aesFilePath);
  const proofData = JSON.parse(fs.readFileSync(proofDataPath, 'utf8'));

  // Actualizar JSON con nuevo hash y timestamp
  proofData.hashes.swiftAES = hash;
  proofData.timestamp = new Date().toISOString();

  fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), 'utf8');
  console.log('proofData.json updated:', proofData);
}

updateProofData();

