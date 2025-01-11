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

TODO

## Contract Interactions

TODO

## License

This project is licensed under the MIT License - see the LICENSE file for details.