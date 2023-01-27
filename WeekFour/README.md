# RTW3 - Week 4 - How to Create an NFT Gallery

Querying the blockchain is not an easy task for a developer. Luckily, using the [Alchemy NFT API](https://docs.alchemy.com/reference/nft-api) one can easily query the blockchain and answer the question: "What NFTs does a wallet own?"

This is what we are going to learn in this post by developing a NFT gallery, in NextJS, TypeScript and the Alchemy api, that displays NFTs by wallet address and smart contract address.

First of all you will need a [free Alchemy account](https://www.alchemy.com/).

## How to Create an NFT Gallery

**Pre requisite:**

To develop the app you will need to have NodeJS installed on your computer.

### Project Setup

At your command prompt type the following:

```bash
npx create-next-app gallery
```

then go to the created project directory

```bash
cd gallery
```

delete the following files and folders from the newly created projects:

```bash
rm -rf pages/api pages/index.tsx styles/Home.module.css
```

and create a new index.tsx file

```bash
touch pages/index.tsx
```

with the following content inside:

```javascript
const HomePage = () => {
  return (
    <div>
      <h1>The Home Page</h1>
    </div>
  );
};

export default HomePage;
```

#### Alternatively,

you can directly clone or download the startup project from my github repo:

```bash
git clone https://github.com/davdotsol/startup-next-ts-template.git gallery
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

![rendering of the starter app](startup.png?raw=true)

This is what the final app will look like:

But first let's create our home page.\

### Create a Home Page

We will need some input fields to collect the wallet address and/or the NFT collection address from the user. We will also need a checbox to tell wether we want to fetch the NFTs only for the collection address entered.\
Once we have the addresses we will query the Alchemy NFT api to fetch the NFTs at the entered addresses.
Here is the complete code of the home page with the css styles:

```javascript
const HomePage = () => {
  return (
    <div>
      <div className="search-box">
        <form>
          <div className="search-box__controls">
            <div className="search-box__control text">
              <input type="text" placeholder="Enter your wallet address" />
            </div>
            <div className="search-box__control text">
              <input type="text" placeholder="Enter the collection address" />
            </div>
            <div className="search-box__control checkbox">
              <label>Fetch for collection</label>
              <input type="checkbox" />
            </div>
          </div>
          <div className="search-box__actions">
            <button type="submit">Let's go!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
```

Add the following css inside your styles/global.css file

```css
* {
  box-sizing: border-box;
}

html {
  font-family: 'Noto Sans JP', sans-serif;
}

body {
  margin: 0;
  background-color: #3f3f3f;
}

.search-box {
  padding: 1rem;
  margin: 2rem auto;
  max-width: 95%;
  text-align: center;
}

.search-box button {
  font: inherit;
  cursor: pointer;
  padding: 1rem 2rem;
  border: 1px solid #40005d;
  background-color: #40005d;
  color: white;
  border-radius: 12px;
  margin-right: 1rem;
}

.search-box button:hover,
.search-box button:active {
  background-color: #510674;
  border-color: #510674;
}

.search-box__controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.search-box__control.text input {
  font: inherit;
  outline: none;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 25rem;
  max-width: 100%;
  line-height: 2rem;
}

.search-box__control.checkbox label {
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}
```

Now that we have the foundation let's start to add some logic

### Create Two Variables to Store Wallet and Collection Addresses

To store the value of your text inputs inside the "wallet" and "collection" variables, use "onChange" events with the correct react types as we are using TypeScript.\
\
We also add the code to handle the form submit that will trigger the search NFTs functions and a fetchForCollection toggle.\
The button will trigger the form submit to fetch NFTs for collection if the fetchForCollection toggle is checked otherwise it will fetch NFTs for the wallet address only or for the wallet address and the collection address if the field is not empty.\
\
Here is the complete code with the form submit:

```javascript
import { ChangeEvent, FormEvent, useState } from 'react';

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [walletInputDisabled, setWalletInputDisabled] = useState(false);

  const onWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const onCollectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCollectionAddress(event.target.value);
  };

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFetchForCollection(checked);
    setWalletInputDisabled(checked);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log(walletAddress);
    console.log(collectionAddress);
  };

  return (
    <div>
      <div className="search-box">
        <form onSubmit={submitHandler}>
          <div className="search-box__controls">
            <div className="search-box__control text">
              <input
                onChange={onWalletChange}
                type="text"
                placeholder="Enter your wallet address"
                disabled={walletInputDisabled}
              />
            </div>
            <div className="search-box__control text">
              <input
                onChange={onCollectionChange}
                type="text"
                placeholder="Enter the collection address"
              />
            </div>
            <div className="search-box__control checkbox">
              <label>Fetch for collection</label>
              <input type="checkbox" onChange={onCheckboxChange} />
            </div>
          </div>
          <div className="search-box__actions">
            <button type="submit">Let's go!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
```

Check that everything works fine by entering wallet address and collection address and looking at the console logs.

Now let's fetch some NFTs

### Create the FetchNFTs function

First you will need to create a new app on the Alchemy Platform.

Selecting the Ethereum mainnet will allow you to fetch NFTs only from Ethereum.

If you want to fetch NFTs on Polygon or other chains, you'll need to create a new application with the respective chain and change the base URL to reflect the chain you want to use, for example, Polygon's URL would be: https://polygon-mumbai.g.alchemy.com/v2/YOUR-API-KEY

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
    const fetchURL = `${baseURL}?owner=${walletAddress}`;

    nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
  } else {
    console.log('fetching nfts for collection owned by address');
    const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
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
    const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${'true'}`;
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

Those functions will be triggered by the form submit button:

Here is the complete code:

```javascript
import { ChangeEvent, FormEvent, useState } from 'react';

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [fetchForCollection, setFetchForCollection] = useState(false);

  const [walletInputDisabled, setWalletInputDisabled] = useState(false);

  const onWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const onCollectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCollectionAddress(event.target.value);
  };

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFetchForCollection(checked);
    setWalletInputDisabled(checked);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetchNFTs();
  };

  const fetchNFTs = async () => {
    if (!collectionAddress && !walletAddress) {
      return;
    }

    if (fetchForCollection) {
      await fetchNFTsForCollection();
    } else {
      let nfts;
      console.log('fetching nfts');
      const api_key = 'A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM';
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
      var requestOptions = {
        method: 'GET',
      };
      if (!collectionAddress.length) {
        console.log('fetching nfts for wallet only');
        const fetchURL = `${baseURL}?owner=${walletAddress}`;

        nfts = await fetch(fetchURL, requestOptions).then((data) =>
          data.json()
        );
      } else {
        if (walletAddress) {
          console.log('fetching nfts for collection owned by address');
          const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
          nfts = await fetch(fetchURL, requestOptions).then((data) =>
            data.json()
          );
        }
      }

      if (nfts) {
        console.log('nfts:', nfts);
      }
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collectionAddress.length) {
      console.log('fetching nfts for collection only');
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
      }
    }
  };

  return (
    <div>
      <div className="search-box">
        <form onSubmit={submitHandler}>
          <div className="search-box__controls">
            <div className="search-box__control text">
              <input
                onChange={onWalletChange}
                type="text"
                placeholder="Enter your wallet address"
                disabled={walletInputDisabled}
              />
            </div>
            <div className="search-box__control text">
              <input
                onChange={onCollectionChange}
                type="text"
                placeholder="Enter the collection address"
              />
            </div>
            <div className="search-box__control checkbox">
              <label>Fetch for collection</label>
              <input type="checkbox" onChange={onCheckboxChange} />
            </div>
          </div>
          <div className="search-box__actions">
            <button type="submit">Let's go!</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HomePage;
```

Notice the use of the Alchemy API functions getNFTs and getNFTsForCollection and how the url for the fetch functions are built.

### Create the NFT Card component

We want to display 5 properties:

- Image
- Title
- TokenId
- Contract Address
- Description

To access such properties have a look again at the NFT Object returned by the getNFTs and getNFTsForCollection api calls.

This is an example of the json returned for nfts:

```json
{
    "ownedNfts": [
        {
            "contract": {
                "address": "0x0beed7099af7514ccedf642cfea435731176fb02"
            },
            "id": {
                "tokenId": "28",
                "tokenMetadata": {
                    "tokenType": "ERC721"
                }
            },
            "title": "DuskBreaker #28",
            "description": "Breakers have the honor of serving humanity through their work on The Dusk. They are part of a select squad of 10,000 recruits who spend their days exploring a mysterious alien spaceship filled with friends, foes, and otherworldly technology.",
            "tokenUri": {
                "raw": "https://duskbreakers.gg/api/breakers/28",
                "gateway": "https://duskbreakers.gg/api/breakers/28"
            },
            "media": [
                {
                    "raw": "https://duskbreakers.gg/breaker_images/28.png",
                    "gateway": "https://duskbreakers.gg/breaker_images/28.png"
                }
            ],
            "metadata": {
                "name": "DuskBreaker #28",
                "description": "Breakers have the honor of serving humanity through their work on The Dusk. They are part of a select squad of 10,000 recruits who spend their days exploring a mysterious alien spaceship filled with friends, foes, and otherworldly technology.",
                "image": "https://duskbreakers.gg/breaker_images/28.png",
                "external_url": "https://duskbreakers.gg",
                "attributes": [
                    {
                        "value": "Locust Rider Armor (Red)",
                        "trait_type": "Clothes"
                    },
                    ......
                    {
                        "value": "Big Smile (Purple)",
                        "trait_type": "Mouth"
                    },
                    {
                        "value": "Yellow",
                        "trait_type": "Background"
                    }
                ]
            },
            "timeLastUpdated": "2022-02-16T22:52:54.719Z"
        },
        ......
    ],
    "totalCount": 6,
    "blockHash": "0xeb2d26af5b6175344a14091777535a2cb21c681665a734a8285f889981987630"
}
```

We can now create our NFT type right above our App component and update our code so that we can set the NFTs to display:

Here is the complete final code:

```javascript
import { ChangeEvent, FormEvent, useState } from 'react';

type NFT = {
  image: string;
  title: string;
  tokenId: string;
  contractAddress: string;
  description: string;
};

const HomePage = () => {
  const [walletAddress, setWalletAddress] = useState('');
  const [collectionAddress, setCollectionAddress] = useState('');
  const [fetchForCollection, setFetchForCollection] = useState(false);
  const [NFTs, setNFTs] = useState<NFT[]>([]);
  const [walletInputDisabled, setWalletInputDisabled] = useState(false);

  const onWalletChange = (event: ChangeEvent<HTMLInputElement>) => {
    setWalletAddress(event.target.value);
  };

  const onCollectionChange = (event: ChangeEvent<HTMLInputElement>) => {
    setCollectionAddress(event.target.value);
  };

  const onCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked;
    setFetchForCollection(checked);
    setWalletInputDisabled(checked);
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await fetchNFTs();
  };

  const fetchNFTs = async () => {
    if (!collectionAddress && !walletAddress) {
      return;
    }

    if (fetchForCollection) {
      await fetchNFTsForCollection();
    } else {
      let nfts;
      console.log('fetching nfts');
      const api_key = 'A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM';
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
      var requestOptions = {
        method: 'GET',
      };
      if (!collectionAddress.length) {
        console.log('fetching nfts for wallet only');
        const fetchURL = `${baseURL}?owner=${walletAddress}`;

        nfts = await fetch(fetchURL, requestOptions).then((data) =>
          data.json()
        );
      } else {
        if (walletAddress) {
          console.log('fetching nfts for collection owned by address');
          const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
          nfts = await fetch(fetchURL, requestOptions).then((data) =>
            data.json()
          );
        }
      }

      if (nfts) {
        console.log('nfts:', nfts);
        setNFTs(nfts.ownedNfts);
      }
    }
  };

  const fetchNFTsForCollection = async () => {
    if (collectionAddress.length) {
      console.log('fetching nfts for collection only');
      var requestOptions = {
        method: 'GET',
      };
      const api_key = 'A8A1Oo_UTB9IN5oNHfAc2tAxdR4UVwfM';
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collectionAddress}&withMetadata=${'true'}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log('NFTs in collection:', nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <div>
      <div className="search-box">
        <form onSubmit={submitHandler}>
          <div className="search-box__controls">
            <div className="search-box__control text">
              <input
                onChange={onWalletChange}
                type="text"
                placeholder="Enter your wallet address"
                disabled={walletInputDisabled}
              />
            </div>
            <div className="search-box__control text">
              <input
                onChange={onCollectionChange}
                type="text"
                placeholder="Enter the collection address"
              />
            </div>
            <div className="search-box__control checkbox">
              <label>Fetch for collection</label>
              <input type="checkbox" onChange={onCheckboxChange} />
            </div>
          </div>
          <div className="search-box__actions">
            <button type="submit">Let's go!</button>
          </div>
        </form>
      </div>
      <ul className="card-list">
        {NFTs.map((nft) => (
          <li key={nft.tokenId} className="card-container">
            <img alt={nft.description} src={nft.image} />
            <h2>{nft.title}</h2>
            <p>{nft.contractAddress}</p>
            <p>{nft.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;

```

And the complete css style:

```css
* {
  box-sizing: border-box;
}

html {
  font-family: 'Noto Sans JP', sans-serif;
}

body {
  margin: 0;
  background-color: #3f3f3f;
}

.search-box {
  padding: 1rem;
  margin: 2rem auto;
  max-width: 95%;
  text-align: center;
}

.search-box button {
  font: inherit;
  cursor: pointer;
  padding: 1rem 2rem;
  border: 1px solid #40005d;
  background-color: #40005d;
  color: white;
  border-radius: 12px;
  margin-right: 1rem;
}

.search-box button:hover,
.search-box button:active {
  background-color: #510674;
  border-color: #510674;
}

.search-box__controls {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 1rem;
  text-align: center;
}

.search-box__control.text input {
  font: inherit;
  outline: none;
  padding: 0.5rem;
  border-radius: 6px;
  border: 1px solid #ccc;
  width: 25rem;
  max-width: 100%;
  line-height: 2rem;
}

.search-box__control.checkbox label {
  color: white;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: block;
}

.card-list {
  width: 115rem;
  max-width: 95%;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-gap: 20px;
}

.card-container {
  display: flex;
  flex-direction: column;
  border: 1px solid #ececec;
  background-color: #2a2a2a;
  color: white;
  border-radius: 5px;
  padding: 25px;
  cursor: pointer;
  transform: translateZ(0);
  transition: transform 0.25s ease-out;
}

.card-container:hover {
  transform: scale(1.05);
}
```

### Visit [Alchemy Road To Web 3 - Week 4](https://docs.alchemy.com/docs/how-to-create-an-nft-gallery) for the full tutorial
