// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "../interfaces/ISablierLockup.sol";
import "../interfaces/IveOwn.sol";

contract MockSablierLockup is ISablierLockup {
    IveOWN private _own;

    uint128 public withdrawableAmount;

    constructor(IveOWN own) {
        _own = own;
    }

    function withdraw(
        uint256,
        address to,
        uint128 amount
    ) external payable override {
        _own.transfer(to, amount);
    }

    function withdrawableAmountOf(
        uint256
    ) external view override returns (uint128) {
        return withdrawableAmount;
    }

    function setWithdrawableAmount(uint128 amount) external {
        withdrawableAmount = amount;
    }
}
