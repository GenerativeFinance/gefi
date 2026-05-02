// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "./Ownable.sol";
import "./KYCRegistry.sol";

interface IERC20 {
    function transfer(address to, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

/// @title RewardDistributor
/// @notice Pays out federation contribution rewards from a pre-funded
/// ERC-20 balance. The contract holds the reward token (USDC on Base in
/// production); the orchestrator funds it out of band by sending tokens
/// to this address.
///
/// Every distribute() call:
///   1. Checks `KYCRegistry.isAllowed(recipient)`.
///   2. Transfers `amount` tokens to `recipient`.
///   3. Records the (roundId, recipient) pair so the same recipient
///      can't be paid twice for the same round.
///
/// The orchestrator-side mirror of these payouts lives in D1
/// (`reward_distributions`); this contract is the chain-side source of
/// truth for the auditor.
contract RewardDistributor is Ownable {
    IERC20 public immutable token;
    KYCRegistry public immutable kyc;

    /// @dev roundId → recipient → already paid.
    mapping(bytes32 => mapping(address => bool)) public paid;

    event RewardDistributed(bytes32 indexed roundId, address indexed recipient, uint256 amount);

    error NotAllowed();
    error AlreadyPaid();
    error TransferFailed();
    error InsufficientBalance();

    constructor(address initialOwner, IERC20 token_, KYCRegistry kyc_) Ownable(initialOwner) {
        token = token_;
        kyc = kyc_;
    }

    function distribute(address recipient, uint256 amount, bytes32 roundId) external onlyOwner {
        if (!kyc.isAllowed(recipient)) revert NotAllowed();
        if (paid[roundId][recipient]) revert AlreadyPaid();
        if (token.balanceOf(address(this)) < amount) revert InsufficientBalance();
        paid[roundId][recipient] = true;
        bool ok = token.transfer(recipient, amount);
        if (!ok) revert TransferFailed();
        emit RewardDistributed(roundId, recipient, amount);
    }
}
