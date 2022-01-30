// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "./ERC721A.sol";

contract YetiPunks is ERC721A, Ownable, ReentrancyGuard {
    using ECDSA for bytes32;

    enum Status {
        Pending,
        PreSale,
        PublicSale,
        Finished
    }

    Status public status;
    string public baseURI;
    address private _signer;
    uint256 public immutable maxMint;
    uint256 public immutable maxSupply;
    uint256 public constant PRICE = 0.03 * 10**18; // 0.03 ETH

    mapping(address => bool) public publicMinted;

    event Minted(address minter, uint256 amount);
    event StatusChanged(Status status);
    event SignerChanged(address signer);
    event ReservedToken(address minter, address recipient, uint256 amount);
    event BaseURIChanged(string newBaseURI);

    constructor(
        string memory initBaseURI,
        address signer,
        uint256 _maxBatchSize,
        uint256 _collectionSize
    ) ERC721A("PettyMonks", "PETTY", _maxBatchSize, _collectionSize) {
        baseURI = initBaseURI;
        _signer = signer;
        maxMint = _maxBatchSize;
        maxSupply = _collectionSize;
    }

    function _hash(string calldata salt, address _address)
        internal
        view
        returns (bytes32)
    {
        return keccak256(abi.encode(salt, address(this), _address));
    }

    function _verify(bytes32 hash, bytes memory token)
        internal
        view
        returns (bool)
    {
        return (_recover(hash, token) == _signer);
    }

    function _recover(bytes32 hash, bytes memory token)
        internal
        pure
        returns (address)
    {
        return hash.toEthSignedMessageHash().recover(token);
        // toEthSignedMessageHash/recover:
        // Returns an Ethereum Signed Message, created from a `hash`. 
        // This produces hash corresponding to the one signed with the https://eth.wiki/json-rpc/API#eth_sign[`eth_sign`] JSON-RPC method as part of EIP-191.
        // https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/ECDSA.sol#L74-L77

        // toEthSignedMessageHash simply builds a hash and recover will return the address from a digest and a signature.
    }

    function _baseURI() internal view override returns (string memory) {
        return baseURI;
    }

    function presaleMint(
        uint256 amount,
        string calldata salt,
        bytes calldata token
    ) external payable {
        require(status == Status.PreSale, "PETTY: Presale is not active.");
        require(
            tx.origin == msg.sender,
            "PETTY: contract is not allowed to mint."
        );
        require(
            _verify(_hash(salt, msg.sender), token),
            "PETTY: Invalid token."
        );
        require(
            numberMinted(msg.sender) + amount <= maxMint,
            "PETTY: Max mint amount per wallet exceeded."
        );
        require(
            totalSupply() + amount <= collectionSize,
            "PETTY: Max supply exceeded."
        );

        _safeMint(msg.sender, amount);
        refundIfOver(PRICE * amount);

        emit Minted(msg.sender, amount);
    }

    function mint() external payable {
        require(
            status == Status.PublicSale,
            "PETTY: Public sale is not active."
        );
        require(
            tx.origin == msg.sender,
            "PETTY: contract is not allowed to mint."
        );
        require(
            !publicMinted[msg.sender],
            "PETTY: The wallet has already minted during public sale."
        );
        require(
            totalSupply() + 1 <=
                collectionSize,
            "PETTY: Max supply exceeded."
        );

        _safeMint(msg.sender, 1);
        publicMinted[msg.sender] = true;
        refundIfOver(PRICE);

        emit Minted(msg.sender, 1);
    }

    function refundIfOver(uint256 price) private {
        // need this?
        require(msg.value >= price, "PETTY: Need to send more ETH.");
        if (msg.value > price) {
            payable(msg.sender).transfer(msg.value - price);
        }
    }

    function withdrawBalance() external nonReentrant onlyOwner {
        uint256 oneThird = (address(this).balance * 33) / 100;
        (bool manduSuccess, ) = payable(
            0xD61ADc48afE9402B4411805Ce6026eF74F94E713
        ).call{value: oneThird}("");
        require(manduSuccess);
        (bool somkidSuccess, ) = payable(
            0xE3Ce04B3BcbdFa219407870Ca617e18fBF503F28
        ).call{value: oneThird}("");
        require(somkidSuccess);
        (bool andreasSuccess, ) = payable(
            0x49Cf0aF1cE6a50e822A91a427B3E29007f9C6C09
        ).call{value: address(this).balance}("");
        require(andreasSuccess);
    }

    function setBaseURI(string calldata newBaseURI) external onlyOwner {
        baseURI = newBaseURI;
        emit BaseURIChanged(newBaseURI);
    }

    function setStatus(Status _status) external onlyOwner {
        status = _status;
        emit StatusChanged(_status);
    }

    function setSigner(address signer) external onlyOwner {
        _signer = signer;
        emit SignerChanged(signer);
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
