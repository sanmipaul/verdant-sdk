import { describe, it, expect } from 'vitest';
import { createVerdantConfig } from '../src/config';
import { CUSD_MAINNET, CUSD_ALFAJORES } from '../src/constants';

const MOCK_CONTRACTS = {
  policyRegistry: '0x0000000000000000000000000000000000000001' as `0x${string}`,
  premiumPool: '0x0000000000000000000000000000000000000002' as `0x${string}`,
  payoutVault: '0x0000000000000000000000000000000000000003' as `0x${string}`,
  weatherOracle: '0x0000000000000000000000000000000000000004' as `0x${string}`,
};

describe('createVerdantConfig', () => {
  it('sets the correct mainnet defaults', () => {
    const config = createVerdantConfig({ network: 'mainnet', contracts: MOCK_CONTRACTS });
    expect(config.rpcUrl).toBe('https://forno.celo.org');
    expect(config.cUSDAddress).toBe(CUSD_MAINNET);
  });

  it('sets the correct alfajores defaults', () => {
    const config = createVerdantConfig({ network: 'alfajores', contracts: MOCK_CONTRACTS });
    expect(config.rpcUrl).toBe('https://alfajores-forno.celo-testnet.org');
    expect(config.cUSDAddress).toBe(CUSD_ALFAJORES);
  });

  it('allows RPC URL override', () => {
    const config = createVerdantConfig({
      network: 'mainnet',
      contracts: MOCK_CONTRACTS,
      rpcUrl: 'https://my-custom-rpc.com',
    });
    expect(config.rpcUrl).toBe('https://my-custom-rpc.com');
  });

  it('allows cUSD address override', () => {
    const custom = '0x1234567890123456789012345678901234567890' as `0x${string}`;
    const config = createVerdantConfig({
      network: 'mainnet',
      contracts: MOCK_CONTRACTS,
      cUSDAddress: custom,
    });
    expect(config.cUSDAddress).toBe(custom);
  });

  it('preserves contract addresses', () => {
    const config = createVerdantConfig({ network: 'alfajores', contracts: MOCK_CONTRACTS });
    expect(config.contracts).toEqual(MOCK_CONTRACTS);
  });
});
