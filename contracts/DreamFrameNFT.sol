// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DreamFrameNFT is ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    
    event NFTMinted(address owner, uint256 tokenId, string tokenURI);

    constructor() ERC721("DreamFrame", "DREAM") Ownable(msg.sender) {}

    function mintNFT(address recipient, string memory tokenURI) public returns (uint256) {
        uint256 newItemId = _nextTokenId++;
        
        _mint(recipient, newItemId);
        _setTokenURI(newItemId, tokenURI);
        
        emit NFTMinted(recipient, newItemId, tokenURI);
        
        return newItemId;
    }
}
