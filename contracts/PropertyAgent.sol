// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract PropertyAgent {
    uint256 public immutable pripertyPrice;
    bool public isPurchased;

    event PropertyPurchased(address indexed sender);

    error InvalidPropertyPrice(uint256);
    error PropertyAlreadyPurchased();
    error IncorrectValue(uint256);

    constructor(uint256 price) {
        if (price == 0) {
            revert InvalidPropertyPrice(price);
        }

        pripertyPrice = price;
    }

    receive() external payable {
        if (isPurchased){
            revert PropertyAlreadyPurchased();
        }

        if (msg.value != pripertyPrice) {
            revert IncorrectValue(msg.value);
        }

        isPurchased = true;
        emit PropertyPurchased(msg.sender);
    }
}
