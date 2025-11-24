import { useEffect, useState } from "react";
import { getConnectedAccount, requestWallet } from "@/lib/phantom";

declare global {
  interface Window {
    ethereum?: {
      on?: (event: string, callback: (...args: any[]) => void) => void;
      removeListener?: (event: string, callback: (...args: any[]) => void) => void;
    };
  }
}

export const useWallet = () => {
  const [account, setAccount] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    getConnectedAccount()
      .then((existing) => setAccount(existing))
      .catch(() => undefined);

    const handleAccountsChanged = (accounts: string[]) => {
      setAccount(accounts[0] ?? null);
    };

    window.ethereum?.on?.("accountsChanged", handleAccountsChanged);
    return () => {
      window.ethereum?.removeListener?.("accountsChanged", handleAccountsChanged);
    };
  }, []);

  const connect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const wallet = await requestWallet();
      setAccount(wallet);
      return wallet;
    } catch (err: any) {
      setError(err?.message ?? "Failed to connect wallet");
      return null;
    } finally {
      setIsConnecting(false);
    }
  };

  return {
    account,
    isConnecting,
    error,
    connect,
    clearError: () => setError(null),
    isConnected: Boolean(account),
  };
};
