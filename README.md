# verdant-sdk

TypeScript SDK for interacting with **Verdant** parametric crop insurance smart contracts on the [Celo](https://celo.org) blockchain.

Verdant automatically pays out cUSD to smallholder farmers when weather conditions — drought, flood, or extreme heat — cross predefined thresholds. No claims process. No adjuster. No paperwork.

This SDK abstracts all contract interactions into a clean, fully-typed API built on [viem](https://viem.sh), making it easy to integrate Verdant into any frontend, backend, or Cloudflare Agent.

---

## Installation

```bash
npm install verdant-sdk
# or
yarn add verdant-sdk
# or
pnpm add verdant-sdk
```

---

## Quick Start

```ts
import { createVerdantConfig, fetchFarmerPolicies } from 'verdant-sdk';

const config = createVerdantConfig({
  network: 'alfajores',
  contracts: {
    policyRegistry: '0x...',
    premiumPool:     '0x...',
    payoutVault:     '0x...',
    weatherOracle:   '0x...',
  },
});

const policies = await fetchFarmerPolicies(config, '0xfarmerAddress');
console.log(policies);
```

---

## Configuration

### `createVerdantConfig(config)`

Creates a resolved config object to pass into every SDK function.

```ts
const config = createVerdantConfig({
  network: 'mainnet',           // 'mainnet' | 'alfajores'
  contracts: {
    policyRegistry: '0x...',
    premiumPool:    '0x...',
    payoutVault:    '0x...',
    weatherOracle:  '0x...',
  },
  // Optional overrides:
  rpcUrl:      'https://forno.celo.org',
  cUSDAddress: '0x765DE816845861e75A25fCA122bb6898B8B1282a',
});
```

| Option | Type | Default |
|---|---|---|
| `network` | `'mainnet' \| 'alfajores'` | required |
| `contracts` | `VerdantContractAddresses` | required |
| `rpcUrl` | `string` | Celo forno for the given network |
| `cUSDAddress` | `` `0x${string}` `` | Official cUSD address for the given network |

---

## Policy Registry

### Read

#### `fetchPolicy(config, policyId)`
Fetch a single policy by its on-chain ID. Returns `null` if not found.

```ts
import { fetchPolicy } from 'verdant-sdk';

const policy = await fetchPolicy(config, '0xpolicyId');
// policy.coverageType, policy.status, policy.coverageAmount, ...
```

#### `fetchFarmerPolicies(config, farmerAddress)`
Fetch all fully-hydrated policies for a farmer.

```ts
import { fetchFarmerPolicies } from 'verdant-sdk';

const policies = await fetchFarmerPolicies(config, '0xfarmerAddress');
```

#### `fetchFarmerPolicyIds(config, farmerAddress)`
Fetch only the policy ID list for a farmer (cheaper than full hydration).

```ts
import { fetchFarmerPolicyIds } from 'verdant-sdk';

const ids = await fetchFarmerPolicyIds(config, '0xfarmerAddress');
```

#### `calculatePremium(config, coverageAmountCusd)`
Calculate the premium for a given coverage amount in human-readable cUSD. Returns the premium in wei.

```ts
import { calculatePremium, formatCusd } from 'verdant-sdk';

const premiumWei = await calculatePremium(config, 25); // 25 cUSD coverage
console.log(formatCusd(premiumWei)); // "0.5 cUSD"
```

### Write

#### `registerPolicy(config, wallet, params)`
Register a new insurance policy. The wallet must have approved the calculated premium on the cUSD contract before calling this.

```ts
import { registerPolicy, CoverageType } from 'verdant-sdk';

// Step 1 — approve cUSD spend on the cUSD contract (via viem)
// Step 2 — register the policy
const txHash = await registerPolicy(config, walletClient, {
  lat: 1.2921,              // GPS decimal degrees
  lng: 36.8219,
  coverageType: CoverageType.DROUGHT,
  coverageAmount: 25,       // 25 cUSD
  endDate: 1780000000,      // Unix timestamp (seconds)
});
```

#### `expirePolicy(config, wallet, policyId)`
Expire a policy that has passed its end date. Anyone can call this.

```ts
import { expirePolicy } from 'verdant-sdk';

const txHash = await expirePolicy(config, walletClient, '0xpolicyId');
```

#### `markClaimed(config, wallet, policyId)`
Mark a policy as claimed. **Only callable by the authorized agent wallet.**

```ts
import { markClaimed } from 'verdant-sdk';

const txHash = await markClaimed(config, agentWallet, '0xpolicyId');
```

---

## Payout Vault

#### `isPayoutExecuted(config, policyId)`
Check whether a payout has already been executed for a policy.

```ts
import { isPayoutExecuted } from 'verdant-sdk';

const paid = await isPayoutExecuted(config, '0xpolicyId');
```

#### `triggerPayout(config, wallet, policyId)`
Trigger a cUSD payout for a single policy. The policy must be in `CLAIMED` status. **Agent only.**

```ts
import { triggerPayout } from 'verdant-sdk';

const txHash = await triggerPayout(config, agentWallet, '0xpolicyId');
```

#### `batchPayout(config, wallet, policyIds)`
Trigger payouts for multiple policies in a single transaction. Policies already paid out or not in `CLAIMED` status are silently skipped. **Agent only.**

```ts
import { batchPayout } from 'verdant-sdk';

const txHash = await batchPayout(config, agentWallet, ['0xid1', '0xid2', '0xid3']);
```

---

## Weather Oracle

#### `fetchWeatherEvent(config, eventId)`
Fetch a single weather event by its ID. Returns `null` if not found.

```ts
import { fetchWeatherEvent, scaledToMeasurement } from 'verdant-sdk';

const event = await fetchWeatherEvent(config, '0xeventId');
if (event) {
  console.log(scaledToMeasurement(event.value), 'mm rainfall');
}
```

#### `fetchRegionEventIds(config, lat, lng)`
Fetch all event IDs recorded for a geographic region (snapped to a ~50km grid).

```ts
import { fetchRegionEventIds } from 'verdant-sdk';

const ids = await fetchRegionEventIds(config, 1.2921, 36.8219);
```

#### `fetchEventsInRange(config, lat, lng, from, to)`
Fetch all weather events for a region within a Unix timestamp range.

```ts
import { fetchEventsInRange } from 'verdant-sdk';

const events = await fetchEventsInRange(
  config,
  1.2921, 36.8219,
  1700000000, // from
  1780000000, // to
);
```

#### `recordWeatherEvent(config, wallet, params)`
Record a weather event on-chain. **Agent only.**

```ts
import { recordWeatherEvent, EventType } from 'verdant-sdk';

const txHash = await recordWeatherEvent(config, agentWallet, {
  lat: 1.2921,
  lng: 36.8219,
  eventType: EventType.DROUGHT,
  value: 12.5,           // rainfall in mm
  timestamp: 1750000000,
  dataSource: 'open-meteo',
});
```

---

## Premium Pool

#### `fetchTotalDeposited(config)`
Fetch the total cUSD deposited into the pool (in wei).

```ts
import { fetchTotalDeposited, formatCusd } from 'verdant-sdk';

const total = await fetchTotalDeposited(config);
console.log(formatCusd(total));
```

#### `fetchTotalPaidOut(config)`
Fetch the total cUSD paid out to farmers (in wei).

```ts
import { fetchTotalPaidOut, formatCusd } from 'verdant-sdk';

const total = await fetchTotalPaidOut(config);
console.log(formatCusd(total));
```

#### `depositToPool(config, wallet, amountCusd)`
Deposit reserve capital into the pool. **Owner only.** Requires prior cUSD approval.

```ts
import { depositToPool } from 'verdant-sdk';

const txHash = await depositToPool(config, ownerWallet, 500); // 500 cUSD
```

---

## Utilities

```ts
import {
  coordToScaled,        // decimal degrees → contract int256
  scaledToCoord,        // contract int256 → decimal degrees
  cusdToWei,            // human cUSD number → bigint wei
  weiToCusd,            // bigint wei → human cUSD number
  formatCusd,           // bigint wei → "X.XX cUSD" string
  truncateAddress,      // "0x1234…abcd"
  coverageTypeLabel,    // CoverageType → "Drought" | "Flood" | ...
  policyStatusLabel,    // PolicyStatus → "Active" | "Claimed" | ...
  isPolicyActive,       // Policy → boolean
  isExpirable,          // Policy → boolean (past end date, still ACTIVE)
  secondsUntilExpiry,   // Policy → seconds remaining (0 if expired)
  formatDate,           // Unix timestamp → locale date string
  scaledToMeasurement,  // contract value×100 → real number (mm / °C)
} from 'verdant-sdk';
```

---

## Types & Enums

```ts
import { CoverageType, PolicyStatus, EventType } from 'verdant-sdk';
import type { Policy, RegisterPolicyParams, WeatherEvent, RecordEventParams } from 'verdant-sdk';

// CoverageType
CoverageType.DROUGHT       // 0
CoverageType.FLOOD         // 1
CoverageType.EXTREME_HEAT  // 2
CoverageType.DRY_SPELL     // 3

// PolicyStatus
PolicyStatus.ACTIVE    // 0
PolicyStatus.CLAIMED   // 1
PolicyStatus.EXPIRED   // 2
PolicyStatus.CANCELLED // 3

// EventType
EventType.DROUGHT       // 0
EventType.FLOOD         // 1
EventType.EXTREME_HEAT  // 2
EventType.DRY_SPELL     // 3
```

### `Policy`

| Field | Type | Description |
|---|---|---|
| `policyId` | `` `0x${string}` `` | On-chain policy identifier |
| `farmer` | `` `0x${string}` `` | Farmer wallet address |
| `lat` | `bigint` | GPS latitude × 1e6 |
| `lng` | `bigint` | GPS longitude × 1e6 |
| `coverageType` | `CoverageType` | Weather event type covered |
| `coverageAmount` | `bigint` | cUSD payout amount in wei |
| `premiumPaid` | `bigint` | cUSD premium paid in wei |
| `startDate` | `number` | Policy start (Unix timestamp) |
| `endDate` | `number` | Policy expiry (Unix timestamp) |
| `status` | `PolicyStatus` | Current policy status |

---

## Constants

```ts
import {
  MIN_PREMIUM,        // 0.5 cUSD in wei  — minimum premium
  MAX_COVERAGE,       // 50 cUSD in wei   — maximum coverage per policy
  CUSD_MAINNET,       // 0x765DE816845861e75A25fCA122bb6898B8B1282a
  CUSD_ALFAJORES,     // 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1
  CELO_CHAIN_ID,      // 42220
  ALFAJORES_CHAIN_ID, // 44787
  COORD_SCALE,        // 1_000_000
} from 'verdant-sdk';
```

---

## ABIs

Raw ABIs are exported for consumers who need them for custom viem usage:

```ts
import {
  PolicyRegistryAbi,
  PremiumPoolAbi,
  PayoutVaultAbi,
  WeatherOracleAbi,
} from 'verdant-sdk';
```

---

## Coverage Types & Triggers

| Type | Trigger | Base Payout |
|---|---|---|
| Drought | Rainfall < 20mm over 30 days | 10–50 cUSD |
| Flood | Rainfall > 200mm over 7 days | 10–50 cUSD |
| Extreme Heat | Avg temp > 38°C over 14 days | 10–30 cUSD |
| Early Dry Spell | < 5mm rain in first 21 days of planting season | 5–20 cUSD |

---

## License

MIT
