// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/RewardDistributor.sol";
import "../src/KYCRegistry.sol";
import "../src/Ownable.sol";

contract MockERC20 is IERC20 {
    mapping(address => uint256) public balance;
    function mint(address to, uint256 amt) external { balance[to] += amt; }
    function balanceOf(address a) external view returns (uint256) { return balance[a]; }
    function transfer(address to, uint256 amt) external returns (bool) {
        require(balance[msg.sender] >= amt, "insufficient");
        balance[msg.sender] -= amt;
        balance[to] += amt;
        return true;
    }
}

contract RewardDistributorTest is Test {
    MockERC20 token;
    KYCRegistry kyc;
    RewardDistributor rd;
    address admin = address(0xA1);
    address recipient = address(0xC3);

    function setUp() public {
        token = new MockERC20();
        kyc = new KYCRegistry(admin);
        rd = new RewardDistributor(admin, IERC20(address(token)), kyc);
        token.mint(address(rd), 1_000_000);
    }

    function testHappyPath() public {
        vm.prank(admin);
        kyc.add(recipient, 0);
        vm.prank(admin);
        rd.distribute(recipient, 1000, bytes32("r1"));
        assertEq(token.balanceOf(recipient), 1000);
        assertTrue(rd.paid(bytes32("r1"), recipient));
    }

    function testRevertsIfNotAllowed() public {
        vm.prank(admin);
        vm.expectRevert(RewardDistributor.NotAllowed.selector);
        rd.distribute(recipient, 1000, bytes32("r1"));
    }

    function testRevertsOnDoublePay() public {
        vm.startPrank(admin);
        kyc.add(recipient, 0);
        rd.distribute(recipient, 1000, bytes32("r1"));
        vm.expectRevert(RewardDistributor.AlreadyPaid.selector);
        rd.distribute(recipient, 500, bytes32("r1"));
        vm.stopPrank();
    }

    function testRevertsOnInsufficientBalance() public {
        vm.startPrank(admin);
        kyc.add(recipient, 0);
        vm.expectRevert(RewardDistributor.InsufficientBalance.selector);
        rd.distribute(recipient, 2_000_000, bytes32("r1"));
        vm.stopPrank();
    }

    function testNonAdminCannotDistribute() public {
        vm.prank(admin);
        kyc.add(recipient, 0);
        vm.prank(address(0xB2));
        vm.expectRevert(Ownable.NotOwner.selector);
        rd.distribute(recipient, 100, bytes32("r1"));
    }
}
