// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {Script} from "forge-std/Script.sol";
import {KantinDigital} from "../src/KantinDigital.sol";

contract DeployKantinDigital is Script {
    function run() public {
        vm.startBroadcast();

        new KantinDigital();

        vm.stopBroadcast();
    }
}