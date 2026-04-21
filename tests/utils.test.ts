import { describe, it, expect } from 'vitest';
import {
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
  scaledToMeasurement,
} from '../src/utils';
import { CoverageType, PolicyStatus, type Policy } from '../src/types/policy';

describe('coordToScaled / scaledToCoord', () => {
  it('scales Nairobi latitude correctly', () => {
    expect(coordToScaled(1.2921)).toBe(1292100n);
  });

  it('scales negative longitude correctly', () => {
    expect(coordToScaled(-1.5)).toBe(-1500000n);
  });

  it('round-trips through scale and back', () => {
    const original = 36.8219;
    const scaled = coordToScaled(original);
    expect(scaledToCoord(scaled)).toBeCloseTo(original, 4);
  });
});

describe('cusdToWei / weiToCusd', () => {
  it('converts 0.5 cUSD to the minimum premium in wei', () => {
    expect(cusdToWei(0.5)).toBe(500000000000000000n);
  });

  it('converts 50 cUSD to the maximum coverage in wei', () => {
    expect(cusdToWei(50)).toBe(50000000000000000000n);
  });

  it('round-trips 25 cUSD', () => {
    expect(weiToCusd(cusdToWei(25))).toBe(25);
  });
});

describe('formatCusd', () => {
  it('formats 0.5 cUSD correctly', () => {
    expect(formatCusd(500000000000000000n)).toBe('0.5 cUSD');
  });

  it('formats 25 cUSD correctly', () => {
    expect(formatCusd(25000000000000000000n)).toBe('25 cUSD');
  });
});

describe('truncateAddress', () => {
  it('truncates a full EVM address', () => {
    const addr = '0x1234567890abcdef1234567890abcdef12345678';
    expect(truncateAddress(addr, 4)).toBe('0x1234…5678');
  });

  it('returns short addresses unchanged', () => {
    const short = '0x1234';
    expect(truncateAddress(short, 4)).toBe(short);
  });
});

describe('coverageTypeLabel / policyStatusLabel', () => {
  it('returns correct label for DROUGHT', () => {
    expect(coverageTypeLabel(CoverageType.DROUGHT)).toBe('Drought');
  });

  it('returns correct label for EXTREME_HEAT', () => {
    expect(coverageTypeLabel(CoverageType.EXTREME_HEAT)).toBe('Extreme Heat');
  });

  it('returns correct label for ACTIVE status', () => {
    expect(policyStatusLabel(PolicyStatus.ACTIVE)).toBe('Active');
  });

  it('returns correct label for CLAIMED status', () => {
    expect(policyStatusLabel(PolicyStatus.CLAIMED)).toBe('Claimed');
  });
});

function makePolicy(overrides: Partial<Policy> = {}): Policy {
  const now = Math.floor(Date.now() / 1000);
  return {
    policyId: '0xabc' as `0x${string}`,
    farmer: '0xdef' as `0x${string}`,
    lat: 1292100n,
    lng: 36821900n,
    coverageType: CoverageType.DROUGHT,
    coverageAmount: 25000000000000000000n,
    premiumPaid: 500000000000000000n,
    startDate: now - 86400,
    endDate: now + 86400 * 30,
    status: PolicyStatus.ACTIVE,
    ...overrides,
  };
}

describe('isPolicyActive', () => {
  it('returns true for an active policy with a future end date', () => {
    expect(isPolicyActive(makePolicy())).toBe(true);
  });

  it('returns false for a CLAIMED policy', () => {
    expect(isPolicyActive(makePolicy({ status: PolicyStatus.CLAIMED }))).toBe(false);
  });

  it('returns false for an active policy with a past end date', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isPolicyActive(makePolicy({ endDate: now - 1 }))).toBe(false);
  });
});

describe('isExpirable', () => {
  it('returns true for an active policy past its end date', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(isExpirable(makePolicy({ endDate: now - 1 }))).toBe(true);
  });

  it('returns false for an active policy not yet expired', () => {
    expect(isExpirable(makePolicy())).toBe(false);
  });
});

describe('secondsUntilExpiry', () => {
  it('returns a positive number for a future end date', () => {
    const result = secondsUntilExpiry(makePolicy());
    expect(result).toBeGreaterThan(0);
  });

  it('returns 0 for a policy already past end date', () => {
    const now = Math.floor(Date.now() / 1000);
    expect(secondsUntilExpiry(makePolicy({ endDate: now - 100 }))).toBe(0);
  });
});

describe('scaledToMeasurement', () => {
  it('converts scaled rainfall value to mm', () => {
    expect(scaledToMeasurement(2050n)).toBe(20.5);
  });

  it('converts scaled temperature value to °C', () => {
    expect(scaledToMeasurement(3800n)).toBe(38.0);
  });
});
