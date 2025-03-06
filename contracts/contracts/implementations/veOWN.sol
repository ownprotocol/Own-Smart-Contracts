// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {UUPSUpgradeable} from "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

import "../interfaces/IveOwn.sol";

contract VeOwn is
    Initializable,
    ERC20Upgradeable,
    AccessControlUpgradeable,
    IveOwn,
    UUPSUpgradeable
{
    bytes32 public MINTER_ROLE;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("veOwn", "veOwn");
        __AccessControl_init();
        __UUPSUpgradeable_init();

        MINTER_ROLE = keccak256("MINTER_ROLE");

        // the Stake contract deploys this contract and it needs to be able to mint
        _grantRole(DEFAULT_ADMIN_ROLE, _msgSender());
    }

    function _authorizeUpgrade(
        address _newImplementation
    ) internal override onlyRole(DEFAULT_ADMIN_ROLE) {}

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    function transfer(
        address,
        uint256
    ) public pure override(IERC20, ERC20Upgradeable) returns (bool) {
        revert TransferDisabled();
    }

    function transferFrom(
        address,
        address,
        uint256
    ) public pure override(IERC20, ERC20Upgradeable) returns (bool) {
        revert TransferFromDisabled();
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address _from,
        address _to,
        uint256 _value
    ) internal override(ERC20Upgradeable) {
        super._update(_from, _to, _value);
    }
}
