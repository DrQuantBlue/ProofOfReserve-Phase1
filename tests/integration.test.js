import { expect } from "chai";
import { Alchemy } from "alchemy-sdk";
import dotenv from "dotenv";
import axios from "axios";
import fs from "fs";

dotenv.config();

describe("Integration Tests", function () {
  it("Should fetch token balances from Alchemy", async function () {
    const alchemy = new Alchemy({
      apiKey: process.env.ALCHEMY_API_KEY,
      network: "MATIC_MAINNET",
    });

    const balances = await alchemy.core.getTokenBalances(process.env.SMART_CONTRACT_ADDRESS);
    expect(balances).to.be.an("object");
    console.log("Balances:", balances);
  });

  it("Should upload a file to Pinata", async function () {
    const filePath = "./aesFiles/23B.AES";
    const fileStream = fs.createReadStream(filePath);

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      fileStream,
      {
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
        headers: {
          Authorization: `Bearer ${process.env.PINATA_JWT}`,
        },
      }
    );

    expect(response.data).to.have.property("IpfsHash");
    console.log("Uploaded IPFS Hash:", response.data.IpfsHash);
  });
});
