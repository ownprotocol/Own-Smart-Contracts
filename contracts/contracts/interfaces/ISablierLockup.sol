// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// The implementation for this contract can be found here: https://github.com/sablier-labs/lockup/blob/main/src/abstracts/SablierLockupBase.sol
// Intentionally only declaring methods that we need, so we can simplify creating a mock contract
interface ISablierLockup {
    function withdraw(
        uint256 streamId,
        address to,
        uint128 amount
    ) external payable;

    function withdrawableAmountOf(
        uint256 streamId
    ) external view returns (uint128 withdrawableAmount);
}
