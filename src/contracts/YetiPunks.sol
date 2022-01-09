// SPDX-License-Identifier: MIT

pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./@rarible/royalties/contracts/impl/RoyaltiesV2Impl.sol";
import "./@rarible/royalties/contracts/LibPart.sol";
import "./@rarible/royalties/contracts/LibRoyaltiesV2.sol";

contract YetiPunks is ERC721, Ownable, RoyaltiesV2Impl {
    using Strings for uint256;
    using Counters for Counters.Counter;

    Counters.Counter private supply;

    string public uriPrefix = "";

    bytes4 private constant _INTERFACE_ID_ERC2981 = 0x2a55205a;

    uint16 public constant MAX_SUPPLY = 10000;
    uint16 public maxMintAmountPerTx = 20;
    uint256 public cost = 0.03 ether;

    bool public paused = false;

    constructor() ERC721("Petty Monks", "PM") {}

    modifier mintCompliance(uint256 _mintAmount) {
        require(
            _mintAmount > 0 && _mintAmount <= maxMintAmountPerTx,
            "Invalid mint amount!"
        );
        require(
            supply.current() + _mintAmount <= MAX_SUPPLY,
            "Max supply exceeded!"
        );
        _;
    }

    function totalSupply() public view returns (uint256) {
        return supply.current();
    }

    function mint(uint256 _mintAmount)
        public
        payable
        mintCompliance(_mintAmount)
    {
        // for some unknown reason, this fires when sending the correct amount on Rinkeby
        require(msg.value >= cost * _mintAmount, "Insufficient funds!");

        _mintLoop(msg.sender, _mintAmount);
    }

    function mintForAddress(uint256 _mintAmount, address _receiver)
        public
        mintCompliance(_mintAmount)
        onlyOwner
    {
        _mintLoop(_receiver, _mintAmount);
    }

    function setUriPrefix(string memory _uriPrefix) public onlyOwner {
        uriPrefix = _uriPrefix;
    }

    function setPaused(bool _state) public onlyOwner {
        paused = _state;
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

    //Rarible
    function setRoyalties(
        uint256 tokenId,
        address payable royaltyTo,
        uint96 percentageBasisPoints
    ) public onlyOwner {
        LibPart.Part[] memory _royalties = new LibPart.Part[](1);
        _royalties[0].value = percentageBasisPoints;
        _royalties[0].account = royaltyTo;
        _saveRoyalties(tokenId, _royalties);
    }

    //Mintable
    function royaltyInfo(uint256 _tokenId, uint256 _salePrice)
        external
        view
        returns (address receiver, uint256 royaltyAmount)
    {
        LibPart.Part[] memory _royalties = royalties[_tokenId];
        if (_royalties.length > 0) {
            return (
                _royalties[0].account,
                (_salePrice * _royalties[0].value) / 10000
            );
        }
        return (address(0), 0);
    }

    //rarible && mintable
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override(ERC721)
        returns (bool)
    {
        if (interfaceId == LibRoyaltiesV2._INTERFACE_ID_ROYALTIES) {
            return true;
        }

        //mintable
        if (interfaceId == _INTERFACE_ID_ERC2981) {
            return super.supportsInterface(interfaceId);
        }

        return super.supportsInterface(interfaceId);
    }

    function _mintLoop(address _receiver, uint256 _mintAmount) internal {
        for (uint256 i = 0; i < _mintAmount; i++) {
            supply.increment();
            _safeMint(_receiver, supply.current());
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return uriPrefix;
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal override(ERC721) {
        super._beforeTokenTransfer(from, to, tokenId);
    }
}
