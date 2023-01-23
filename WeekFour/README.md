# RTW3 - Week 4 - How to Create an NFT Gallery

Querying the blockchain is not an easy task for a developer. Luckily, using the [Alchemy NFT API](https://docs.alchemy.com/reference/nft-api) one can easily query the blockchain and answer the question: "What NFTs does a wallet own?"

This is what we are going to learn in this post by developing a NFT gallery, in NextJS, that displays NFTs by wallet address and smart contract address.

First of all you will need a [free Alchemy account](https://www.alchemy.com/).

## How to Create an NFT Gallery

We will need to collect the wallet address and/or the NFT collection address from the user.

This is what the final app will look like:

**Pre requisite:**

To develop the app you will need to have node installed on your computer.

### Project Setup

At your command prompt type the following:

```bash
npx create-next-app gallery
```

then go to the created project directory

```bash
cd gallery
```

To startup with a clean project you will need to delete the following auto generated files from the project

#### Alternatively,

you can directly clone or download the startup project from my github repo:

```bash
git clone https://
```

install the dependencies:

```bash
cd gallery
npm install
```

---

now you can run the app:

```bash
npm run dev
```

Browsing to localhost:3000 should render the following page:

### Create a Home Page

Here the code of the home page:

```javascript

```

### Create Two Variables to Store Wallet and Collection Addresses

To store the value of your text inputs inside the "wallet" and "collection" variables, use the "onChange" event handler.

```javascript

```

Now this code works fine but there is a little optimization that can be done.

Anonymous functions for handling the input of wallet and collection addresses will be recreated each time your component re-render.
To avoid that it is better to create functions.

Here is the final code without anonymous functions:

```javascript

```

Check that everything works fine by entering wallet address and collection address.\
Your application should look like this:

Now let's add a button that will trigger the search NFTs functions and a fetchForCollection toggle.
The button will fetch NFTs for collection if the fetchForCollection toggle is checked otherwise it will simply fetch NFTs.

Let's add our button and toggle, here is the code:

```javascript

```

### Create the NFT Card component

```javascript

```

we're displaying 5 properties:

Image
Title
TokenId
Contract Address
Description

To access such properties we can look again at the NFT Object:

### Create the FetchNFTs functions

Now let's implement the functions that will fetch NFTs.

```javascript
const fetchNFTs = async () => {
  let nfts;
  console.log('fetching nfts');
  const api_key = 'A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM';
  const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
  var requestOptions = {
    method: 'GET',
  };

  if (!collection.length) {
    const fetchURL = `${baseURL}?owner=${wallet}`;

    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
  } else {
    console.log('fetching nfts for collection owned by address');
    const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
  }

  if (nfts) {
    console.log('nfts:', nfts);
    setNFTs(nfts.ownedNfts);
  }
};
```

The function is define using the async/await pattern

Now let's implement the function that will fetch NFTs by collection

```javascript
const fetchNFTsForCollection = async () => {
  if (collection.length) {
    var requestOptions = {
      method: 'GET',
    };
    const api_key = 'A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM';
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
    const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${'true'}`;
    const nfts = await fetch(fetchURL, requestOptions).then((data) =>
      data.json()
    );
    if (nfts) {
      console.log('NFTs in collection:', nfts);
      setNFTs(nfts.nfts);
    }
  }
};
```

### Trigger the FetchNFTs and FetchNFTsByCollection Functions
