import { describe, it, expect } from 'vitest';
import {
  MIN_PREMIUM,
  MAX_COVERAGE,
  CUSD_MAINNET,
  CUSD_ALFAJORES,
  CELO_CHAIN_ID,
  ALFAJORES_CHAIN_ID,
  COORD_SCALE,
} from '../src/constants';

describe('constants', () => {
  it('MIN_PREMIUM is 0.5 cUSD in wei', () => {
    expect(MIN_PREMIUM).toBe(500000000000000000n);
  });

  it('MAX_COVERAGE is 50 cUSD in wei', () => {
    expect(MAX_COVERAGE).toBe(50000000000000000000n);
  });

  it('CUSD_MAINNET is the correct Celo mainnet address', () => {
    expect(CUSD_MAINNET).toBe('0x765DE816845861e75A25fCA122bb6898B8B1282a');
  });

  it('CUSD_ALFAJORES is the correct testnet address', () => {
    expect(CUSD_ALFAJORES).toBe('0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1');
  });

  it('CELO_CHAIN_ID is 42220', () => {
    expect(CELO_CHAIN_ID).toBe(42220);
  });

  it('ALFAJORES_CHAIN_ID is 44787', () => {
    expect(ALFAJORES_CHAIN_ID).toBe(44787);
  });

  it('COORD_SCALE is 1_000_000', () => {
    expect(COORD_SCALE).toBe(1_000_000);
  });
});
