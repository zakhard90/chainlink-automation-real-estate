// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract RealEstateNft is ERC721, Ownable {

    uint256 private _nextId = 1;
    address private _minter;

    error InvalidAddress(address);
    error NotAllowedToMint(address);

    constructor() ERC721("RealEstateNft", "REN") Ownable(msg.sender) {}

    modifier onlyMinter public {
        if(msg.sender != _minter)
            revert NotAllowedToMint(msg.sender);
        _;
    }

    function setMinter(address minter) public onlyOwner {
        if(minter == address(0))
            revert InvalidAddress(minter);
    }

    function safeMint(address to) public onlyMinter {
        _safeMint(to, _nextId);
        _nextId++;
    }
}
