const fs = require("fs");
const path = require("path");

const proofDataPath = path.join(__dirname, "..", "public", "proofData.json");

function adjustReserves(action, amount) {
  try {
    const proofData = JSON.parse(fs.readFileSync(proofDataPath, "utf8"));

    if (action === "mint") {
      proofData.totalReserve += amount; // Aumenta las reservas
      proofData.issuedTokens += amount;
    } else if (action === "burn") {
      if (proofData.totalReserve < amount) {
        throw new Error("Insufficient reserve to burn the requested amount.");
      }
      proofData.totalReserve -= amount; // Disminuye las reservas
      proofData.burnedTokens = (proofData.burnedTokens || 0) + amount;
    } else {
      throw new Error("Invalid action. Use 'mint' or 'burn'.");
    }

    proofData.timestamp = new Date().toISOString(); // Actualiza el timestamp

    fs.writeFileSync(proofDataPath, JSON.stringify(proofData, null, 2), "utf8");
    console.log(`[INFO] Reserves updated successfully: Action=${action}, Amount=${amount}`);
  } catch (error) {
    console.error(`[ERROR] Failed to update reserves: ${error.message}`);
    throw error;
  }
}

module.exports = { adjustReserves };
