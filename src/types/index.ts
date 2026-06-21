export type Continent = 'asia' | 'europe' | 'americas' | 'africa' | 'oceania' | 'middle-east';
export type Tag = 'beach' | 'ancient-city' | 'nature' | 'food' | 'adventure' | 'family' | 'honeymoon' | 'solo-friendly' | 'city' | 'ski' | 'road-trip';
export type SeasonalTag = 'cherry-blossom' | 'lavender' | 'aurora' | 'red-leaves';
export type BudgetLevel = 1 | 2 | 3;
export type VisaType = 'visa-free' | 'visa-on-arrival' | 'e-visa' | 'visa-required';
export type Popularity = 'hot' | 'niche' | 'cold';
export type HighlightType = 'do' | 'eat' | 'see';
export type SafetyLevel = 'low' | 'medium' | 'high';
export type DayRange = '3-5' | '5-7' | '7-10' | '10+';
export type FlightDuration = '<2h' | '2-5h' | '5-10h' | '10h+';
export type SortBy = 'match' | 'budget-asc' | 'flight-asc' | 'recommend';

export interface Ratings {
  languageFriendly: number;
  safety: number;
  priceIndex: number;
}

export interface SuggestedDays {
  min: number;
  max: number;
}

export interface Highlight {
  type: HighlightType;
  title: string;
  desc: string;
}

export interface Practical {
  currency: string;
  language: string;
  plug: string;
  timezone: string;
  safetyLevel: SafetyLevel;
}

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Destination {
  id: string;
  name: string;
  nameEn: string;
  country: string;
  continent: Continent;
  tagline: string;
  description: string;
  coverImage: string;
  gallery: string[];
  tags: Tag[];
  seasonalTags?: SeasonalTag[];
  ratings: Ratings;
  bestMonths: number[];
  suggestedDays: SuggestedDays;
  budgetLevel: BudgetLevel;
  flightHoursFromShanghai: number;
  visaType: VisaType;
  popularity: Popularity;
  highlights: Highlight[];
  practical: Practical;
  coordinates: Coordinates;
  similarDestinations: string[];
  recommendScore: number;
}

export interface FilterState {
  budgetLevels: BudgetLevel[];
  months: number[];
  dayRanges: DayRange[];
  themes: Tag[];
  flightDurations: FlightDuration[];
  visaTypes: VisaType[];
  popularity: Popularity[];
  seasonalTags: SeasonalTag[];
  searchQuery: string;
  sortBy: SortBy;
}

export interface UserState {
  wishlist: string[];
  visited: string[];
}
