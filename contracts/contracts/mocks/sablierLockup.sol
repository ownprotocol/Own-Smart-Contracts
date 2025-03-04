// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "../interfaces/ISablierLockup.sol";
import "../interfaces/IOwn.sol";

contract MockSablierLockup is ISablierLockup {
    IOwn private _own;

    uint128 public withdrawableAmount;

    constructor(IOwn own) {
        _own = own;
    }

    function withdrawMax(
        uint256,
        address to
    ) external payable override returns (uint128) {
        uint256 balance = _own.balanceOf(address(this));
        _own.transfer(to, balance);

        return uint128(balance);
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
