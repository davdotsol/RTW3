// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

// npx hardhat verify --network mumbai 0xBC683d8d0f0E2D92bCDba413C60b87d69AaBc274

contract ChainBattles is ERC721URIStorage {
    // ssociating all the methods inside the "Strings" library to the uint256 type
    using Strings for uint256;
    using Counters for Counters.Counter;
    // store our NFT IDs:
    Counters.Counter private _tokenIds;

    // Attributes of the NFT stored on-chain
    struct Attributes {
        uint256 level;
        uint256 speed;
        uint256 strengh;
        uint256 life;
    }
    // store the attributes of an NFT associated with its tokenId
    mapping(uint256 => Attributes) public tokenIdToAttributes;

    constructor() ERC721("Chain Battles", "CBTLS") {}

    // generate and update the SVG image of our NFT
    function generateCharacter(uint256 tokenId) public returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Warrior",
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Levels: ",
            getLevels(tokenId),
            "</text>",
            "</svg>"
        );
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    // get the current level of an NFT
    function getLevels(uint256 tokenId) public view returns (string memory) {
        uint256 levels = tokenIdToAttributes[tokenId].level;
        return levels.toString();
    }

    // get the TokenURI of an NFT
    function getTokenURI(uint256 tokenId) public returns (string memory) {
        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Chain Battles #',
            tokenId.toString(),
            '",',
            '"description": "Battles on chain",',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function mint() public {
        _tokenIds.increment();
        uint256 newItemId = _tokenIds.current();
        _safeMint(msg.sender, newItemId);
        Attributes attrs = Attributes(
            random(100),
            random(100),
            random(100),
            random(100)
        );
        tokenIdToAttributes[newItemId] = attrs;
        _setTokenURI(newItemId, getTokenURI(newItemId));
    }

    // train an NFT and raise its level
    function train(uint256 tokenId) public {
        require(_exists(tokenId), "Please use an existing token");
        require(
            ownerOf(tokenId) == msg.sender,
            "You must own this token to train it"
        );
        uint256 currentLevel = tokenIdToAttributes[tokenId].level;
        uint256 currentSpeed = tokenIdToAttributes[tokenId].speed;
        uint256 currentStrength = tokenIdToAttributes[tokenId].strengh;
        uint256 currentLife = tokenIdToAttributes[tokenId].life;
        Attributes attrs = Attributes(
            currentLevel + 1,
            currentSpeed + 1,
            currentStrength + 1,
            currentLife + 1
        );
        tokenIdToAttributes[tokenId] = attrs;
        _setTokenURI(tokenId, getTokenURI(tokenId));
    }

    function random(uint number) public view returns (uint) {
        return
            uint(
                keccak256(
                    abi.encodePacked(
                        block.timestamp,
                        block.difficulty,
                        msg.sender
                    )
                )
            ) % number;
    }
}
