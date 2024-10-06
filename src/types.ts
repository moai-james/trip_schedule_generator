export interface TripLocation {
  name: string;
  time: string;
  placeId: string;
}

export interface TripDay {
  locations: TripLocation[];
}

export interface TripData {
  days: TripDay[];
  introductions?: { [key: string]: string };
  images?: { [key: string]: string };
}

export type Language = 'en' | 'es' | 'fr' | 'de' | 'zh';