// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IOwn is IERC20 {
    /**
     * @notice Error thrown when attempting to set a contract address to zero
     */
    error CannotSetAddressToZero();
}
