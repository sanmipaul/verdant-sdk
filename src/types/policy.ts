export enum CoverageType {
  DROUGHT = 0,
  FLOOD = 1,
  EXTREME_HEAT = 2,
  DRY_SPELL = 3,
}

export enum PolicyStatus {
  ACTIVE = 0,
  CLAIMED = 1,
  EXPIRED = 2,
  CANCELLED = 3,
}

export interface Policy {
  policyId: `0x${string}`;
  farmer: `0x${string}`;
  /** GPS latitude scaled by 1e6 */
  lat: bigint;
  /** GPS longitude scaled by 1e6 */
  lng: bigint;
  coverageType: CoverageType;
  /** cUSD payout amount in wei */
  coverageAmount: bigint;
  /** cUSD premium paid in wei */
  premiumPaid: bigint;
  startDate: number;
  endDate: number;
  status: PolicyStatus;
}

export interface RegisterPolicyParams {
  /** GPS latitude in decimal degrees (e.g. 1.2921) */
  lat: number;
  /** GPS longitude in decimal degrees (e.g. 36.8219) */
  lng: number;
  coverageType: CoverageType;
  /** cUSD coverage amount in human-readable units (e.g. 25 for 25 cUSD) */
  coverageAmount: number;
  /** Policy end date as a Unix timestamp (seconds) */
  endDate: number;
}
