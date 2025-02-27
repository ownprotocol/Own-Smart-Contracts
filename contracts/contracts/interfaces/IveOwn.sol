// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IveOWN is IERC20 {
    // *** Errors ***
    error TransferDisabled();

    error TransferFromDisabled();

    // VeOWN specific functions
    function MINTER_ROLE() external view returns (bytes32);

    function mint(address to, uint256 amount) external;
}
