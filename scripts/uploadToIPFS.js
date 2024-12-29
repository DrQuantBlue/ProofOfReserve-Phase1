import fs from "fs";
import path from "path";
import axios from "axios"; 

const PINATA_API_KEY = process.env.PINATA_API_KEY;
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY;

const proofDataPath = path.join(__dirname, "..", "public", "proofData.json");

async function uploadToPinata(filePath) {
  const url = "https://api.pinata.cloud/pinning/pinFileToIPFS";
  const fileStream = fs.createReadStream(filePath);

  const headers = {
    pinata_api_key: PINATA_API_KEY,
    pinata_secret_api_key: PINATA_SECRET_KEY,
  };

  const data = new FormData();
  data.append("file", fileStream);

  try {
    const response = await axios.post(url, data, { headers });
    return response.data.IpfsHash; // Este es el CID generado por Pinata
  } catch (error) {
    console.error("Error uploading to Pinata:", error.message);
    throw error;
  }
}

async function updateProofData() {
  const filePath = path.join(__dirname, "..", "aesFiles", "23B.AES");
  const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));

  try {
    const cid = await uploadToPinata(filePath);
    proofData.cid = cid;
    proofData.timestamp = new Date().toISOString();

    fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), "utf8");
    console.log("Updated proofData.json with CID:", cid);
  } catch (error) {
    console.error("Failed to update proofData.json:", error);
  }
}

updateProofData().catch((err) => console.error("Error in updateProofData:", err));
