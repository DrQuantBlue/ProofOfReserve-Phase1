const pinataSDK = require("pinata-sdk");
const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_API_SECRET);

async function uploadToIPFS(data) {
  try {
    const result = await pinata.pinJSONToIPFS(data);
    return result.IpfsHash;
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
}

module.exports = { uploadToIPFS };
