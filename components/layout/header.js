import { useWallet } from "use-wallet";
import { useEffect, useState } from "react";
import Link from "next/link";

import {
  connectWallet,
  isWalletDisconnected,
  isWalletConnecting,
  isWalletConnected,
  getWalletAddress,
  shortenWalletAddress,
  getWalletConnectionStatus,
} from "../../lib/wallet";

const Header = () => {
  const wallet = useWallet();

  const [prevConnectionStatus, setPrevConnectionStatus] = useState(
    getWalletConnectionStatus(wallet)
  );

  useEffect(() => {
    /**
     * Disable the modal once the user connects or disconnects their wallet.
     */
    const currentConnectionStatus = getWalletConnectionStatus(wallet);

    const isNowConnected =
      prevConnectionStatus === "disconnected" &&
      currentConnectionStatus === "connected";
    const isNowDisconnected =
      prevConnectionStatus === "connected" &&
      currentConnectionStatus === "disconnected";

    if (isNowConnected || isNowDisconnected) {
      setPrevConnectionStatus(currentConnectionStatus);
    }

    /**
     * Call wallet connected callback e.g. route change
     */
    if (isNowConnected) {
      // onConnected();
    }
  });

  return (
    <div className="w-full px-6 flex flex-row justify-between py-4">
      <div className="flex flex-row items-center">
        <Link href="/">
          <a>
            <img src="/logo.png" className="h-12 mr-8" />
          </a>
        </Link>
      </div>
      {!isWalletConnected(wallet) ? (
        <button
          className="rounded-md border flex items-center justify-center h-10 px-4"
          onClick={() => {
            if (isWalletDisconnected(wallet)) {
              connectWallet(wallet, "injected");
            }
          }}
        >
          Connect
        </button>
      ) : (
        <a
          href={`https://etherscan.io/address/${getWalletAddress(wallet)}`}
          rel="noreferrer"
          target="_blank"
        >
          <button className="rounded-md border border-gray-300 flex items-center justify-center h-10 px-4">
            {shortenWalletAddress(getWalletAddress(wallet))}
          </button>
        </a>
      )}
    </div>
  );
};

export default Header;
