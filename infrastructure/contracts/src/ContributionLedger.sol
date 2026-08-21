// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "./Ownable.sol";

/// @title ContributionLedger
/// @notice Per-round commitment of `(aggregateSha256, contributionsRoot)`.
/// The orchestrator publishes one row per closed federation round so
/// participants can later prove their TMC-Shapley score against a
/// Merkle proof rooted at `contributionsRoot`.
contract ContributionLedger is Ownable {
    struct Commit {
        bytes32 modelId;
        bytes32 aggregateSha256;
        bytes32 contributionsRoot;
        uint64 committedAt;
    }

    mapping(bytes32 => Commit) public commitsByRound;

    event RoundCommitted(
        bytes32 indexed roundId,
        bytes32 indexed modelId,
        bytes32 aggregateSha256,
        bytes32 contributionsRoot,
        uint64 committedAt
    );

    error AlreadyCommitted();

    constructor(address initialOwner) Ownable(initialOwner) {}

    function commit(
        bytes32 roundId,
        bytes32 modelId,
        bytes32 aggregateSha256,
        bytes32 contributionsRoot
    ) external onlyOwner {
        if (commitsByRound[roundId].committedAt != 0) revert AlreadyCommitted();
        Commit memory c = Commit({
            modelId: modelId,
            aggregateSha256: aggregateSha256,
            contributionsRoot: contributionsRoot,
            committedAt: uint64(block.timestamp)
        });
        commitsByRound[roundId] = c;
        emit RoundCommitted(roundId, modelId, aggregateSha256, contributionsRoot, c.committedAt);
    }
}
