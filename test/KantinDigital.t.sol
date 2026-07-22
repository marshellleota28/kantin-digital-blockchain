// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Test} from "forge-std/Test.sol";
import "../src/KantinDigital.sol";

contract KantinDigitalTest is Test {

    KantinDigital kantin;

    function setUp() public {
        kantin = new KantinDigital();
    }

    function testPlaceOrder() public {

        kantin.placeOrder(
            "Marshell",
            1,
            "Nasi Goreng",
            25000
        );

        assertEq(kantin.getOrderCount(), 1);
    }

    function testUpdateStatus() public {

        kantin.placeOrder(
            "Marshell",
            1,
            "Nasi Goreng",
            25000
        );

        kantin.updateStatus(
            1,
            "Selesai"
        );

        (
            ,
            ,
            ,
            ,
            ,
            string memory status
        ) = kantin.getOrder(1);

        assertEq(status, "Selesai");
    }

    function testGetAvailableTable() public {

        uint256 meja = kantin.getAvailableTable();

        assertEq(meja, 1);

        kantin.placeOrder(
            "Marshell",
            meja,
            "Bakso",
            20000
        );

        uint256 mejaBaru = kantin.getAvailableTable();

        assertEq(mejaBaru, 2);
    }

    function testClearTable() public {

        kantin.placeOrder(
            "Marshell",
            1,
            "Es Teh",
            5000
        );

        kantin.updateStatus(
            1,
            "CLEAR"
        );

        assertTrue(
            kantin.isTableAvailable(1)
        );
    }

}