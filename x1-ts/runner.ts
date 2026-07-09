import { WarehouseServer } from "./warehouse_server";

async function main() {
  // Initialize WarehouseServer instance.
  const warehouseServer = new WarehouseServer();
  await warehouseServer.initializeServer('warehouse_pings.csv');

  console.log('\n');
  console.log('~~~WarehouseServer is initialized.');
  console.log('\n');

  console.log('Average Speeds: ', warehouseServer.getAverageSpeeds());
  console.log('\n');

  console.log('The 3 most traveled vehicles since 1553273158 are: ',
      warehouseServer.getMostTraveledSince(3, 1553273158));
  console.log('\n');

  console.log('Vehicles possibly damaged: ', warehouseServer.checkForDamage());
  console.log('\n');

  // Feel free to put any println statements below for testing and debugging
}

main();
