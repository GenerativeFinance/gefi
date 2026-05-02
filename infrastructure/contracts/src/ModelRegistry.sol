// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "./Ownable.sol";

/// @title ModelRegistry
/// @notice Records the artifact-hash commitment for every published model
/// version. Anyone can read the mapping; only the orchestrator's owner
/// (multi-sig) can write. The orchestrator-side mirror lives in D1
/// (`model_versions.chain_tx_hash` carries this contract's tx hash).
contract ModelRegistry is Ownable {
    /// @dev modelId → versionId → artifactSha256.
    mapping(bytes32 => mapping(bytes32 => bytes32)) public artifactByVersion;
    /// @dev modelId → currently-active versionId (empty until first setCurrent).
    mapping(bytes32 => bytes32) public currentVersion;

    event ModelRegistered(bytes32 indexed modelId, bytes32 indexed versionId, bytes32 artifactSha256);
    event CurrentVersionSet(bytes32 indexed modelId, bytes32 indexed versionId);

    error AlreadyRegistered();
    error UnknownVersion();

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Register a (modelId, versionId, artifactSha) tuple. Reverts
    /// if the same (modelId, versionId) was already committed — versions
    /// are immutable.
    function register(bytes32 modelId, bytes32 versionId, bytes32 artifactSha256) external onlyOwner {
        if (artifactByVersion[modelId][versionId] != bytes32(0)) revert AlreadyRegistered();
        artifactByVersion[modelId][versionId] = artifactSha256;
        emit ModelRegistered(modelId, versionId, artifactSha256);
    }

    /// @notice Move the `current` pointer for a model. Reverts if the
    /// version was never registered.
    function setCurrent(bytes32 modelId, bytes32 versionId) external onlyOwner {
        if (artifactByVersion[modelId][versionId] == bytes32(0)) revert UnknownVersion();
        currentVersion[modelId] = versionId;
        emit CurrentVersionSet(modelId, versionId);
    }
}
