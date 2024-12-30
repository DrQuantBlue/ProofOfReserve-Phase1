import { Alchemy, Network } from "alchemy-sdk";
import dotenv from "dotenv";

dotenv.config();

const alchemy = new Alchemy({
  apiKey: process.env.ALCHEMY_API_KEY,
  network: Network.MATIC_MAINNET,
});

async function getTokenBalances(address) {
  try {
    const response = await alchemy.core.getTokenBalances(address);
    console.log("Token Balances:", response);
  } catch (error) {
    console.error("Error fetching token balances:", error);
  }
}