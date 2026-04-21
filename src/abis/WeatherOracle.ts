export const WeatherOracleAbi = [
  {
    type: 'constructor',
    inputs: [{ name: '_agent', type: 'address' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'recordEvent',
    inputs: [
      { name: 'lat', type: 'int256' },
      { name: 'lng', type: 'int256' },
      { name: 'eventType', type: 'uint8' },
      { name: 'value', type: 'int256' },
      { name: 'timestamp', type: 'uint40' },
      { name: 'dataSource', type: 'string' },
    ],
    outputs: [{ name: 'eventId', type: 'bytes32' }],
    stateMutability: 'nonpayable',
  },
  {
    type: 'function',
    name: 'getEvent',
    inputs: [{ name: 'eventId', type: 'bytes32' }],
    outputs: [
      {
        name: '',
        type: 'tuple',
        components: [
          { name: 'lat', type: 'int256' },
          { name: 'lng', type: 'int256' },
          { name: 'eventType', type: 'uint8' },
          { name: 'value', type: 'int256' },
          { name: 'timestamp', type: 'uint40' },
          { name: 'dataSource', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getRegionEvents',
    inputs: [
      { name: 'lat', type: 'int256' },
      { name: 'lng', type: 'int256' },
    ],
    outputs: [{ name: '', type: 'bytes32[]' }],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'getEventsInRange',
    inputs: [
      { name: 'lat', type: 'int256' },
      { name: 'lng', type: 'int256' },
      { name: 'from', type: 'uint40' },
      { name: 'to', type: 'uint40' },
    ],
    outputs: [
      {
        name: '',
        type: 'tuple[]',
        components: [
          { name: 'lat', type: 'int256' },
          { name: 'lng', type: 'int256' },
          { name: 'eventType', type: 'uint8' },
          { name: 'value', type: 'int256' },
          { name: 'timestamp', type: 'uint40' },
          { name: 'dataSource', type: 'string' },
        ],
      },
    ],
    stateMutability: 'view',
  },
  {
    type: 'function',
    name: 'agent',
    inputs: [],
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
  },
  {
    type: 'event',
    name: 'WeatherEventRecorded',
    inputs: [
      { name: 'eventId', type: 'bytes32', indexed: true },
      { name: 'regionHash', type: 'bytes32', indexed: true },
      { name: 'eventType', type: 'uint8', indexed: false },
      { name: 'value', type: 'int256', indexed: false },
      { name: 'timestamp', type: 'uint40', indexed: false },
    ],
  },
  { type: 'error', name: 'Unauthorized', inputs: [] },
  { type: 'error', name: 'EventAlreadyExists', inputs: [] },
] as const;
