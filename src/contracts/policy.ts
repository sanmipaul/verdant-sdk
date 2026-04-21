import { createPublicClient, createWalletClient, http, type WalletClient, type Hash } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { PolicyRegistryAbi } from '../abis/PolicyRegistry';
import type { ResolvedVerdantConfig } from '../config';
import { type Policy, type RegisterPolicyParams, CoverageType, PolicyStatus } from '../types/policy';
import { coordToScaled, cusdToWei } from '../utils';

function getChain(config: ResolvedVerdantConfig) {
  return config.network === 'mainnet' ? celo : celoAlfajores;
}

function getPublicClient(config: ResolvedVerdantConfig) {
  return createPublicClient({
    chain: getChain(config),
    transport: http(config.rpcUrl),
  });
}

function rawToPolicy(raw: {
  policyId: `0x${string}`;
  farmer: `0x${string}`;
  lat: bigint;
  lng: bigint;
  coverageType: number;
  coverageAmount: bigint;
  premiumPaid: bigint;
  startDate: number;
  endDate: number;
  status: number;
}): Policy {
  return {
    policyId: raw.policyId,
    farmer: raw.farmer,
    lat: raw.lat,
    lng: raw.lng,
    coverageType: raw.coverageType as CoverageType,
    coverageAmount: raw.coverageAmount,
    premiumPaid: raw.premiumPaid,
    startDate: Number(raw.startDate),
    endDate: Number(raw.endDate),
    status: raw.status as PolicyStatus,
  };
}

/** Fetch a single policy by ID. Returns null if the policy does not exist. */
export async function fetchPolicy(
  config: ResolvedVerdantConfig,
  policyId: `0x${string}`,
): Promise<Policy | null> {
  try {
    const client = getPublicClient(config);
    const raw = await client.readContract({
      address: config.contracts.policyRegistry,
      abi: PolicyRegistryAbi,
      functionName: 'getPolicy',
      args: [policyId],
    });
    if (raw.startDate === 0) return null;
    return rawToPolicy(raw as Parameters<typeof rawToPolicy>[0]);
  } catch {
    return null;
  }
}

/** Fetch all policy IDs belonging to a farmer address. */
export async function fetchFarmerPolicyIds(
  config: ResolvedVerdantConfig,
  farmer: `0x${string}`,
): Promise<`0x${string}`[]> {
  try {
    const client = getPublicClient(config);
    const ids = await client.readContract({
      address: config.contracts.policyRegistry,
      abi: PolicyRegistryAbi,
      functionName: 'getFarmerPolicies',
      args: [farmer],
    });
    return ids as `0x${string}`[];
  } catch {
    return [];
  }
}

/** Fetch all policies for a farmer, fully hydrated. */
export async function fetchFarmerPolicies(
  config: ResolvedVerdantConfig,
  farmer: `0x${string}`,
): Promise<Policy[]> {
  const ids = await fetchFarmerPolicyIds(config, farmer);
  const results = await Promise.all(ids.map((id) => fetchPolicy(config, id)));
  return results.filter((p): p is Policy => p !== null);
}

/** Calculate the premium for a given coverage amount (in human-readable cUSD). */
export async function calculatePremium(
  config: ResolvedVerdantConfig,
  coverageAmountCusd: number,
): Promise<bigint> {
  const client = getPublicClient(config);
  const amountWei = cusdToWei(coverageAmountCusd);
  return client.readContract({
    address: config.contracts.policyRegistry,
    abi: PolicyRegistryAbi,
    functionName: 'calculatePremium',
    args: [amountWei],
  });
}

/**
 * Register a new insurance policy.
 * The caller must have already approved the premium amount on the cUSD contract.
 */
export async function registerPolicy(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  params: RegisterPolicyParams,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.policyRegistry,
    abi: PolicyRegistryAbi,
    functionName: 'registerPolicy',
    args: [
      coordToScaled(params.lat),
      coordToScaled(params.lng),
      params.coverageType as number,
      cusdToWei(params.coverageAmount),
      params.endDate,
    ],
  });
}

/** Expire a policy that has passed its end date. Anyone can call this. */
export async function expirePolicy(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  policyId: `0x${string}`,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.policyRegistry,
    abi: PolicyRegistryAbi,
    functionName: 'expirePolicy',
    args: [policyId],
  });
}

/** Mark a policy as claimed. Only callable by the authorized agent. */
export async function markClaimed(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  policyId: `0x${string}`,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.policyRegistry,
    abi: PolicyRegistryAbi,
    functionName: 'markClaimed',
    args: [policyId],
  });
}
