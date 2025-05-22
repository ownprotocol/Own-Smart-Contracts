/// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {IStake} from "../interfaces/IStake.sol";

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
     * @notice Error thrown when attempting to set a contract address to zero
     */
    error CannotSetAddressToZero();

    // *** Events ***

    /**
     * @notice Emitted when the stake contract is set
     * @param stakeContract The address of the stake contract
     */
    event StakeContractSet(address stakeContract);

    /**
     * @notice Callable by the admin to set the stake contract
     * @param _stakeContract The address of the stake contract
     */
    function setStakeContract(IStake _stakeContract) external;
}
