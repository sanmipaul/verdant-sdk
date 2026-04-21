import { createPublicClient, http, type WalletClient, type Hash } from 'viem';
import { celo, celoAlfajores } from 'viem/chains';
import { WeatherOracleAbi } from '../abis/WeatherOracle';
import type { ResolvedVerdantConfig } from '../config';
import { type WeatherEvent, type RecordEventParams, EventType } from '../types/weather';
import { coordToScaled } from '../utils';

function getChain(config: ResolvedVerdantConfig) {
  return config.network === 'mainnet' ? celo : celoAlfajores;
}

function getPublicClient(config: ResolvedVerdantConfig) {
  return createPublicClient({
    chain: getChain(config),
    transport: http(config.rpcUrl),
  });
}

function rawToWeatherEvent(raw: {
  lat: bigint;
  lng: bigint;
  eventType: number;
  value: bigint;
  timestamp: number;
  dataSource: string;
}): WeatherEvent {
  return {
    lat: raw.lat,
    lng: raw.lng,
    eventType: raw.eventType as EventType,
    value: raw.value,
    timestamp: Number(raw.timestamp),
    dataSource: raw.dataSource,
  };
}

/** Fetch a single weather event by its ID. Returns null if not found. */
export async function fetchWeatherEvent(
  config: ResolvedVerdantConfig,
  eventId: `0x${string}`,
): Promise<WeatherEvent | null> {
  try {
    const client = getPublicClient(config);
    const raw = await client.readContract({
      address: config.contracts.weatherOracle,
      abi: WeatherOracleAbi,
      functionName: 'getEvent',
      args: [eventId],
    });
    if (raw.timestamp === 0) return null;
    return rawToWeatherEvent(raw as Parameters<typeof rawToWeatherEvent>[0]);
  } catch {
    return null;
  }
}

/** Fetch all event IDs recorded for a geographic region. */
export async function fetchRegionEventIds(
  config: ResolvedVerdantConfig,
  lat: number,
  lng: number,
): Promise<`0x${string}`[]> {
  try {
    const client = getPublicClient(config);
    const ids = await client.readContract({
      address: config.contracts.weatherOracle,
      abi: WeatherOracleAbi,
      functionName: 'getRegionEvents',
      args: [coordToScaled(lat), coordToScaled(lng)],
    });
    return ids as `0x${string}`[];
  } catch {
    return [];
  }
}

/** Fetch all weather events for a region within a time range. */
export async function fetchEventsInRange(
  config: ResolvedVerdantConfig,
  lat: number,
  lng: number,
  from: number,
  to: number,
): Promise<WeatherEvent[]> {
  try {
    const client = getPublicClient(config);
    const raws = await client.readContract({
      address: config.contracts.weatherOracle,
      abi: WeatherOracleAbi,
      functionName: 'getEventsInRange',
      args: [coordToScaled(lat), coordToScaled(lng), from, to],
    });
    return (raws as Parameters<typeof rawToWeatherEvent>[0][]).map(rawToWeatherEvent);
  } catch {
    return [];
  }
}

/**
 * Record a weather event on-chain.
 * Only callable by the authorized agent wallet.
 */
export async function recordWeatherEvent(
  config: ResolvedVerdantConfig,
  wallet: WalletClient,
  params: RecordEventParams,
): Promise<Hash> {
  const [account] = await wallet.getAddresses();
  return wallet.writeContract({
    chain: getChain(config),
    account,
    address: config.contracts.weatherOracle,
    abi: WeatherOracleAbi,
    functionName: 'recordEvent',
    args: [
      coordToScaled(params.lat),
      coordToScaled(params.lng),
      params.eventType as number,
      BigInt(Math.round(params.value * 100)),
      params.timestamp,
      params.dataSource,
    ],
  });
}
