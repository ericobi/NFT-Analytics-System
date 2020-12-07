import { providers as EthersProviders } from "ethers";
import Web3 from "web3";
import { create as createOpensea } from "../lib/opensea";
import { create as createVillians } from "../lib/villains";
import { create as createRari } from "../lib/rariable";

const chains = {
  testnet: {},
  mainnet: {
    villains: "0xe3782B8688ad2b0D5ba42842d400F7AdF310F88d",
    rari: "0x8280D56Ac92b5bFF058d60c99932FDEcDCc9441a",
    weth: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
    usdc: "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48",
    usdt: "0xdac17f958d2ee523a2206206994597c13d831ec7",
    dai: "0x6b175474e89094c44da98b954eedeac495271d0f",
    link: "0x514910771af9ca656af840dff83e8264ecf986ca",
    wbtc: "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599",
  },
};

/**
 * Switch between the two for testing / production.
 */
const addresses = { ...chains.mainnet };

export function useContracts() {
  const provider = new Web3.providers.HttpProvider(
    "https://eth-mainnet.alchemyapi.io/v2/cVQWBBi-SmHIeEpek2OmH5xgevUvElob"
  );

  const web3Provider = new EthersProviders.AlchemyProvider(
    "homestead",
    "cVQWBBi-SmHIeEpek2OmH5xgevUvElob"
  );

  const signer = web3Provider ? web3Provider : null;

  const opensea = createOpensea(provider, "mainnet");

  const villians = createVillians(addresses.villains, signer);
  const rari = createRari(addresses.rari, signer);

  return {
    web3Provider,
    opensea,
    villians,
    rari,
    contracts: [
      addresses.weth,
      addresses.usdc,
      addresses.usdt,
      addresses.dai,
      addresses.link,
      addresses.wbtc,
    ],
  };
}
