import { task } from 'hardhat/config';
import { HardhatRuntimeEnvironment } from 'hardhat/types';

task('purchase', 'Purchases a property by sending ETH to the contract')
  .addParam('contract', 'Address of the PropertyAgent contract')
  .setAction(async (taskArgs, hre: HardhatRuntimeEnvironment) => {
    const { contract } = taskArgs;

    if (!hre.ethers.isAddress(contract)) {
      throw new Error('Invalid contract address');
    }

    console.log('Connecting to PropertyAgent contract at', contract);
    const PropertyAgent = await hre.ethers.getContractAt('PropertyAgent', contract);
    const propertyPrice = hre.ethers.parseEther('0.01');

    const [signer] = await hre.ethers.getSigners();

    const tx = await signer.sendTransaction({
      to: PropertyAgent.getAddress(),
      value: propertyPrice,
    });

    console.log(`Transaction sent: ${tx.hash}`);
    await tx.wait();
    console.log('Purchase completed!');
  });
