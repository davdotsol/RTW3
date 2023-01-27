# RTW3 - Week 3 - Develop an NFT with On-Chain Metadata using Hardhat

The purpose of storing the metadata on-chain is to allow your smart contract to update your metadata, this is usefull for game as an example.

Here is what the tutorial is about:

- How to store NFTs metadata on chain
- What is Polygon and why it's important to lower Gas fees.
- How to deploy on Polygon Mumbai
- How to process and store on-chain SVG images and JSON objects
- How to modify your metadata based on your interactions with the NFT

Polygon for example comes with 2 main advantages:

- Faster transactions (65,000 tx/seconds vs ~14)
- Approximately ~10,000x lower gas costs per transaction than Ethereum

Let's setup our project using npm

```
mdkir ChainBattles
cd ChainBattles
npm init -y
npm install --save-dev hardhat
npx hardhat init
```

Install the [OpenZeppelin](https://docs.openzeppelin.com/contracts/4.x/api/token/erc721) library

```
npm install @openzeppelin/contracts
```

Let's now update the hardhat.config.js file to connect with Polygon Mumbai and polygon scan

```
require('@nomicfoundation/hardhat-toolbox');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: '0.8.10',
  networks: {
    mumbai: {
      url: process.env.TESTNET_RPC,
      accounts: [process.env.PRIVATE_KEY],
    },
  },
};
```

## Develop the Smart Contract

In the contracts folder, create a new file and call it "ChainBattles.sol".

```
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
```

## Deploy the NFTs with On-Chain Metadata Smart Contract

In the root folder create a `.env` file

```
TESTNET_RPC=""
PRIVATE_KEY=""
POLYGONSCAN_API_KEY=""
```

Then create a new application on the [alchemy platform](https://dashboard.alchemy.com) by choosing the Polygon Mumbai network.
Copy the API HTTP URL and paste it in the `.env` file accordingly.
Copy your wallet private key and paste in in the `.env` file accordingly.
Finally go to [polygonscan.com](https://polygonscan.com/), create a new account if needed, get the api key and paste it in the `.env` file accordingly.

## Create the Deployment Script

Create a file `scripts/deploy.js` with the following content.

```
// scripts/deploy.js

const hre = require('hardhat');

const main = async () => {
  try {
    const nftContractFactory = await hre.ethers.getContractFactory(
      "ChainBattles"
    );
    const nftContract = await nftContractFactory.deploy();
    await nftContract.deployed();

    console.log("Contract deployed to:", nftContract.address);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

main();
```

## Compile and Deploy the smart contract

```
npx hardhat compile
npx hardhat run scripts/deploy.js --network mumbai
```

## Check your smart contract on Polygon Scan

```
npx hardhat verify --network mumbai YOUR_SMARTCONTRACT_ADDRESS
```

Copy the address of the just deployed smart contract, go to mumbai.polygonscan.com, and paste the address of the smart contract in the search bar.
Go to the "contract" tab and if the contract is verified you should be able to interact with it by connecting your wallet.

Look for the "mint" function and click on Write

Approve the transaction from your wallet.

Now let's move to [https://testnets.opensea.io/](https://testnets.opensea.io/) to view your just minted dynamic NFT.

You can view mine here [https://testnets.opensea.io/fr/assets/mumbai/0xbc683d8d0f0e2d92bcdba413c60b87d69aabc274/1](https://testnets.opensea.io/fr/assets/mumbai/0xbc683d8d0f0e2d92bcdba413c60b87d69aabc274/1)

## Update the Dynamic NFT Image Training The NFT

Navigate back to mumbai.polygonscan.com, click on the contract tab > Write Contract and look for the "train" function with the id of the NFT (1).

View the image update on [https://testnets.opensea.io/](https://testnets.opensea.io/)

### Visit [Alchemy Road To Web 3 - Week 3](https://docs.alchemy.com/docs/how-to-make-nfts-with-on-chain-metadata-hardhat-and-javascript) for the full tutorial
