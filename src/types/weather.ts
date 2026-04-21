export enum EventType {
  DROUGHT = 0,
  FLOOD = 1,
  EXTREME_HEAT = 2,
  DRY_SPELL = 3,
}

export interface WeatherEvent {
  /** GPS latitude scaled by 1e6 */
  lat: bigint;
  /** GPS longitude scaled by 1e6 */
  lng: bigint;
  eventType: EventType;
  /**
   * Measured value scaled by 100.
   * For rainfall: mm × 100. For temperature: °C × 100.
   */
  value: bigint;
  timestamp: number;
  /** "open-meteo" | "nasa-power" | "ai-adjudicated" */
  dataSource: string;
}

export interface RecordEventParams {
  /** GPS latitude in decimal degrees */
  lat: number;
  /** GPS longitude in decimal degrees */
  lng: number;
  eventType: EventType;
  /** Raw measured value (rainfall in mm or temperature in °C) */
  value: number;
  timestamp: number;
  dataSource: string;
}
