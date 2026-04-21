import { createPublicClient, http, type WalletClient, type Hash } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { PremiumPoolAbi } from '../abis/PremiumPool';
import type { ResolvedVerdantConfig } from '../config';
import { cusdToWei } from '../utils';

function getChain(config: ResolvedVerdantConfig) {
  return config.network === 'mainnet' ? celo : celoAlfajores;
}

function getPublicClient(config: ResolvedVerdantConfig) {
  return createPublicClient({
    chain: getChain(config),
    transport: http(config.rpcUrl),
  });
}

/** Fetch the total cUSD deposited into the pool (in wei). */
export async function fetchTotalDeposited(config: ResolvedVerdantConfig): Promise<bigint> {
  try {
    const client = getPublicClient(config);
    return client.readContract({
      address: config.contracts.premiumPool,
      abi: PremiumPoolAbi,
      functionName: 'totalDeposited',
    });
  } catch {
    return 0n;
  }
}

/** Fetch the total cUSD paid out from the pool (in wei). */
export async function fetchTotalPaidOut(config: ResolvedVerdantConfig): Promise<bigint> {
  try {
    const client = getPublicClient(config);
    return client.readContract({
      address: config.contracts.premiumPool,
      abi: PremiumPoolAbi,
      functionName: 'totalPaidOut',
    });
  } catch {
    return 0n;
  }
}

/**
 * Deposit reserve capital into the pool.
 * The caller must have approved the amount on the cUSD contract first.
 * Only callable by the owner.
 */
export async function depositToPool(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  amountCusd: number,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.premiumPool,
    abi: PremiumPoolAbi,
    functionName: 'deposit',
    args: [cusdToWei(amountCusd)],
  });
}
