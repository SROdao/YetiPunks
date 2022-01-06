// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract YetiPunks is ERC721, Ownable {
    
    string private baseURI;
    uint16 public totalSupply = 0;
    uint16 MAX_YETIS = 10000;
    event yetiMintedAmount(uint16 amount);

    constructor() ERC721("YetiPunks", "YETI") {
     
    }

    function withdraw() public onlyOwner {
        uint256 balance = address(this).balance;
        payable(msg.sender).transfer(balance);

    }

    function setBaseURI(string memory base) public onlyOwner {
        baseURI = base;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    // Despite the function being payable, I've removed any functionality for that here for the simplicity of the example.
    function mint(uint16 numberOfTokens) public payable {
        require(totalSupply + 1 < MAX_YETIS, "All yeti punks have already been minted!");
        require(totalSupply + numberOfTokens <= MAX_YETIS, "You are trying to mint more Yetis than are left, decrease the number of yetis and try again.");
        
        for (uint i = 0; i < numberOfTokens; i++) {
            _safeMint(msg.sender, totalSupply + 1);
            totalSupply += 1;
        }

        emit yetiMintedAmount(numberOfTokens);
    }

    function tokenURI(uint256 tokenId) public view virtual override(ERC721) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function _beforeTokenTransfer(address from, address to, uint256 tokenId) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721) {
        super._burn(tokenId);
    }

    function supportsInterface(bytes4 interfaceId) public view override(ERC721) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}