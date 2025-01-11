# Real Estate NFT Platform
A PoC project leveraging Chainlink Automation functionality in a decentralized platform for tokenizing and managing real estate properties using NFTs. The system consists of three main smart contracts that work together to enable property tokenization, automated minting, and secure purchases.

## Overview

The platform enables:
- Tokenization of real estate properties as NFTs
- Automated minting through Chainlink Automation
- Secure property purchases with ETH
- Role-based access control for minting and automation

### Core Contracts

1. `RealEstateNft.sol`: ERC721 implementation for property tokenization
   - Controlled minting through designated minter role
   - Ownership management
   - Token metadata handling

2. `Minter.sol`: Chainlink Automation handler for automated minting
   - Processes on-chain events through Log Automation
   - Manages automation permissions
   - Controls minting authorization

3. `PropertyAgent.sol`: Handles property purchases
   - Secure ETH payment processing
   - Ownership tracking
   - Withdrawal management

## Installation

Install project dependencies:
```bash
npm install
```

Configure the `.env` file:

### Testing
Run the tests:
```bash
npx hardhat test
```

### Deployment

## Setup and Deployment

1. Deploy RealEstateNft contract.
2. Deploy Minter contract with:
   - RealEstateNft contract address as constructor argument
3. Deploy PropertyAgent contract with:
   - Property price in wei as constructor argument
4. Configure Chainlink Automation
5. Set the forwarder on the Minter contract

To deploy the contracts, configure the `.env` file and run:

```bash
npx hardhat clean
npx hardhat compile
npx hardhat run scripts/deploy.ts --network sepolia
```
In case you want to verify the contracts on Etherscan, add the ETHERSCAN_API_KEY to the .env file and run:

```bash
npx hardhat verify --network sepolia --contract contracts/RealEstateNft.sol:RealEstateNft <DEPLOYED_CONTRACT_ADDRESS>
```

```bash
npx hardhat verify --network sepolia --contract contracts/Minter.sol:Minter <DEPLOYED_CONTRACT_ADDRESS> <CONSTRUCTOR_ARG_1>
```

```bash
npx hardhat verify --network sepolia --contract contracts/PropertyAgent.sol:PropertyAgent <DEPLOYED_CONTRACT_ADDRESS> <CONSTRUCTOR_ARG_1>
```

## Contract Interactions

After deploying and verifying all of the contracts, register a new Upkeep on the [Chainlink Automation](https://automation.chain.link/) panel.

Follow the instrutions to configure the upkeep. Make sure to select Log Automation. Once done and the upkeep funded with LINK tokens, copy the Forwarder address and use it to set the forwarder on the `Minter` contract. To do so head to the verified contract on Sepolia Etherscan, connect the owner wallet and use the Write Contract tab to call the `setForwarder` function.

Finally, to trigger the Log Automation, call the `purchase` task:

```
npx hardhat purchase --contract <PROPERTY_AGENT_ADDRESS> --network sepolia
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.