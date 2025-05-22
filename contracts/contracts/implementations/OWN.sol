// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {AccessControlUpgradeable} from "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20BurnableUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20BurnableUpgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

import "../interfaces/IOwn.sol";

contract Own is
    Initializable,
    ERC20Upgradeable,
    ERC20BurnableUpgradeable,
    ERC20PermitUpgradeable,
    AccessControlUpgradeable,
    UUPSUpgradeable,
    IOwn
{
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        address _recipient,
        address _defaultAdmin
    ) public initializer {
        if (_recipient == address(0) || _defaultAdmin == address(0)) {
            revert CannotSetAddressToZero();
        }

        __ERC20_init("testToken", "testToken");
        __ERC20Burnable_init();
        __ERC20Permit_init("testToken");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        _mint(_recipient, 2_250_000_000 * 10 ** decimals());
        _grantRole(DEFAULT_ADMIN_ROLE, _defaultAdmin);
    }

    function _authorizeUpgrade(
        address _newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}
}
