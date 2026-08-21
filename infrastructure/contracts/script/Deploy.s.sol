// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/ModelRegistry.sol";
import "../src/ContributionLedger.sol";
import "../src/KYCRegistry.sol";
import "../src/RewardDistributor.sol";

/// @notice Deploy the four federation contracts to Base.
/// Reads `ADMIN` (multi-sig) and `REWARD_TOKEN` (USDC on Base) from the
/// shell environment. Run with:
///
///   forge script script/Deploy.s.sol \
///     --rpc-url $BASE_RPC_URL \
///     --private-key $DEPLOY_KEY \
///     --broadcast --verify
///
/// Prints the four addresses to stdout — paste those into the Worker
/// secrets (`BASE_FEDERATION_*_ADDRESS`).
contract DeployScript is Script {
    function run() external {
        address admin = vm.envAddress("ADMIN");
        address rewardToken = vm.envAddress("REWARD_TOKEN");

        vm.startBroadcast();
        ModelRegistry registry = new ModelRegistry(admin);
        ContributionLedger ledger = new ContributionLedger(admin);
        KYCRegistry kyc = new KYCRegistry(admin);
        RewardDistributor rd = new RewardDistributor(admin, IERC20(rewardToken), kyc);
        vm.stopBroadcast();

        console.log("ModelRegistry:", address(registry));
        console.log("ContributionLedger:", address(ledger));
        console.log("KYCRegistry:", address(kyc));
        console.log("RewardDistributor:", address(rd));
    }
}
