// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// Be careful if minting from the contract. Make sure you understand how 
// the pricing works before smashing your keyboard in frustration.
contract WutIsThis is ERC721, Ownable {

    using Counters for Counters.Counter;
    Counters.Counter private _tokenSupply;

    uint256 public constant MAX_SUPPLY = 5000;
    
    uint256 public cost = 0.03 ether;
    // uint256 public constant PRICE_WAVE_ONE =     0.5 ether;  // 100 Available
    // uint256 public constant PRICE_WAVE_TWO =     0.6 ether;  // 150 Available
    // uint256 public constant PRICE_WAVE_THREE =   0.7 ether;  // 250 Available

    bool public saleIsActive = false;
    string private _baseTokenURI;

    // Constructor, because why not? (I don't know why)
    constructor() ERC721("YetiPunks", "YETIPUNKS") public { }

    // This is the new mint function leveraging the counter library
    function mint() public payable {
        require(saleIsActive, "JPEGs are not for sale yet!");

        uint256 mintIndex = _tokenSupply.current() + 1; // Start IDs at 1
        require(mintIndex <= MAX_SUPPLY, "JPEGs are sold out!");

        uint256 mintPrice = currentPrice();
        require(msg.value >= mintPrice, "Not enough ETH to buy a JPEG!");

        // Mint. That's the easy part.
        _tokenSupply.increment();
        _safeMint(msg.sender, mintIndex);
    }

    // How much is this JPEG going to cost me?
    function currentPrice() public view returns (uint256) {

        uint256 totalMinted = _tokenSupply.current();

        if (totalMinted < 100) {
            return PRICE_WAVE_ONE;

        } else if (totalMinted < 250) {
            return PRICE_WAVE_TWO;

        } else {
            return PRICE_WAVE_THREE;
        }
    }

    // I wonder how many JPEGs are left?
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _tokenSupply.current();
    }

    // I wonder how many JPEGs are minted?
    function tokenSupply() public view returns (uint256) {
        return _tokenSupply.current();
    }

    // All the functions you don't really care about but need to be here
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    // Go go go!
    function toggleSale() public onlyOwner {
        saleIsActive = !saleIsActive;
    }

    // You had to expect this function, right?
    function withdrawBalance() public onlyOwner {
        //divide evenly between all 3 wallets
        payable(msg.sender).transfer(address(this).balance);
    }
}