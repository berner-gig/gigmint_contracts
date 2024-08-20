//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

event MintTune(address owner, uint256 tokenId);

contract GiGTune is ERC721URIStorageUpgradeable, OwnableUpgradeable {
    uint256 private _nextTokenId;

    function initialize() public initializer {
        __ERC721_init("GiGTune", "GT");
        __ERC721URIStorage_init();
        __Ownable_init(msg.sender);
        _nextTokenId = 0;
    }

    function mint(address to, string memory tokenURI) public returns (uint256) {
        uint256 tokenId = _nextTokenId;
        _nextTokenId++;
        _mint(to, tokenId);
        _setTokenURI(tokenId, tokenURI);

        emit MintTune(to, tokenId);

        return tokenId;
    }

}