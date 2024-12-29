import axios from "axios";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const PINATA_BASE_URL = "https://api.pinata.cloud";

async function uploadToIPFS(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath);

    const response = await axios.post(`${PINATA_BASE_URL}/pinning/pinFileToIPFS`, fileStream, {
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
      headers: {
        "Content-Type": `multipart/form-data`,
        Authorization: `Bearer ${process.env.PINATA_JWT}`,
      },
    });

    console.log("IPFS Hash:", response.data.IpfsHash);
    return response.data.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw error;
  }
}

// Prueba con un archivo específico
uploadToIPFS("./aesFiles/23B.AES");
