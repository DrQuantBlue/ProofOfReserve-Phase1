Proof of Reserve - Phase 1
Overview
This project implements a basic Proof of Reserve (PoR) system to expose hash data of encrypted files via a JSON endpoint. This serves as the foundation for verifying reserves dynamically and can be extended for blockchain integration and decentralized storage.

Project Structure
graphql
Copiar código
ProofOfReserve-Phase1/
├── package.json          # Project dependencies
├── app.js                # Main API server
├── aesFiles/             # Encrypted files (AES, PDF, etc.)
├── scripts/              # Auxiliary scripts
│   ├── generateHash.js
│   ├── updateProofData.js
├── proofData.json        # JSON file with PoR data
└── README.md             # Documentation


Getting Started
1. Install Dependencies
Make sure Node.js and npm are installed. Run the following command in the project directory:

bash
Copiar código
npm install
2. Generate File Hashes
Place your encrypted files in the aesFiles/ folder. Then, execute the hash generation script:

bash
Copiar código
node scripts/generateHash.js
This will generate a SHA-256 hash for the specified file.

3. Update PoR JSON Data
Update the proofData.json file with the new hash and timestamp using the following script:

bash
Copiar código
node scripts/updateProofData.js
The script will automatically read the file, generate its hash, and update the PoR JSON.

4. Start the API Server
Launch the Express server to expose the PoR data via a JSON endpoint:


node app.js
The server will run on the default port 3000. Access the PoR data at:



http://localhost:3000/por
Example PoR JSON Output
The API will respond with a JSON similar to the following:

json
Copiar código
{
  "accountName": "ONEB",
  "totalReserve": 1000000,
  "timestamp": "2024-12-28T12:00:00Z",
  "ripcord": false,
  "ripcordDetails": [],
  "hashes": {
    "swiftAES": "4522c9d91545bd154e331bd7a957e27c3c5dbe493ce02467dfc2f735f68fc913"
  }
}


accountName: The token or reserve identifier (e.g., "ONEB").
totalReserve: The total reserve value in USD or tokens.
timestamp: The ISO8601/RFC3339 timestamp of the PoR data.
ripcord: Boolean indicating if there are anomalies.
ripcordDetails: Array with anomaly details (if any).
hashes: Object containing the SHA-256 hash of the encrypted files.


Next Steps:

Integrate IPFS: Upload the files to decentralized storage and return the CID (Content Identifier).

Register PoR Data on Blockchain: Use Ethereum, Polygon, or another chain to ensure immutability.

Automate Hash Updates: Schedule periodic updates to the proofData.json file.

Add Unit Tests: Implement automated testing for the scripts and API.

Extend API Features:

Add endpoints for uploading files dynamically.
Include real-time validation.
Contributing
Contributions are welcome! Please submit issues or pull requests via the GitHub repository.

License
This project is licensed under the ISC License.

Author: Blue Reserve Team
Date: 2024-12-28

