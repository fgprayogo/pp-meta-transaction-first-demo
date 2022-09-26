// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "./ERC4907.sol";
import "./ERC721Permit.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlanetPersibNFT2 is ERC4907, ERC721Permit, ERC721Enumerable, Ownable {
    constructor()
        ERC4907("PlanetPersibNFT2", "PPNFT2")
        ERC721Permit("PlanetPersibNFT2")
    {}

    function mint(uint256 tokenId, address to) public {
        _mint(to, tokenId);
    }

    // CUSTOM
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC4907, ERC721Enumerable, ERC721Permit)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }

    function tokenOfRentedByIndex(address renterAddr, uint256 index)
        public
        view
        returns (uint256)
    {
        return _ownedTokens[renterAddr][index];
    }

    // this function use to get index of owner token id
    // function tokenRentedByIndex(uint256 tokenId) public view returns(uint256){
    //     return _ownedTokensIndex[tokenId];
    // }

    // This function use to get the balance of user's rented balance
    function balanceOfRenter(address renterAddr) public view returns (uint256) {
        return _userRentBalance[renterAddr];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC4907, ERC721, ERC721Enumerable) {
        require(userOf(tokenId) == address(0), "Token is rented");
        require(checkTokenStatus(tokenId), "Token not claimed back yet");
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != to && _users[tokenId].user != address(0)) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        }
    }

    function _transfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721Permit, ERC721) {
        super._transfer(from, to, tokenId);
    }
}

// unix next year = 1694849170
//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db
