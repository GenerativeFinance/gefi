// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "./Ownable.sol";

/// @title KYCRegistry
/// @notice Allow-list of recipient addresses keyed by `expiresAt`. The
/// `RewardDistributor` reads this on every distribute(); the orchestrator
/// also mirrors the state into D1 for hot-path checks.
contract KYCRegistry is Ownable {
    /// @dev recipient → expiresAt unix seconds. 0 means revoked. Use a
    /// sentinel `type(uint64).max` to indicate "never expires".
    mapping(address => uint64) public expiresAt;

    event RecipientAdded(address indexed recipient, uint64 expiresAt);
    event RecipientRemoved(address indexed recipient);

    error ZeroRecipient();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function add(address recipient, uint64 expiresAt_) external onlyOwner {
        if (recipient == address(0)) revert ZeroRecipient();
        // Operator may supply `0` to mean "no expiry"; we map that to
        // the max sentinel so `isAllowed`'s ts check is uniform.
        uint64 v = expiresAt_ == 0 ? type(uint64).max : expiresAt_;
        expiresAt[recipient] = v;
        emit RecipientAdded(recipient, v);
    }

    function remove(address recipient) external onlyOwner {
        delete expiresAt[recipient];
        emit RecipientRemoved(recipient);
    }

    function isAllowed(address recipient) external view returns (bool) {
        uint64 v = expiresAt[recipient];
        return v != 0 && v >= uint64(block.timestamp);
    }
}
