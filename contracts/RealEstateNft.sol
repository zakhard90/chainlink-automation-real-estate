// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "./interfaces/IMintableNft.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstateNft is ERC721, IMintableNft, Ownable {
    address public minter;
    uint256 private _nextId = 1;

    event MinterUpdated(address indexed oldAddress, address indexed newAddress);

    error InvalidAddress(address);
    error NotAllowed(address);

    constructor() ERC721("RealEstateNft", "REN") Ownable(msg.sender) {}

    modifier onlyMinter() {
        if (msg.sender != minter) revert NotAllowed(msg.sender);
        _;
    }

    function setMinter(address minterAddress) external onlyOwner {
        if (minterAddress == address(0)) {
            revert InvalidAddress(minterAddress);
        }
        emit MinterUpdated(minter, minterAddress);
        minter = minterAddress;
    }

    function safeMint(address to) external override onlyMinter {
        _safeMint(to, _nextId);
        _nextId++;
    }
}
