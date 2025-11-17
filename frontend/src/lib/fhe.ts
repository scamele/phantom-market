import { getAddress, hexlify } from "ethers";

declare global {
  interface Window {
    RelayerSDK?: any;
    relayerSDK?: any;
    ethereum?: any;
    okxwallet?: any;
  }
}

let fhevmInstance: any = null;

const getSDK = () => {
  if (typeof window === "undefined") {
    throw new Error("FHE SDK requires browser environment.");
  }

  const sdk = window.RelayerSDK || window.relayerSDK;
  if (!sdk) {
    throw new Error("Relayer SDK not loaded. Ensure the script tag is included.");
  }

  return sdk;
};

const getBrowserWallet = () => {
  if (typeof window === "undefined") return null;
  return window.ethereum || window.okxwallet?.provider || window.okxwallet || null;
};

export const initializeFHE = async (provider?: any) => {
  if (fhevmInstance) {
    return fhevmInstance;
  }

  const walletProvider = provider || getBrowserWallet();
  if (!walletProvider) {
    throw new Error("No wallet provider detected. Connect your wallet first.");
  }

  const sdk = getSDK();
  const { initSDK, createInstance, SepoliaConfig } = sdk;

  try {
    await initSDK();

    // Ensure we're on the correct network
    const chainId = await walletProvider.request({ method: 'eth_chainId' });
    const sepoliaChainId = '0xaa36a7';

    if (chainId !== sepoliaChainId) {
      // Automatically switch to Sepolia testnet
      try {
        await walletProvider.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: sepoliaChainId }],
        });
      } catch (switchError: any) {
        // If the network doesn't exist, add it
        if (switchError.code === 4902) {
          try {
            await walletProvider.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: sepoliaChainId,
                  chainName: 'Sepolia Testnet',
                  nativeCurrency: {
                    name: 'SepoliaETH',
                    symbol: 'ETH',
                    decimals: 18,
                  },
                  rpcUrls: ['https://ethereum-sepolia-rpc.publicnode.com'],
                  blockExplorerUrls: ['https://sepolia.etherscan.io'],
                },
              ],
            });
          } catch (addError: any) {
            throw new Error(`Failed to add Sepolia network: ${addError.message}`);
          }
        } else {
          throw new Error(`Failed to switch to Sepolia: ${switchError.message}`);
        }
      }
    }

    const config = {
      ...SepoliaConfig,
      network: walletProvider,
      gatewayUrl: 'https://gateway.sepolia.zama.ai',
      aclAddress: SepoliaConfig.aclAddress || '0xFee8407e2f5e3Ee68ad77cAE98c434e637f516e5',
    };

    fhevmInstance = await createInstance(config);
    return fhevmInstance;
  } catch (error: any) {
    console.error("FHE initialization error:", error);
    throw new Error(`Failed to initialize FHE: ${error.message || 'Unknown error'}`);
  }
};

const ensureInstance = async () => {
  if (!fhevmInstance) {
    await initializeFHE();
  }
  if (!fhevmInstance) {
    throw new Error("FHE SDK not initialized.");
  }
  return fhevmInstance;
};

export const encryptConfidenceShare = async (
  shareValue: bigint | number,
  contractAddress: string,
  walletAddress: string
): Promise<{ handle: `0x${string}`; proof: `0x${string}` }> => {
  try {
    const normalizedShare = BigInt(Math.max(1, Number(shareValue)));
    const instance = await ensureInstance();

    if (!instance || !instance.createEncryptedInput) {
      throw new Error("FHE instance not properly initialized");
    }

    const input = instance.createEncryptedInput(getAddress(contractAddress), getAddress(walletAddress));
    input.add64(normalizedShare);

    const encrypted = await input.encrypt();

    if (!encrypted || !encrypted.handles || !encrypted.inputProof) {
      throw new Error("Encryption failed: Invalid encrypted data");
    }

    const { handles, inputProof } = encrypted;

    if (!handles[0] || handles[0] === "0x") {
      throw new Error("Encryption failed: Invalid handle generated");
    }

    return {
      handle: hexlify(handles[0]) as `0x${string}`,
      proof: hexlify(inputProof) as `0x${string}`,
    };
  } catch (error: any) {
    console.error("Encryption error:", error);
    throw new Error(`Failed to encrypt data: ${error.message || 'Unknown error'}`);
  }
};
