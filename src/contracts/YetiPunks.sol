// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "./ERC721A.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract YetiPunks is Ownable, ERC721A, ReentrancyGuard {
    uint256 public immutable maxPerTxn;
    uint256 public immutable maxPerAddressDuringPresale = 5;
    uint256 public immutable amountForDevs;
    uint256 public immutable amountForAuctionAndDev;
    string public notRevealedUri;

    mapping(address => uint256) public allowlist; //seed this with the uint being 5

    constructor(
        uint256 maxBatchSize_,
        uint256 collectionSize_,
        uint256 amountForAuctionAndDev_,
        uint256 amountForDevs_,
        string memory _initNotRevealedUri
    ) ERC721A("Petty Monks", "PM", maxBatchSize_, collectionSize_) {
        maxPerTxn = maxBatchSize_;
        amountForAuctionAndDev = amountForAuctionAndDev_;
        amountForDevs = amountForDevs_;
        require(
            amountForAuctionAndDev_ <= collectionSize_,
            "larger collection size needed"
        );
        setNotRevealedURI(_initNotRevealedUri);
    }

    modifier callerIsUser() {
        require(tx.origin == msg.sender, "The caller is another contract");
        _;
    }

    function allowlistMint(uint256 quantity) external payable callerIsUser {
        uint256 price = 0.03 ether;
        require(allowlist[msg.sender] > 0, "not eligible for whitelist mint");
        require(
            totalSupply() + quantity <= collectionSize,
            "exceeded max supply"
        ); //is this possible?
        require(
            numberMinted(msg.sender) + quantity <= maxPerAddressDuringPresale,
            "mint amount exceeds whitelist"
        );
        allowlist[msg.sender] -= quantity;
        _safeMint(msg.sender, quantity);
        refundIfOver(price * quantity);
    }

    function publicSaleMint(uint256 quantity) external payable callerIsUser {
        uint256 publicPrice = 0.03 ether;

        require(
            totalSupply() + quantity <= collectionSize,
            "exceeded max supply"
        );
        require(quantity <= maxPerTxn, "can not mint this many in one batch");
        _safeMint(msg.sender, quantity);
        refundIfOver(publicPrice * quantity);
    }

    function refundIfOver(uint256 price) private {
        require(msg.value >= price, "Need to send more ETH");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function isPublicSaleOn(
        uint256 publicPriceWei,
        uint256 publicSaleKey,
        uint256 publicSaleStartTime
    ) public view returns (bool) {
        return
            publicPriceWei != 0 &&
            publicSaleKey != 0 &&
            block.timestamp >= publicSaleStartTime;
    }

    function seedAllowlist(
        address[] memory addresses,
        uint256[] memory numSlots
    ) external onlyOwner {
        require(
            addresses.length == numSlots.length,
            "addresses does not match numSlots length"
        );
        for (uint256 i = 0; i < addresses.length; i++) {
            allowlist[addresses[i]] = numSlots[i];
        }
    }

    // For marketing etc.
    function giveAwayMint(address[] calldata addresses) external onlyOwner {        
        for (uint256 i = 0; i < addresses.length; i++) {
             _safeMint(addresses[i], 1);
        }
    }

    // metadata URI
    string private _baseTokenURI;

    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setNotRevealedURI(string memory _notRevealedURI) public onlyOwner {
        notRevealedUri = _notRevealedURI;
    }

    function setBaseURI(string calldata baseURI) external onlyOwner {
        _baseTokenURI = baseURI;
    }

    function withdrawBalance() public onlyOwner {
        uint256 oneThird = (address(this).balance * 33) / 100;
        (bool manduSuccess, ) = payable(
            0xD61ADc48afE9402B4411805Ce6026eF74F94E713
        ).call{value: oneThird}("");
        require(manduSuccess);
        (bool tenzingSuccess, ) = payable(
            0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28
        ).call{value: oneThird}("");
        require(tenzingSuccess);
        (bool tokiMoriSuccess, ) = payable(
            0x49Cf0aF1cE6a50e822A91a427B3E29007f9C6C09
        ).call{value: address(this).balance}("");
        require(tokiMoriSuccess);
    }

    function setOwnersExplicit(uint256 quantity)
        external
        onlyOwner
        nonReentrant
    {
        _setOwnersExplicit(quantity);
    }

    function numberMinted(address owner) public view returns (uint256) {
        return _numberMinted(owner);
    }

    function getOwnershipData(uint256 tokenId)
        external
        view
        returns (TokenOwnership memory)
    {
        return ownershipOf(tokenId);
    }
}
