// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";

struct Log {
    uint256 index; // Index of the log in the block
    uint256 timestamp; // Timestamp of the block containing the log
    bytes32 txHash; // Hash of the transaction containing the log
    uint256 blockNumber; // Number of the block containing the log
    bytes32 blockHash; // Hash of the block containing the log
    address source; // Address of the contract that emitted the log
    bytes32[] topics; // Indexed topics of the log
    bytes data; // Data of the log
}

interface ILogAutomation {
    function checkLog(
        Log calldata log,
        bytes memory checkData
    ) external returns (bool upkeepNeeded, bytes memory performData);

    function performUpkeep(bytes calldata performData) external;
}

contract Minter is ILogAutomation, Ownable {
    address public forwarder;

    event MintedBy(address indexed sender);

    error InvalidAddress(address);
    error NotAllowed(address);

    constructor() {}

    modifier onlyForwarder public {
        if(msg.sender != forwarder)
            revert NotAllowed(msg.sender);
        _;
    }

    function setForwarder(address forwarderAddress) public onlyOwner {
        if (forwarderAddress == address(0)) {
            revert InvalidAddress(forwarderAddress);
        }
        forwarder = forwarderAddress;
    }

    function checkLog(
        Log calldata log,
        bytes memory
    ) external pure returns (bool upkeepNeeded, bytes memory performData) {
        upkeepNeeded = true;
        address logSender = address(uint160(uint256((log.topics[1]))));
        performData = abi.encode(logSender);
    }

    function performUpkeep(bytes calldata performData) external override onlyForwarder {
        address logSender = abi.decode(performData, (address));
        emit MintedBy(logSender);
    }
}
