// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

interface IveOwn is IERC20 {
    // *** Errors ***
    /**
     * @notice Error thrown when token transfer is disabled
     */
    error TransferDisabled();

    /**
     * @notice Error thrown when transferFrom is disabled
     */
    error TransferFromDisabled();

    /**
     * @notice Retrieves the bytes32 identifier for the minter role
     * @return The minter role bytes32 value
     */
    function MINTER_ROLE() external view returns (bytes32);

    /**
     * @notice Mints new tokens to a specified address
     * @param to The address receiving the minted tokens
     * @param amount The number of tokens to mint
     */
    function mint(address to, uint256 amount) external;
}
