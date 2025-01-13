import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

// This is a utility healthcheck to see if the upkeep is responding correctly
task('checkUpkeep', 'Checks if upkeep needed')
  .addParam('contract', 'Address of the Minter contract')
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { contract } = taskArgs;

    if (!hre.ethers.isAddress(contract)) {
      throw new Error('Invalid contract address');
    }

    const [signer] = await hre.ethers.getSigners();

    const mockBytes = hre.ethers.zeroPadValue('0xabcd', 32);
    const logUserAddress = hre.ethers.zeroPadValue(signer.address, 32);
    const logData = {
      index: 0,
      timestamp: 1705555555,
      txHash: mockBytes,
      blockNumber: 12345,
      blockHash: mockBytes,
      source: '0x1234567890123456789012345678901234567890',
      topics: [hre.ethers.id('PropertyPurchased(address)'), logUserAddress],
      data: mockBytes,
    };

    console.log('Connecting to Minter contract at', contract);
    const Minter = await hre.ethers.getContractAt('Minter', contract);
    try {
      let { upkeepNeeded, performData } = await Minter.checkLog(logData, mockBytes);
      console.log('Upkeep needed', upkeepNeeded);
      console.log('Perform Data', performData);
    } catch (e) {
      console.error(e);
    }
  });
