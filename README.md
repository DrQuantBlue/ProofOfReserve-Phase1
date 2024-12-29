# Proof of Reserve (PoR) - Phase 1

## Project Overview
Proof of Reserve (PoR) is a comprehensive solution designed to ensure transparency and security in token issuance and burning processes. This system leverages decentralized technologies, including Chainlink, IPFS, and smart contracts, to maintain an auditable and publicly accessible record of reserves.

### Features
- Real-time monitoring of token burn events via Alchemy.
- Automated updates to the reserve balance (`totalReserve`) upon detecting burn events.
- Integration with IPFS (using Pinata) for publishing updated Proof of Reserve data.
- Secure handling of sensitive data through encryption (AES).
- Dockerized environment for ease of deployment.

---

## Project Structure
```plaintext
ProofOfReserve_Phase1/
│
├── aesFiles/                     # Encrypted sensitive files
│   └──certificate.aes
│
├── contracts/                    # Smart contracts
│   ├── contracts/
│   ├── migrations/
│   └── test/
│
├── scripts/                      # Utility scripts
│   ├── generateHash.js           # Generate hashes for files
│   ├── updateBurnedTokens.js     # Update burned token data
│   ├── updateIssuedTokens.js     # Update issued token data
│   ├── updateProofData.js        # Update proofData.json
│   └── uploadToIPFS.js           # Upload data to IPFS
│
├── services/                     # External service integrations
│   ├── alchemy.js                # Alchemy SDK integration
│   ├── pinata.js                 # Pinata SDK integration
│   └── chainlink.js              # Chainlink node integration
│
├── config/                       # Configuration files
│   ├── default.json              # General configuration
│   └── environments/             # Environment-specific configurations
│       ├── development.json
│       └── production.json
│
├── docker/                       # Docker-related files
│   ├── Dockerfile
│   ├── docker-compose.yml
│   └── deployment.yaml
│
├── public/                       # Publicly accessible files
│   └── proofData.json            # Current state of Proof of Reserve
│
├── .env                          # Environment variables
├── .gitignore                    # Files to ignore in Git
├── app.js                        # Main application entry point
├── package.json                  # Project dependencies
├── package-lock.json             # Dependency lockfile
└── README.md                     # Project documentation
```

---

## Installation and Setup

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
ALCHEMY_API_KEY=your_alchemy_api_key
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
BURN_ADDRESS=0xDIRECCION_DE_QUEMA
```

### Step 4: Build and Run with Docker
1. Build the Docker image:
```bash
docker build -t proof-of-reserve .
```
2. Run the container:
```bash
docker run -d -p 3000:3000 proof-of-reserve
```

---

## Usage

### Monitoring Burn Events
The system uses Alchemy to monitor real-time token burn events. Events are processed and automatically update the `proofData.json` file.

### Updating Proof of Reserve
Run the script to update the reserve after detecting a burn event:
```bash
node scripts/updateBurnedTokens.js
```

### Publishing Updated Data to IPFS
Upload the updated `proofData.json` to IPFS:
```bash
node scripts/uploadToIPFS.js
```

---

## Deployment
Use the provided `docker-compose.yml` for multi-container orchestration or `deployment.yaml` for Kubernetes setups.

---

## Contributing
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

## License
This project is licensed under the MIT License. See the LICENSE file for details.

---

## Acknowledgments
- [Alchemy](https://www.alchemy.com/)
- [Pinata](https://pinata.cloud/)
- [Chainlink](https://chain.link/)
