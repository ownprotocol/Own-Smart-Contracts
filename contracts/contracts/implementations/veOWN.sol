// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.26;

import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";

import "../interfaces/IveOwn.sol";

contract VeOWN is ERC20Upgradeable, AccessControlUpgradeable, IveOWN {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("veOWN", "veOWN");
        __AccessControl_init();

        // the Stake contract deploys this contract and it needs to be able to mint
        _grantRole(MINTER_ROLE, _msgSender());
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // The following functions are overrides required by Solidity.
    function _update(
        address from,
        address to,
        uint256 value
    ) internal override(ERC20Upgradeable) {
        require(hasRole(MINTER_ROLE, msg.sender), "Only minter can update");
        super._update(from, to, value);
    }
}
