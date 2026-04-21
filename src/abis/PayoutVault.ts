export const PayoutVaultAbi = [
  {
    type: 'constructor',
    inputs: [
      { name: '_registry', type: 'address' },
      { name: '_pool', type: 'address' },
      { name: '_owner', type: 'address' },
    ],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'triggerPayout',
    inputs: [{ name: 'policyId', type: 'bytes32' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'batchPayout',
    inputs: [{ name: 'policyIds', type: 'bytes32[]' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'setAuthorizedAgent',
    inputs: [{ name: '_agent', type: 'address' }],
    outputs: [],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'isPayoutExecuted',
    inputs: [{ name: 'policyId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'payoutExecuted',
    inputs: [{ name: 'policyId', type: 'bytes32' }],
    outputs: [{ name: '', type: 'bool' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'authorizedAgent',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'PayoutExecuted',
    inputs: [
      { name: 'policyId', type: 'bytes32', indexed: true },
      { name: 'farmer', type: 'address', indexed: true },
      { name: 'amount', type: 'uint256', indexed: false },
    ],
  },
  {
    type: 'event',
    name: 'BatchPayoutExecuted',
    inputs: [
      { name: 'count', type: 'uint256', indexed: false },
      { name: 'totalAmount', type: 'uint256', indexed: false },
    ],
  },
  { type: 'error', name: 'Unauthorized', inputs: [] },
  { type: 'error', name: 'AlreadyPaidOut', inputs: [] },
  { type: 'error', name: 'PolicyNotClaimable', inputs: [] },
] as const;
