// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstateNft is ERC721, Ownable {
    address public minter;
    uint256 private _nextId = 1;

    error InvalidAddress(address);
    error NotAllowed(address);

    constructor() ERC721("RealEstateNft", "REN") Ownable(msg.sender) {}

    modifier onlyMinter public {
        if(msg.sender != minter)
            revert NotAllowed(msg.sender);
        _;
    }

    function setForwarder(address forwarder)

    function setMinter(address minterAddress) public onlyOwner {
        if(minterAddress == address(0)){
           revert InvalidAddress(minterAdress);
        }
        _minter = minterAddress;
    }

    function safeMint(address to) public onlyMinter {
        _safeMint(to, _nextId);
        _nextId++;
    }
}
