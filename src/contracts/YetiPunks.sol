// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YetiPunks is ERC721, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _nextTokenId;

    string private _baseTokenURI;

    uint256 public constant MAX_MINT = 20;
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public constant PRICE = 0.3 ether;

    bool public saleIsActive;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        _nextTokenId.increment(); // Start Token Ids at 1
        saleIsActive = true;
    }

    function mint(uint256 numberOfTokens) public payable {
        require(saleIsActive, "Yetis are not on sale yet");
        require(numberOfTokens <= MAX_MINT, "Exceeds max mint amount");

        uint256 mintIndex = _nextTokenId.current(); // Get next id to mint
        require(mintIndex <= MAX_SUPPLY, "Yetis are sold out");
        require(msg.value >= currentPrice(), "Not enough ETH to buy a Yet!");
        
        uint256 totalMinted = tokenSupply();
        uint256 newSupply = totalMinted + numberOfTokens;
        require(newSupply <= MAX_SUPPLY, "Exceeds max supply");

        if (numberOfTokens == 1) {
            _nextTokenId.increment();
            _safeMint(msg.sender, mintIndex);
        } else if (numberOfTokens > 1) {
            for (uint256 i = 0; i < numberOfTokens; i++) {
                _nextTokenId.increment(); // Increment Id before minting
                _safeMint(msg.sender, mintIndex);
            }
        }
    }

    function currentPrice() public pure returns (uint256) {
        return PRICE;
    }

    function remainingSupply() public view returns (uint256) {
        uint256 numberMinted = tokenSupply();
        return MAX_SUPPLY - numberMinted;
    }

    function tokenSupply() public view returns (uint256) {
        return _nextTokenId.current() - 1;
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function toggleSale() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    function withdrawBalance() public onlyOwner {
        payable(msg.sender).transfer(address(this).balance);
    }
}