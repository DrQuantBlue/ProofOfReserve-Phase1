import fs from 'fs';
import pinataSDK from '@pinata/sdk';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde .env

const pinata = pinataSDK(process.env.PINATA_API_KEY, process.env.PINATA_SECRET_API_KEY);

async function uploadToIPFS(filePath) {
  try {
    const readableStreamForFile = fs.createReadStream(filePath);
    const options = {
      pinataMetadata: {
        name: 'ProofOfReserve_AES_File',
        keyvalues: {
          project: 'ProofOfReserve',
          fileType: 'AES',
        },
      },
      pinataOptions: {
        cidVersion: 1,
      },
    };

    console.log('Uploading file to IPFS...');
    const result = await pinata.pinFileToIPFS(readableStreamForFile, options);
    console.log('File successfully uploaded to IPFS. CID:', result.IpfsHash);
    return result.IpfsHash;
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}

export default uploadToIPFS;
