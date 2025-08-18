import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import { ethers } from "ethers";

let web3Modal: Web3Modal | null = null;

function getProviderOptions() {
  const rpcUrl = process.env.NEXT_PUBLIC_ONCHAIN_RPC_URL || process.env.NEXT_PUBLIC_RPC_URL || "";
  const infuraId = process.env.NEXT_PUBLIC_INFURA_ID || process.env.REACT_APP_INFURA_ID || "";

  const providerOptions: any = {};
  providerOptions.walletconnect = {
    package: WalletConnectProvider,
    options: {
      rpc: rpcUrl ? { 1: rpcUrl } : undefined,
      infuraId: infuraId || undefined,
    },
  };

  return providerOptions;
}

export function getWeb3Modal() {
  if (!web3Modal) {
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: getProviderOptions(),
    } as any);
  }
  return web3Modal;
}

export async function connectWallet() {
  const modal = getWeb3Modal();
  const instance = await modal.connect();
  const provider = new ethers.BrowserProvider(instance as any);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, instance, address };
}

export async function disconnectWallet() {
  const modal = getWeb3Modal();
  if (modal) await modal.clearCachedProvider();
}