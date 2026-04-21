// Config
export { createVerdantConfig } from './config';
export type { VerdantConfig, VerdantContractAddresses, ResolvedVerdantConfig, NetworkName } from './config';

// Constants
export {
  MIN_PREMIUM,
  MAX_COVERAGE,
  CUSD_MAINNET,
  CUSD_ALFAJORES,
  CELO_CHAIN_ID,
  ALFAJORES_CHAIN_ID,
  COORD_SCALE,
  COVERAGE_TYPE_LABELS,
  POLICY_STATUS_LABELS,
} from './constants';

// Types
export { CoverageType, PolicyStatus } from './types/policy';
export type { Policy, RegisterPolicyParams } from './types/policy';
export { EventType } from './types/weather';
export type { WeatherEvent, RecordEventParams } from './types/weather';

// Policy contract functions
export {
  fetchPolicy,
  fetchFarmerPolicyIds,
  fetchFarmerPolicies,
  calculatePremium,
  registerPolicy,
  expirePolicy,
  markClaimed,
} from './contracts/policy';

// Payout contract functions
export { isPayoutExecuted, triggerPayout, batchPayout } from './contracts/payout';

// Weather oracle functions
export {
  fetchWeatherEvent,
  fetchRegionEventIds,
  fetchEventsInRange,
  recordWeatherEvent,
} from './contracts/oracle';

// Premium pool functions
export { fetchTotalDeposited, fetchTotalPaidOut, depositToPool } from './contracts/pool';

// Utils
export {
  coordToScaled,
  scaledToCoord,
  cusdToWei,
  weiToCusd,
  formatCusd,
  truncateAddress,
  coverageTypeLabel,
  policyStatusLabel,
  isPolicyActive,
  isExpirable,
  secondsUntilExpiry,
  formatDate,
  scaledToMeasurement,
} from './utils';

// ABIs (for consumers who need them for custom viem usage)
export { PolicyRegistryAbi } from './abis/PolicyRegistry';
export { PremiumPoolAbi } from './abis/PremiumPool';
export { PayoutVaultAbi } from './abis/PayoutVault';
export { WeatherOracleAbi } from './abis/WeatherOracle';
