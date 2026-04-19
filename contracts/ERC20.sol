// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ERC20Generator is ERC20 {
    constructor(
        uint256 initialSupply,
        string memory name_,
        string memory symbol_
    ) ERC20(name_, symbol_) {
        require(bytes(name_).length > 0, "Token name required");
        require(bytes(symbol_).length > 0, "Token symbol required");
        require(initialSupply > 0, "Initial supply must be greater than 0");

        _mint(msg.sender, initialSupply);
    }
}
