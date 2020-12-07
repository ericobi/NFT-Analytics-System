import { Network, OpenSeaPort } from "opensea-js";

export const create = (provider, network) => {
  const seaport = new OpenSeaPort(provider, {
    networkName: network === "rinkeby" ? Network.Rinkeby : Network.Main,
  });

  const getAsset = (tokenAddress, tokenId) =>
    seaport.api.getAsset({ tokenAddress, tokenId });

  return {
    getAsset,
  };
};
