import { CUSD_MAINNET, CUSD_ALFAJORES } from './constants';

export type NetworkName = 'mainnet' | 'alfajores';

export interface VerdantContractAddresses {
  policyRegistry: `0x${string}`;
  premiumPool: `0x${string}`;
  payoutVault: `0x${string}`;
  weatherOracle: `0x${string}`;
}

export interface VerdantConfig {
  network: NetworkName;
  contracts: VerdantContractAddresses;
  /** Override the default cUSD address */
  cUSDAddress?: `0x${string}`;
  /** Override the default RPC URL */
  rpcUrl?: string;
}

const DEFAULT_RPC: Record<NetworkName, string> = {
  mainnet: 'https://forno.celo.org',
  alfajores: 'https://alfajores-forno.celo-testnet.org',
};

const DEFAULT_CUSD: Record<NetworkName, `0x${string}`> = {
  mainnet: CUSD_MAINNET,
  alfajores: CUSD_ALFAJORES,
};

/**
 * Create a resolved Verdant config object from user-supplied options.
 * Pass the returned object into any SDK function that requires a config.
 */
export function createVerdantConfig(config: VerdantConfig) {
  return {
    network: config.network,
    contracts: config.contracts,
    cUSDAddress: config.cUSDAddress ?? DEFAULT_CUSD[config.network],
    rpcUrl: config.rpcUrl ?? DEFAULT_RPC[config.network],
  };
}

export type ResolvedVerdantConfig = ReturnType<typeof createVerdantConfig>;
