// Prueba con una dirección específica
getTokenBalances("0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045");

async function monitorBurnEvents() {
  contract.events.Transfer(
    { filter: { to: process.env.BURN_ADDRESS }, fromBlock: "latest" },
    async (error, event) => {
      if (error) {
        console.error("Error monitoreando eventos de quema:", error);
        return;
      }
      console.log("Evento de quema detectado:", event);

      // Actualiza proofData.json
      const currentReserve = await getTotalReserve();
      updateProofData(currentReserve);
    }
  );
}
