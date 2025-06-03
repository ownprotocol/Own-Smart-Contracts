// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "../interfaces/IveOwn.sol";

contract MockERC20 is ERC20 {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() ERC20("MockERC20", "MockERC20") {}

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }

    function decimals() public pure override returns (uint8) {
        return 6;
    }
}
