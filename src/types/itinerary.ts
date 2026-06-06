export type TransportMode = 'bus' | 'car' | 'boat' | 'scooter' | 'plane'

export interface TransportDetail {
  rows: [string, string][]
  tip?: string
}

export interface Transport {
  m: TransportMode
  label: string
  detail?: TransportDetail
}

export interface Spot {
  name: string
  en: string
  kr: string
  lat: number
  lng: number
  time: string
  note?: string
  /** transport to the *next* stop */
  to?: Transport
}

export interface Day {
  id: number
  date: string
  title: string
  en: string
  note: string
  spots: Spot[]
}

export type DayId = number | 'all'
