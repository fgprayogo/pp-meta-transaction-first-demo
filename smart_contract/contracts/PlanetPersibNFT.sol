// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PlanetPersibNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    constructor() ERC721("PlanetPersibNFT", "PPNFT") {}

    function safeMint(address to, uint256 tokenId, string memory uri)
        public
        onlyOwner
    {
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory){
        return super.tokenURI(tokenId);
    }

    /// START - CUSTOM FUNCTIONS

    function setApprovalForAll(
        address owner, 
        bool approved
    ) public onlyOwner override(ERC721) {
        _setApprovalForAll(owner, _msgSender(), approved);
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public onlyOwner override(ERC721) {
        //solhint-disable-next-line max-line-length
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");

        _transfer(from, to, tokenId);
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) public onlyOwner override(ERC721)  {
        safeTransferFrom(from, to, tokenId, "");
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory data
    ) public onlyOwner override(ERC721) {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not token owner or approved");
        _safeTransfer(from, to, tokenId, data);
    }

    function approveAndTransfer(address owner, uint256 tokenId) public onlyOwner {
        if(!isApprovedForAll(owner, _msgSender())){
         _setApprovalForAll(owner, _msgSender(), true);
        }
         safeTransferFrom(owner, _msgSender(), tokenId, "");
    }
    /// END - CUSTOM FUNCTIONS

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}


    // function setApprovalForAll(address owner, bool approved) override public onlyOwner {
    //     _setApprovalForAll(owner, _msgSender(), approved);
    // }

//0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
//0xAb8483F64d9C6d1EcF9b849Ae677dD3315835cb2
//0x4B20993Bc481177ec7E8f571ceCaE8A9e22C02db