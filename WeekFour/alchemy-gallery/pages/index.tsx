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
    if (fetchForCollection) {
      await fetchNFTsForCollection();
    } else {
      await fetchNFTsForWallet();
    }
  };

  const fetchNFTsForWallet = async () => {
    if (!walletAddress) {
      return;
    }
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

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log('fetching nfts for collection owned by address');
      const fetchURL = `${baseURL}?owner=${walletAddress}&contractAddresses%5B%5D=${collectionAddress}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log('nfts:', nfts);
      const transformedNFTs = nfts.ownedNfts.map((nft) => {
        return {
          image: nft.media[0].gateway,
          title: nft.title,
          tokenId: nft.id.tokenId,
          contractAddress: nft.contract.address,
          description: nft.description,
        };
      });
      setNFTs(transformedNFTs);
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
        const transformedNFTs = nfts.nfts.map((nft) => {
          return {
            image: nft.media[0].gateway,
            title: nft.title,
            tokenId: nft.id.tokenId,
            contractAddress: nft.contract.address,
            description: nft.description,
          };
        });
        setNFTs(transformedNFTs);
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
