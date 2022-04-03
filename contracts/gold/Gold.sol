// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract Gold is ERC20, Pausable, AccessControl {
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");
    mapping(address => bool) _blacklist;

    event BlacklistAdded(address account);
    event BlacklistRemoved(address account);

    constructor() ERC20("Gold", "BTC") {
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(PAUSER_ROLE, msg.sender);
        _mint(msg.sender, 10000 * 10 ** decimals());
    }

    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 amount
    ) internal override whenNotPaused {
        super._beforeTokenTransfer(from, to, amount);
    }

    function addToBlacklist(address _account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_account != msg.sender, "Gold: can't add sender to blacklist");
        require(_blacklist[_account] == false, "Gold: account was in blacklist");

        _blacklist[_account] = true;
        emit BlacklistAdded(_account);
    }

    function removeFromBlacklist(address _account) public onlyRole(DEFAULT_ADMIN_ROLE) {
        require(_account != msg.sender, "Gold: can't remove sender to blacklist");
        require(_blacklist[_account] == true, "Gold: account wasn't in blacklist");

        _blacklist[_account] = false;
        emit BlacklistRemoved(_account);
    }
}
