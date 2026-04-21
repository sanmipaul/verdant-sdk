import { createPublicClient, http, type WalletClient, type Hash } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { PayoutVaultAbi } from '../abis/PayoutVault';
import type { ResolvedVerdantConfig } from '../config';

function getChain(config: ResolvedVerdantConfig) {
  return config.network === 'mainnet' ? celo : celoAlfajores;
}

function getPublicClient(config: ResolvedVerdantConfig) {
  return createPublicClient({
    chain: getChain(config),
    transport: http(config.rpcUrl),
  });
}

/** Check whether a payout has already been executed for a policy. */
export async function isPayoutExecuted(
  config: ResolvedVerdantConfig,
  policyId: `0x${string}`,
): Promise<boolean> {
  try {
    const client = getPublicClient(config);
    return client.readContract({
      address: config.contracts.payoutVault,
      abi: PayoutVaultAbi,
      functionName: 'isPayoutExecuted',
      args: [policyId],
    });
  } catch {
    return false;
  }
}

/**
 * Trigger a payout for a single policy.
 * The policy must have been marked as CLAIMED via PolicyRegistry first.
 * Only callable by the authorized agent.
 */
export async function triggerPayout(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  policyId: `0x${string}`,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.payoutVault,
    abi: PayoutVaultAbi,
    functionName: 'triggerPayout',
    args: [policyId],
  });
}

/**
 * Trigger payouts for multiple policies in a single transaction.
 * Policies already paid out or not in CLAIMED status are silently skipped.
 * Only callable by the authorized agent.
 */
export async function batchPayout(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  policyIds: `0x${string}`[],
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.payoutVault,
    abi: PayoutVaultAbi,
    functionName: 'batchPayout',
    args: [policyIds],
  });
}
