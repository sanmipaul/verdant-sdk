import { COORD_SCALE, COVERAGE_TYPE_LABELS, POLICY_STATUS_LABELS } from './constants';
import { type Policy, CoverageType, PolicyStatus } from './types/policy';

/** Convert decimal GPS degrees to the scaled integer the contracts expect. */
export function coordToScaled(degrees: number): bigint {
  return BigInt(Math.round(degrees * COORD_SCALE));
}

/** Convert the contract's scaled integer back to decimal degrees. */
export function scaledToCoord(scaled: bigint): number {
  return Number(scaled) / COORD_SCALE;
}

/** Convert a human-readable cUSD amount to wei (18 decimals). */
export function cusdToWei(cusd: number): bigint {
  return BigInt(Math.round(cusd * 1e18));
}

/** Convert wei to a human-readable cUSD number. */
export function weiToCusd(wei: bigint): number {
  return Number(wei) / 1e18;
}

/** Format a wei amount as a human-readable cUSD string. e.g. 500000000000000000n → "0.5 cUSD" */
export function formatCusd(wei: bigint, decimals = 4): string {
  const value = weiToCusd(wei);
  return `${parseFloat(value.toFixed(decimals))} cUSD`;
}

/** Truncate an EVM address for display. e.g. "0x1234…abcd" */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 2) return address;
  return `${address.slice(0, chars + 2)}…${address.slice(-chars)}`;
}

/** Return a human-readable label for a CoverageType enum value. */
export function coverageTypeLabel(type: CoverageType): string {
  return COVERAGE_TYPE_LABELS[type] ?? 'Unknown';
}

/** Return a human-readable label for a PolicyStatus enum value. */
export function policyStatusLabel(status: PolicyStatus): string {
  return POLICY_STATUS_LABELS[status] ?? 'Unknown';
}

/** Check whether a policy is currently active and not yet expired. */
export function isPolicyActive(policy: Policy): boolean {
  const now = Math.floor(Date.now() / 1000);
  return policy.status === PolicyStatus.ACTIVE && policy.endDate > now;
}

/** Check whether a policy is eligible for expiry (past end date, still ACTIVE). */
export function isExpirable(policy: Policy): boolean {
  const now = Math.floor(Date.now() / 1000);
  return policy.status === PolicyStatus.ACTIVE && policy.endDate <= now;
}

/** Return remaining seconds until a policy expires. Returns 0 if already expired. */
export function secondsUntilExpiry(policy: Policy): number {
  const now = Math.floor(Date.now() / 1000);
  return Math.max(0, policy.endDate - now);
}

/** Format a Unix timestamp as a locale date string. */
export function formatDate(timestamp: number): string {
  return new Date(timestamp * 1000).toLocaleDateString();
}

/**
 * Scale a raw weather value from contracts (value × 100) back to a real measurement.
 * e.g. rainfall: 2050n → 20.5 mm, temperature: 3800n → 38.0 °C
 */
export function scaledToMeasurement(scaled: bigint): number {
  return Number(scaled) / 100;
}
