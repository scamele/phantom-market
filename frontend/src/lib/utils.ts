import { formatEther } from "ethers";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatEth = (value: bigint | number, fractionDigits = 4) => {
  try {
    const bigIntValue = typeof value === "number" ? BigInt(Math.floor(value)) : value;
    const formatted = Number(formatEther(bigIntValue));
    return `${formatted.toFixed(fractionDigits)} ETH`;
  } catch {
    return "0 ETH";
  }
};

export const formatCurrencyFromWei = (value: bigint, fractionDigits = 2) => {
  try {
    const amount = Number(formatEther(value));
    return `$${amount.toFixed(fractionDigits)}`;
  } catch {
    return "$0.00";
  }
};

export const formatPercentage = (value: number) => `${value.toFixed(1)}%`;

export const shortenAddress = (address?: string | null) => {
  if (!address) return "";
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

export const formatTimeLeft = (lockTime: bigint) => {
  const secondsRemaining = Number(lockTime) - Math.floor(Date.now() / 1000);
  if (secondsRemaining <= 0) return "Locked";

  const days = Math.floor(secondsRemaining / 86400);
  const hours = Math.floor((secondsRemaining % 86400) / 3600);
  const minutes = Math.floor((secondsRemaining % 3600) / 60);

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

export const formatTimestamp = (timestamp: bigint) => {
  const date = new Date(Number(timestamp) * 1000);
  return date.toLocaleString();
};
