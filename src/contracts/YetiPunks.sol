// SPDX-License-Identifier: MIT
pragma solidity 0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract YetiPunks is ERC721, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenSupply;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public cost = 0.03 ether;

    bool public saleIsActive = false;
    string private _baseTokenURI;

    constructor() ERC721("YetiPunks", "YETI") { 
        _tokenSupply.increment(); // Start Token Ids at 1
        saleIsActive = true;
    }

    // This is the new mint function leveraging the counter library
    function mint() public payable {
        require(saleIsActive, "Yetis are not for sale yet!");

        // Would this revert if a mint fails?
        uint256 mintIndex = _tokenSupply.current() + 1; // Start IDs at 1
        require(mintIndex <= MAX_SUPPLY, "Yetis are sold out!");

        // uint256 mintPrice = 30000000000000000 wei;
        // require(msg.value >= mintPrice, "Not enough ETH to buy a Yeti!");

        _tokenSupply.increment();
        _safeMint(msg.sender, mintIndex);
    }

    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - _tokenSupply.current();
    }

    function tokenSupply() public view returns (uint256) {
        return _tokenSupply.current();
    }

    function _baseURI() internal view virtual override returns (string memory) { //onlyOwner
        return _baseTokenURI;
    }

    function getBaseUri() external view onlyOwner returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function toggleSale(bool _state) public onlyOwner { //maybe don't need this
        saleIsActive = _state;
    }

    function withdrawBalance() public onlyOwner {
        //TODO: divide evenly between 3 wallets
        address payable tokimori = payable(msg.sender);
        payable(msg.sender).transfer(address(this).balance * 33/100);
        payable(tokimori).transfer(address(this).balance * 33/100);
    
        //alt syntax: saves on gas?
        (bool hs, ) = payable(0x943590A42C27D08e3744202c4Ae5eD55c2dE240D).call{value: address(this).balance * 33 / 100}("");
        require(hs);

        // function sendViaTransfer(address payable _to) public payable {
        //     // This function is no longer recommended for sending Ether.
        //     _to.transfer(msg.value);
        // }

        // function sendViaSend(address payable _to) public payable {
        //     // Send returns a boolean value indicating success or failure.
        //     // This function is not recommended for sending Ether.
        //     bool sent = _to.send(msg.value);
        //     require(sent, "Failed to send Ether");
        // }

        // function sendViaCall(address payable _to) public payable {
        //     // Call returns a boolean value indicating success or failure.
        //     // This is the current recommended method to use.
        //     (bool sent, bytes memory data) = _to.call{value: msg.value}("");
        //     require(sent, "Failed to send Ether");
        // }
    }
}