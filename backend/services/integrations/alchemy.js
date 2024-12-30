const { ethers } = require("ethers");

async function getContractData() {
  const provider = new ethers.JsonRpcProvider(process.env.ALCHEMY_ENDPOINT);
  const abi = [
    "function totalSupply() view returns (uint256)",
    "function burnedTokens() view returns (uint256)"
  ];
  const contract = new ethers.Contract(process.env.SMART_CONTRACT_ADDRESS, abi, provider);

  const issuedTokens = await contract.totalSupply();
  const burnedTokens = await contract.burnedTokens();

  return {
    issuedTokens: issuedTokens.toString(),
    burnedTokens: burnedTokens.toString()
  };
}

module.exports = { getContractData };
