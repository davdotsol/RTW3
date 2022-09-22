# RTW3 - Week 1 - Develop an NFT Smart Contract (ERC721)

## Create the NFT Smart Contract

Create a simple NFT Smart Contract using [OpenZeppelin Wizard](https://docs.openzeppelin.com/contracts/4.x/wizard)

Here is mine with just a few clicks, amazing!

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts@4.7.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.7.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.7.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.7.3/utils/Counters.sol";

contract DavDotSol is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("DavDotSol", "DDS") {}

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
```

From the Wizard, you can directly open the generated smart contract code inside the [Remix IDE](https://remix.ethereum.org/) to edit, compile and deploy it. Pretty cool!

## Edit the NFT Smart Contract

Directly inside the Remix IDE, I simply removed the `Ownable` declaration and library import and the `onlyOwner` modifier so that anybody will be able to mint his own NFTs.

Then I added a variable `MAX_SUPPLY` and a require statement inside the `safeMint` function to limit the number of NFTs to be minted to 100.

Finally I added a limit to the number of NFTs per user to be minted to 5 NFTs per user.
For that I created a mapping from type `address` representing the user to type `Counters.Counter` the counter to increment and check in a require statement each time the `safeMint` function is called.

## Deployment on the Goerli Testnet

For that you can create and account on the [Alchemy Platform](https://Alchemy.com), create an app by choosing the Goerli Testnet and then get the url to access a node on the Testnet.

For the deployment you will need to ether, you can get some from this [Goerli faucet](https://goerlifaucet.com/)

Configure your MetaMask wallet to add the Goerli testnet with the url you got from the Alchemy Platform and select it as your current network.

From Remix you can then compile your contract and deploy it using Injected Web3. You should see that Remix is connected to Goerli, your wallet address and the amount of token you dispose on your account.

Finally just click on deploy in the Remix IDE, confirm the transaction and voilà! Your contract should be deployed on the Goerli Testnet. You can check on [Etherscan](https://goerli.etherscan.io/).

You can view mine here https://goerli.etherscan.io/address/0x0833ce08058f55a826d1e0236de4ebb38c4d406e

## Mint the NFT

For that you can go to [filebase.com](https://filebase.com) or [pinata.cloud](https://www.pinata.cloud/) to upload the image of the NFT and the associated metadata.

Here is a example of some metadata in json format for my NFT:

```
{
  "description": "This NFT proves I've created and deployed my first ERC721 smart contract on Goerli with Alchemy Road to Web3",
  "external_url": "Alchemy.com/?a=roadtoweb3weekone",
  "image": "https://ipfs.filebase.io/ipfs/QmQLurpvCE8iS1o6Bg5ELesg2AeXCfL9EACW45oMx9KyCf",
  "name": "A cool NFT",
  "attributes": [
    {
      "trait_type": "Base",
      "value": "Starfish"
    },
    {
      "trait_type": "Eyes",
      "value": "Big"
    },
    {
      "trait_type": "Mouth",
      "value": "Surprised"
    },
    {
      "trait_type": "Level",
      "value": 5
    },
    {
      "trait_type": "Stamina",
      "value": 1.4
    },
    {
      "trait_type": "Personality",
      "value": "Sad"
    },
    {
      "display_type": "boost_number",
      "trait_type": "Aqua Power",
      "value": 40
    },
    {
      "display_type": "boost_percentage",
      "trait_type": "Stamina Increase",
      "value": 10
    },
    {
      "display_type": "number",
      "trait_type": "Generation",
      "value": 2
    }
  ]
}

```

Once it is uploaded copy the metadata CID, go to the remix IDE and use the safeMint function with a wallet address and the CID (ipfs://\<CID\>) to mint the NFT. Confirm the transaction and once the transaction completed you will be able to see your NFT deployed on [testnets.opensea.io](https://testnets.opensea.io).

It is also possible to see the NFT in [goerli.pixxiti.com](https://goerli.pixxiti.com/) and it is also possible to deploy the NFT Smart Contract using Mumbai and to view the NFT in [testnets.opensea.io](https://testnets.opensea.io).

I can view mine here https://goerli.pixxiti.com/nfts/0x0833ce08058f55a826d1e0236de4ebb38c4d406e/0

and here https://testnets.opensea.io/assets/goerli/0x0833ce08058f55a826d1e0236de4ebb38c4d406e/0

### Visit [Alchemy Road To Web 3 - Week 1](https://docs.alchemy.com/docs/how-to-develop-an-nft-smart-contract-erc721-with-alchemy) for the full tutorial
