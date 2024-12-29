import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import generateFileHash from "./generateHash.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const proofDataPath = path.join(__dirname, "..", "proofData.json");
const aesFilePath = path.join(__dirname, "..", "aesFiles", "swift_certificate.aes");

async function updateProofData() {
  const hash = generateFileHash(aesFilePath);

  // CID ya generado
  const cid = {};

  const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));

  // Actualiza el JSON con hash, CID y timestamp
  proofData.hashes.swiftAES = hash;
  proofData.cid = cid;
  proofData.timestamp = new Date().toISOString();

  fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), "utf8");
  console.log("proofData.json updated:", proofData);
}

updateProofData().catch((err) =>
  console.error("Error updating proof data:", err)
);

