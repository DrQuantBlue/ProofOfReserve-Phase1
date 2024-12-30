# Proof of Reserve (PoR) - Phase 1

## 🌟 Project Overview
Proof of Reserve (PoR) is a professional-grade solution ensuring transparency and security in token issuance and burn events. Designed to integrate seamlessly with Chainlink oracles, it enables verifiable reserves without exposing sensitive data. PoR leverages decentralized technologies such as Chainlink, IPFS, and Alchemy to maintain auditable reserves.

---

### 🔑 Features
- **Real-time Monitoring**: Tracks token burn events via Alchemy.
- **Proof of Reserve Updates**: Automatically updates reserve data (`totalReserve`).
- **Hash-based Proofs**: Only file hashes are stored and shared, ensuring security.
- **Chainlink Compatibility**: Provides structured JSON data tailored for oracles.
- **Secure & Modular**: Built with JWT authentication, rate limiting, and a scalable architecture.
- **Extensive Documentation**: Aligned with TOGAF methodology to ensure clarity.

---

## 🗂 Project Structure
```plaintext
ProofOfReserve_Phase1/
│
├── backend/                      # API backend and endpoints
│   ├── endpoints/                # RESTful API endpoints
│   │   ├── index.js              # Main router
│   │   ├── por.js                # Proof of Reserve endpoint
│   │   └── upload.js             # File upload endpoint
│   └── scripts/                  # Utility scripts
│       ├── updateProofData.js    # Updates proofData.json
│       └── uploadToIPFS.js       # Uploads hashed proof to IPFS
│
├── config/                       # Configuration files
├── public/                       # Publicly accessible files
│   └── proofData.json            # Proof of Reserve JSON file
│
├── services/                     # External service integrations
│   ├── alchemy.js                # Alchemy integration for token burn events
│   ├── chainlink.js              # Chainlink integration
│   └── pinata.js                 # Pinata IPFS integration
├── .env                          # Environment variables
├── .gitignore                    # Files to ignore in Git
├── app.js                        # Main application entry point
└── README.md                     # Project documentation
```

---

## ⚙️ Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (version 18 or higher)
- [Docker](https://www.docker.com/) and Docker Compose
- Alchemy API Key
- Pinata API Key and Secret Key

### Step 1: Clone the Repository
```bash
git clone https://github.com/DrQuantBlue/ProofOfReserve-Phase1.git
cd ProofOfReserve-Phase1
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Set Up Environment Variables
Create a `.env` file in the root directory with the following:
```env
PORT=3001
JWT_SECRET=your_jwt_secret
ADMIN_USER=your_admin_user
ADMIN_PASS=your_admin_password
ALCHEMY_API_KEY=your_alchemy_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
```

### Step 4: Build and Run with Docker
1. Build the Docker image:
```bash
docker build -t proof-of-reserve .
```
2. Run the container:
```bash
docker run -d -p 3001:3001 proof-of-reserve
```

---

## 🚀 Usage

### Monitoring Burn Events
The system uses Alchemy to monitor real-time token burn events. Events are processed and automatically update the `proofData.json` file.

### Updating Proof of Reserve
Run the script to update the reserve after detecting a burn event:
```bash
node backend/scripts/updateProofData.js
```

### Publishing Updated Data to IPFS
Upload the updated `proofData.json` to IPFS:
```bash
node backend/scripts/uploadToIPFS.js
```

---

## 📡 API Endpoints

### 🔐 Authentication
#### POST `/login`
Generate an access token for secure API interactions.
- **Body:**
  ```json
  {
    "username": "admin",
    "password": "securepassword"
  }
  ```
- **Response:**
  ```json
  {
    "token": "<JWT_TOKEN>"
  }
  ```

### 📊 Get Proof Data
#### GET `/por`
Retrieve the current proof of reserve data.
- **Headers:**
  - Authorization: Bearer `<JWT_TOKEN>`
- **Response:**
  ```json
  {
    "accountName": "ONEB",
    "totalReserve": 229965000,
    "timestamp": "2024-12-30T05:42:25.881Z",
    "ripcord": false,
    "ripcordDetails": []
  }
  ```

### 🔄 Upload to IPFS
#### POST `/upload`
Upload the encrypted AES file to IPFS and update `proofData.json`.
- **Headers:**
  - Authorization: Bearer `<JWT_TOKEN>`
- **Response:**
  ```json
  {
    "message": "File uploaded to IPFS successfully.",
    "hash": "<HASH>"
  }
  ```

---

## 📦 Deployment
Use the provided `docker-compose.yml` for multi-container orchestration or `deployment.yaml` for Kubernetes setups.

---

## 🤝 Contributing
1. Fork the repository.
2. Create your feature branch:
```bash
git checkout -b feature/your-feature-name
```
3. Commit your changes:
```bash
git commit -m "Add some feature"
```
4. Push to the branch:
```bash
git push origin feature/your-feature-name
```
5. Open a pull request.

---

## 🔐 Security Considerations
- Ensure `.env` is never uploaded to public repositories.
- Use strong credentials for `ADMIN_USER` and `ADMIN_PASS`.
- Regularly audit dependencies for vulnerabilities.
- Limit CID access only to trusted entities.

---

## 🔗 Chainlink Integration
This API is fully compatible with Chainlink oracles and adheres to their requirements. The `/por` endpoint provides:
- **Account Name (`accountName`)**: A unique identifier for the tracked reserve.
- **Total Reserve (`totalReserve`)**: The current aggregated reserve amount.
- **Timestamp (`timestamp`)**: The last update time in ISO8601 format.
- **Ripcord Details (`ripcord`)**: A flag indicating anomalies (if any).

### Example Scenario
Chainlink nodes can securely query this endpoint for off-chain validation of reserves. For instance:
1. A Chainlink node sends a GET request to the `/por` endpoint.
2. The server responds with:
   ```json
   {
     "accountName": "ONEB",
     "totalReserve": 100000000,
     "timestamp": "2024-12-30T15:00:00.000Z",
     "ripcord": false
   }
   ```
3. The Chainlink oracle processes this data and provides the proof to its smart contract for further validation.
4. Structured JSON allows seamless integration with Chainlink, ensuring real-time visibility of reserve status.

---

## 🙌 Acknowledgments
- [Alchemy](https://www.alchemy.com/)
- [Pinata](https://pinata.cloud/)
- [Chainlink](https://chain.link/)

---

## 🌍 Architecture Diagram

### **📈 Data Flow**
1. **Monitoring**: Captures blockchain events via Alchemy.
2. **Processing**: Updates `proofData.json` and generates a hash.
3. **Publication**: Uploads data to IPFS through Pinata.
4. **Consumption**: Exposes JSON data for Chainlink integration.

```xml
<diagram>
  <node id="monitoring" label="Monitoring">
    <description>Capture blockchain events via Alchemy</description>
    <link target="processing" />
  </node>
  <node id="processing" label="Processing">
    <description>Update proofData.json & Generate Hash</description>
    <link target="publication" />
  </node>
  <node id="publication" label="Publication">
    <description>Upload data to IPFS</description>
    <link target="consumption" />
  </node>
  <node id="consumption" label="Consumption">
    <description>Provide JSON data for Chainlink</description>
  </node>
</diagram>
```

---
