//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract GiGToken is ERC20 {
    constructor() ERC20("GiG Token", "GiG") {
        _mint(msg.sender, 1_000_000_000 * 10 ** decimals());
    }
}

