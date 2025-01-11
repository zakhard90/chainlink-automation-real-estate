// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

contract PropertyAgent is Ownable {
    uint256 public immutable propertyPrice;
    bool public isPurchased;

    event PropertyPurchased(address indexed sender);
    event WithdrawalMade(address owner, uint256 amount);

    error InvalidPropertyPrice(uint256);
    error PropertyAlreadyPurchased();
    error IncorrectValue(uint256);

    constructor(uint256 price) Ownable(msg.sender) {
        if (price == 0) {
            revert InvalidPropertyPrice(price);
        }

        propertyPrice = price;
    }

    receive() external payable {
        if (isPurchased){
            revert PropertyAlreadyPurchased();
        }

        if (msg.value != propertyPrice) {
            revert IncorrectValue(msg.value);
        }

        isPurchased = true;
        emit PropertyPurchased(msg.sender);
    }
    
    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        address ownerAddress = owner();
        payable(ownerAddress).transfer(balance);
        emit WithdrawalMade(ownerAddress, balance);
    }
}
