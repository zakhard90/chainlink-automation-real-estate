import { ethers } from 'hardhat';

async function main() {
  console.log('Deploying RealEstateNft contract...');
  const RealEstateNftFactory = await ethers.getContractFactory('RealEstateNft');
  const RealEstateNft = await RealEstateNftFactory.deploy();
  await RealEstateNft.waitForDeployment();
  const realEstateNftAddress = await RealEstateNft.getAddress();
  console.log('RealEstateNft deployed to:', realEstateNftAddress);

  // Wait a few block confirmations to ensure deployment
  await RealEstateNft.deploymentTransaction()?.wait(5);

  console.log('Deploying Minter contract...');
  const MinterFactory = await ethers.getContractFactory('Minter');
  const Minter = await MinterFactory.deploy(realEstateNftAddress);
  await Minter.waitForDeployment();
  const minterAddress = await Minter.getAddress();
  console.log('Minter deployed to:', minterAddress);

  // Wait for deployment confirmation
  await Minter.deploymentTransaction()?.wait(3);

  await RealEstateNft.setMinter(minterAddress);
  console.log('Minter account address set on RealEstateNft:', minterAddress);

  // Wait for setMinter confirmation
  await Minter.deploymentTransaction()?.wait(1);

  console.log('Deploying PropertyAgent contract...');
  const PropertyAgentFactory = await ethers.getContractFactory('PropertyAgent');
  const propertyPrice = ethers.parseEther('0.01');
  const PropertyAgent = await PropertyAgentFactory.deploy(propertyPrice);
  await PropertyAgent.waitForDeployment();
  const propertyAgentAddress = await PropertyAgent.getAddress();
  console.log('PropertyAgent deployed to:', propertyAgentAddress);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
