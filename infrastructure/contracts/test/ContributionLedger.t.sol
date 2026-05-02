// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ContributionLedger.sol";
import "../src/Ownable.sol";

contract ContributionLedgerTest is Test {
    ContributionLedger ledger;
    address admin = address(0xA1);

    function setUp() public {
        ledger = new ContributionLedger(admin);
    }

    function testCommit() public {
        vm.prank(admin);
        ledger.commit(bytes32("r1"), bytes32("m1"), bytes32(uint256(1)), bytes32(uint256(2)));
        (bytes32 modelId, bytes32 agg, bytes32 root, uint64 ts) = ledger.commitsByRound(bytes32("r1"));
        assertEq(modelId, bytes32("m1"));
        assertEq(agg, bytes32(uint256(1)));
        assertEq(root, bytes32(uint256(2)));
        assertGt(ts, 0);
    }

    function testDoubleCommitReverts() public {
        vm.startPrank(admin);
        ledger.commit(bytes32("r1"), bytes32("m1"), bytes32(uint256(1)), bytes32(uint256(2)));
        vm.expectRevert(ContributionLedger.AlreadyCommitted.selector);
        ledger.commit(bytes32("r1"), bytes32("m1"), bytes32(uint256(3)), bytes32(uint256(4)));
        vm.stopPrank();
    }

    function testNonAdminCannotCommit() public {
        vm.prank(address(0xB2));
        vm.expectRevert(Ownable.NotOwner.selector);
        ledger.commit(bytes32("r1"), bytes32("m1"), bytes32(uint256(1)), bytes32(uint256(2)));
    }
}
