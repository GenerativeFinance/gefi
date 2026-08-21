// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/ModelRegistry.sol";

contract ModelRegistryTest is Test {
    ModelRegistry registry;
    address admin = address(0xA1);
    address attacker = address(0xB2);

    function setUp() public {
        registry = new ModelRegistry(admin);
    }

    function testRegisterAndRead() public {
        vm.prank(admin);
        registry.register(bytes32("m1"), bytes32("v1"), bytes32(uint256(0xdeadbeef)));
        assertEq(registry.artifactByVersion(bytes32("m1"), bytes32("v1")), bytes32(uint256(0xdeadbeef)));
    }

    function testNonOwnerCannotRegister() public {
        vm.prank(attacker);
        vm.expectRevert(Ownable.NotOwner.selector);
        registry.register(bytes32("m1"), bytes32("v1"), bytes32(uint256(1)));
    }

    function testDoubleRegisterReverts() public {
        vm.startPrank(admin);
        registry.register(bytes32("m1"), bytes32("v1"), bytes32(uint256(1)));
        vm.expectRevert(ModelRegistry.AlreadyRegistered.selector);
        registry.register(bytes32("m1"), bytes32("v1"), bytes32(uint256(2)));
        vm.stopPrank();
    }

    function testSetCurrentRequiresKnownVersion() public {
        vm.prank(admin);
        vm.expectRevert(ModelRegistry.UnknownVersion.selector);
        registry.setCurrent(bytes32("m1"), bytes32("vX"));
    }

    function testSetCurrentSucceeds() public {
        vm.startPrank(admin);
        registry.register(bytes32("m1"), bytes32("v1"), bytes32(uint256(1)));
        registry.setCurrent(bytes32("m1"), bytes32("v1"));
        assertEq(registry.currentVersion(bytes32("m1")), bytes32("v1"));
        vm.stopPrank();
    }
}
