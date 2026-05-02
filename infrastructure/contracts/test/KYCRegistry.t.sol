// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/KYCRegistry.sol";
import "../src/Ownable.sol";

contract KYCRegistryTest is Test {
    KYCRegistry kyc;
    address admin = address(0xA1);
    address recipient = address(0xC3);

    function setUp() public {
        kyc = new KYCRegistry(admin);
    }

    function testAddAndIsAllowed() public {
        vm.prank(admin);
        kyc.add(recipient, 0); // 0 → never expires
        assertTrue(kyc.isAllowed(recipient));
    }

    function testRemove() public {
        vm.startPrank(admin);
        kyc.add(recipient, 0);
        kyc.remove(recipient);
        vm.stopPrank();
        assertFalse(kyc.isAllowed(recipient));
    }

    function testExpiry() public {
        vm.warp(1000);
        vm.prank(admin);
        kyc.add(recipient, 1500);
        assertTrue(kyc.isAllowed(recipient));
        vm.warp(1600);
        assertFalse(kyc.isAllowed(recipient));
    }

    function testNonAdminCannotAdd() public {
        vm.prank(address(0xB2));
        vm.expectRevert(Ownable.NotOwner.selector);
        kyc.add(recipient, 0);
    }

    function testZeroRecipientReverts() public {
        vm.prank(admin);
        vm.expectRevert(KYCRegistry.ZeroRecipient.selector);
        kyc.add(address(0), 0);
    }
}
