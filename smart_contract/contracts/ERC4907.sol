// SPDX-License-Identifier: CC0-1.0
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "./IERC4907.sol";

contract ERC4907 is ERC721, IERC4907 {
    struct UserInfo 
    {
        address user;   // address of user role
        uint64 expires; // unix timestamp, user expires
    }

    mapping (uint256  => UserInfo) internal _users;

    // CUSTOM
    // Mapping from token ID to index of the owner tokens list
    mapping(uint256 => uint256) internal _ownedTokensIndex;

    // Mapping from owner to list of owned token IDs
    mapping(address => mapping(uint256 => uint256)) internal _ownedTokens;

    // USER RENT BALANCE
    mapping(address => uint256) internal _userRentBalance;

    function claimNFTBack(uint256 tokenId) public {
        require(ownerOf(tokenId) == _msgSender(), "GO TO HELL");
        require(userOf(tokenId) == address(0), "NFT RENTED");
        address _renterAddr = _users[tokenId].user;
         // CUSTOM

        uint256 lastTokenIndex = _userRentBalance[_renterAddr] - 1;
        uint256 tokenIndex = _ownedTokensIndex[tokenId];
        if (tokenIndex != lastTokenIndex) {
            uint256 lastTokenId = _ownedTokens[_renterAddr][lastTokenIndex];

            _ownedTokens[_renterAddr][tokenIndex] = lastTokenId; // Move the last token to the slot of the to-delete token
            _ownedTokensIndex[lastTokenId] = tokenIndex; // Update the moved token's index
        }
        delete _ownedTokensIndex[tokenId];
        delete _ownedTokens[_renterAddr][lastTokenIndex];
        delete _users[tokenId];
        _userRentBalance[_renterAddr] = lastTokenIndex;
    }

    function checkTokenStatus(uint256 tokenId) internal view returns(bool){
        // if( uint256(_users[tokenId].expires) >=  block.timestamp){
        //     return  _users[tokenId].user;
        // }
        if(_users[tokenId].user == address(0)){
            return true;
        }else{
            return false;
        }
    }

    constructor(string memory name_, string memory symbol_)
     ERC721(name_, symbol_){}
    
    /// @notice set the user and expires of an NFT
    /// @dev The zero address indicates there is no user
    /// Throws if `tokenId` is not valid NFT
    /// @param user  The new user of the NFT
    /// @param expires  UNIX timestamp, The new user could use the NFT before expires
    function setUser(uint256 tokenId, address user, uint64 expires) public override virtual{
        require(_isApprovedOrOwner(msg.sender, tokenId), "ERC4907: transfer caller is not owner nor approved");
        // require(checkTokenStatus(tokenId), "Token not claimed back yet");
        require(userOf(tokenId) == address(0) , "Token already rented");
        if(!checkTokenStatus(tokenId)){
            claimNFTBack(tokenId);
        }
        UserInfo storage info =  _users[tokenId];
        info.user = user;
        info.expires = expires;
        emit UpdateUser(tokenId, user, expires);

        // CUSTOM
        uint256 length = _userRentBalance[user];
        _ownedTokens[user][length] = tokenId;
        _ownedTokensIndex[tokenId] = length;
        _userRentBalance[user] = length+1;
    }

    /// @notice Get the user address of an NFT
    /// @dev The zero address indicates that there is no user or the user is expired
    /// @param tokenId The NFT to get the user address for
    /// @return The user address for this NFT
    function userOf(uint256 tokenId) public override view virtual returns(address){
        if( uint256(_users[tokenId].expires) >=  block.timestamp){
            return  _users[tokenId].user;
        }
        else{
            return address(0);
        }
    }

    /// @notice Get the user expires of an NFT
    /// @dev The zero value indicates that there is no user
    /// @param tokenId The NFT to get the user expires for
    /// @return The user expires for this NFT
    function userExpires(uint256 tokenId) public override view virtual returns(uint256){
        return _users[tokenId].expires;
    }

    /// @dev See {IERC165-supportsInterface}.
    function supportsInterface(bytes4 interfaceId) public view virtual override returns (bool) {
        return interfaceId == type(IERC4907).interfaceId || super.supportsInterface(interfaceId);
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);

        if (from != to && _users[tokenId].user != address(0)) {
            delete _users[tokenId];
            emit UpdateUser(tokenId, address(0), 0);
        } 
    } 
} 