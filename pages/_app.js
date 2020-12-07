import { UseWalletProvider } from "use-wallet";
import { positions, Provider } from "react-alert";
import AlertTemplate from "react-alert-template-basic";
import Header from "../components/layout/header";

const options = {
  timeout: 2000,
  position: positions.BOTTOM_CENTER,
};

import "../styles/main.css";

export default function MyApp({ Component, pageProps }) {
  return (
    <UseWalletProvider
      chainId={1}
      connectors={{
        walletconnect: { rpcUrl: "https://mainnet.eth.aragon.network/" },
      }}
    >
      <div className="min-h-screen bg-cover bg-no-repeat bg-center">
        <Header />
        <Provider template={AlertTemplate} {...options}>
          <Component {...pageProps} />
        </Provider>
      </div>
    </UseWalletProvider>
  );
}
