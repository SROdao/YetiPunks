// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YetiPunks is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenSupply;

    uint256 public constant MAX_SUPPLY = 5000;
    uint256 public cost = 0.03 ether;

    bool public saleIsActive = false;
    string private _baseTokenURI;

    constructor(
        string memory _name,
        string memory _symbol
        // string memory _initBaseURI,
        // string memory _initNotRevealedUri,
        // uint256 _revealTime
    ) ERC721(_name, _symbol) { 
        //Set baseURI here?
        //set pre-reveal image here?
        //set deploy time here?
    }

    // This is the new mint function leveraging the counter library
    function mint() public payable {
        require(saleIsActive, "Yetis are not for sale yet!");

        uint256 mintIndex = _tokenSupply.current() + 1; // Start IDs at 1
        require(mintIndex <= MAX_SUPPLY, "Yetis are sold out!");

        uint256 mintPrice = 0.03 ether;
        require(msg.value >= mintPrice, "Not enough ETH to buy a Yeti!");

        _tokenSupply.increment();
        _safeMint(msg.sender, mintIndex);
    }

    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _tokenSupply.current();
    }

    function tokenSupply() public view returns (uint256) {
        return _tokenSupply.current();
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function toggleSale(bool _state) public onlyOwner {
        saleIsActive = _state;
    }

    function withdrawBalance() public onlyOwner {
        //TODO: divide evenly between 3 wallets
        payable(msg.sender).transfer(address(this).balance * 33/100); //
        // payable(msg.sender).transfer(address(this).balance * 33/100); Wang Mandoo's wallet
        // payable(msg.sender).transfer(address(this).balance * 33/100); Goku-sans' wallet

        //alt syntax: saves on gas?
        // (bool hs, ) = payable(0x943590A42C27D08e3744202c4Ae5eD55c2dE240D).call{value: address(this).balance * 5 / 100}("");
        // require(hs);
    }
}