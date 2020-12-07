import { useEffect, useState } from "react";
import axios from "axios";
import { utils } from "ethers";
import { useContracts } from "../hooks/useContracts";
import Card from "../components/common/card";
import useInterval from "../hooks/useInterval";
import { usePrice } from "../hooks/usePrice";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const successfulAxios = (url, config) => {
  let result = {};
  return new Promise(async (resolve) => {
    result = await axios.get(url, config).catch(() => {});
    if (result && result.status === 200) {
      resolve(result);
    }
  });
};

function useLocalStorageState(defaultValue, key) {
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    const store = window.localStorage.getItem(key);

    if (store !== null) {
      setValue(JSON.parse(store));
    }
  }, [key]);

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}

const Dashboard = () => {
  const { villians, rari, contracts } = useContracts();
  const { ethUSD, linkUSD, btcUSD } = usePrice();

  const [isUpdatingNFTs, setUpdatingNFTs] = useState(false);
  const [images, setImages] = useLocalStorageState([], "nft-images");
  const [names, setNames] = useLocalStorageState([], "nft-names");

  const [selected, setSelected] = useState(0);

  const [data, setData] = useState({});

  const [holders, setHolders] = useState([]);
  const balanceCache = [];
  const [offset, setOffset] = useState(0);
  const [isLoadingFinished, setLoadingFinished] = useState(false);
  const [isDataLoading, setDataLoading] = useState(false);
  const limit = 10;

  const getTotalBalanceInUSD = async (address) => {
    const result = await axios.post(
      "https://eth-mainnet.alchemyapi.io/v2/cVQWBBi-SmHIeEpek2OmH5xgevUvElob",
      {
        jsonrpc: "2.0",
        method: "alchemy_getTokenBalances",
        params: [address, contracts],
        id: 42,
      }
    );
    const tokenBalances = result.data.result.tokenBalances.map(
      ({ tokenBalance, contractAddress }) => {
        const index = contracts.findIndex((s) => s === contractAddress);
        if (index === 0) {
          return parseFloat(utils.formatEther(tokenBalance)) * ethUSD;
        } else if (index === 3) {
          return parseFloat(utils.formatEther(tokenBalance));
        } else if (index === 1 || index === 2) {
          return parseFloat(utils.formatUnits(tokenBalance, 6));
        } else if (index === 4) {
          return parseFloat(utils.formatEther(tokenBalance)) * linkUSD;
        } else {
          return parseFloat(utils.formatUnits(tokenBalance, 8)) * btcUSD;
        }
      }
    );

    const result1 = await axios.post(
      "https://eth-mainnet.alchemyapi.io/v2/cVQWBBi-SmHIeEpek2OmH5xgevUvElob",
      {
        jsonrpc: "2.0",
        method: "eth_getBalance",
        params: [address, "latest"],
        id: 0,
      }
    );
    const eth = parseFloat(utils.formatEther(result1.data.result)) * ethUSD;

    return tokenBalances.reduce((a, b) => a + b, 0) + eth;
  };

  const contractAddr = [
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
  ];
  const tokenIds = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    1,
    2,
    5,
    6,
    7,
    8,
    9,
    11,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
  ];

  useInterval(() => {
    async function loadEvents() {
      if (isLoadingFinished || isDataLoading) return;

      if (names.length === 0 || images.length === 0) return;

      const newHolders = [];
      const result = await successfulAxios(
        `https://api.opensea.io/api/v1/events/?asset_contract_address=${contractAddr[selected]}&token_id=${tokenIds[selected]}&event_type=transfer&offset=${offset}&limit=${limit}`,
        {
          headers: {
            "X-API-KEY": "e1f8f233107a4296a995a29b668d9fbd",
          },
        }
      );
      if (result && result.data && result.data.asset_events) {
        if (result.data.asset_events.length === 0) {
          setLoadingFinished(true);
          return;
        }
        setDataLoading(true);

        const amounts = await (contractAddr[selected] ===
        "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d"
          ? villians
          : rari
        ).balanceOfBatch(
          result.data.asset_events.map(({ to_account }) => to_account.address),
          new Array(result.data.asset_events.length).fill(tokenIds[selected])
        );

        result.data.asset_events.forEach(
          ({ created_date, to_account }, index) => {
            if (
              amounts[index].toNumber() > 0 &&
              newHolders.findIndex(
                ({ address }) => address === to_account.address
              ) === -1
            ) {
              newHolders.push({
                address: to_account.address,
                timestamp: created_date,
                amount: amounts[index].toNumber(),
                tokenId: tokenIds[selected],
                contractAddress: contractAddr[selected],
              });
            }
          }
        );

        for (let i = 0; i < newHolders.length; i++) {
          const index = balanceCache.findIndex(
            ({ address }) => address === newHolders[i].address
          );
          if (index >= 0) {
            newHolders[i].balance = balanceCache[index].balance;
          } else {
            const amount = await getTotalBalanceInUSD(newHolders[i].address);
            newHolders[i].balance = Math.round(amount);
            balanceCache.push({
              address: newHolders[i].address,
              balance: newHolders[i].balance,
            });
          }
        }

        setHolders((cHolders) => {
          const currentHolders = cHolders.slice();
          for (let i = 0; i < currentHolders.length; i++) {
            const index = newHolders.findIndex(
              ({ address }) => address === currentHolders[i].address
            );
            if (index >= 0) {
              if (currentHolders[i].amount < newHolders[index].amount) {
                currentHolders[i].amount = newHolders[index].amount;
              }

              newHolders.splice(index, 1);
            }
          }
          return [...currentHolders, ...newHolders];
        });

        setOffset((offset) => offset + limit);
        setDataLoading(false);
      }
    }

    loadEvents();
  }, 6000);

  useEffect(() => {
    if (data[selected]) {
      // recover data immediately and continue fetching data
      setHolders(data[selected].holders);
      setOffset(data[selected].offset);
      setLoadingFinished(data[selected].isLoadingFinished);
    } else {
      setOffset(0);
      setHolders([]);
      setLoadingFinished(false);
    }
  }, [selected]);

  useInterval(() => {
    async function updateLiveInfo() {
      if (names.length > 0 || images.length > 0) return;

      if (isUpdatingNFTs) return;

      setUpdatingNFTs(true);
      const result = [];
      for (let index = 0; index < tokenIds.length; index++) {
        const res = await successfulAxios(
          `https://api.opensea.io/api/v1/assets/?token_ids=${tokenIds[index]}&asset_contract_addresses=${contractAddr[index]}`,
          {
            headers: {
              "X-API-KEY": "e1f8f233107a4296a995a29b668d9fbd",
            },
          }
        );
        result.push(res);
      }

      if (result.length === tokenIds.length) {
        setNames(result.map(({ data: { assets } }) => assets[0].name));
        setImages(
          result.map(({ data: { assets } }) => assets[0].image_thumbnail_url)
        );
      }

      setUpdatingNFTs(false);
    }

    updateLiveInfo();
  }, 2000);

  return (
    <div className="w-full">
      <div className="flex flex-row">
        <div
          className="w-1/5 overflow-y-auto scrolling-touch"
          style={{ height: "calc(100vh - 5rem)" }}
        >
          <div className="h-full flex flex-col">
            {images.map((url, index) => (
              <Card
                image={url}
                preview={true}
                key={url}
                name={names[index]}
                isSelect={index === selected}
                onClick={() => {
                  if (!data[selected]) {
                    setData({
                      ...data,
                      [selected]: {
                        holders,
                        offset,
                        isLoadingFinished,
                      },
                    });
                  }
                  setSelected(index);
                }}
              />
            ))}
            {images.length === 0 && (
              <div className="w-full h-20 flex items-center justify-center">
                Loading...
              </div>
            )}
          </div>
        </div>
        <div className="w-4/5">
          <div
            className="px-8 scrolling-touch overflow-auto"
            style={{ height: "calc(100vh - 5rem)" }}
          >
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Address</th>
                  <th>Timestamp</th>
                  <th>Contract</th>
                  <th>TokenId</th>
                  <th>Amount</th>
                  <th>Property</th>
                </tr>
              </thead>
              <tbody>
                {holders.map(
                  ({ address, timestamp, amount, balance, contractAddress, tokenId }, index) => (
                    <tr key={address}>
                      <td>{index + 1}</td>
                      <td>{address}</td>
                      <td>{timestamp}</td>
                      <td>{contractAddress}</td>
                      <td>{tokenId}</td>
                      <td>{amount}</td>
                      <td>{balance}</td>
                    </tr>
                  )
                )}
                {!isLoadingFinished && (
                  <tr className="text-center">
                    <td colSpan="7">Loading ...</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
