import { ethers } from "ethers";

let web3Modal: any = null;

async function getProviderOptions() {
  const rpcUrl = (import.meta as any).env?.VITE_ONCHAIN_RPC_URL || "";
  const infuraId = (import.meta as any).env?.VITE_INFURA_ID || "";

  const providerOptions: any = {};

  try {
    const WalletConnectProvider = (await import("@walletconnect/web3-provider")).default;
    providerOptions.walletconnect = {
      package: WalletConnectProvider,
      options: {
        rpc: rpcUrl ? { 1: rpcUrl } : undefined,
        infuraId: infuraId || undefined,
      },
    };
  } catch (e) {
    console.warn("WalletConnect provider not available:", e);
  }

  return providerOptions;
}

export async function getWeb3Modal() {
  if (!web3Modal) {
    const Web3Modal = (await import("web3modal")).default;
    web3Modal = new Web3Modal({
      cacheProvider: true,
      providerOptions: await getProviderOptions(),
    } as any);
  }
  return web3Modal;
}

export async function connectWallet() {
  const modal = await getWeb3Modal();
  const instance = await modal.connect();
  const provider = new ethers.BrowserProvider(instance as any);
  const signer = await provider.getSigner();
  const address = await signer.getAddress();
  return { provider, signer, instance, address };
}

export async function disconnectWallet() {
  const modal = await getWeb3Modal();
  if (modal) await modal.clearCachedProvider();
}
