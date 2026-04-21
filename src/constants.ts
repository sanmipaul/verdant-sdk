/** Minimum premium: 0.50 cUSD in wei */
export const MIN_PREMIUM = BigInt('500000000000000000');

/** Maximum coverage per policy: 50 cUSD in wei */
export const MAX_COVERAGE = BigInt('50000000000000000000');

/** cUSD token address on Celo mainnet */
export const CUSD_MAINNET = '0x765DE816845861e75A25fCA122bb6898B8B1282a' as const;

/** cUSD token address on Celo Alfajores testnet */
export const CUSD_ALFAJORES = '0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1' as const;

/** Celo mainnet chain ID */
export const CELO_CHAIN_ID = 42220;

/** Celo Alfajores testnet chain ID */
export const ALFAJORES_CHAIN_ID = 44787;

/** GPS coordinate scale factor used by the contracts */
export const COORD_SCALE = 1_000_000;

/** Approximate 50km grid resolution used by WeatherOracle for region grouping (in scaled units) */
export const REGION_GRID_SIZE = 450_000;

export const COVERAGE_TYPE_LABELS: Record<number, string> = {
  0: 'Drought',
  1: 'Flood',
  2: 'Extreme Heat',
  3: 'Dry Spell',
};

export const POLICY_STATUS_LABELS: Record<number, string> = {
  0: 'Active',
  1: 'Claimed',
  2: 'Expired',
  3: 'Cancelled',
};
