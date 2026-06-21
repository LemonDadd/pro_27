import { create } from "zustand";
import type {
  FilterState,
  BudgetLevel,
  DayRange,
  Tag,
  FlightDuration,
  VisaType,
  Popularity,
  SeasonalTag,
  SortBy,
} from "@/types";

interface FilterStore extends FilterState {
  toggleBudget: (b: BudgetLevel) => void;
  toggleMonth: (m: number) => void;
  toggleDayRange: (r: DayRange) => void;
  toggleTheme: (t: Tag) => void;
  toggleFlightDuration: (f: FlightDuration) => void;
  toggleVisaType: (v: VisaType) => void;
  togglePopularity: (p: Popularity) => void;
  toggleSeasonalTag: (s: SeasonalTag) => void;
  resetBudgets: () => void;
  resetMonths: () => void;
  resetDayRanges: () => void;
  resetThemes: () => void;
  resetFlightDurations: () => void;
  resetVisaTypes: () => void;
  resetPopularity: () => void;
  resetSeasonalTags: () => void;
  setSearchQuery: (q: string) => void;
  setSortBy: (s: SortBy) => void;
  reset: () => void;
}

const initialState: FilterState = {
  budgetLevels: [],
  months: [],
  dayRanges: [],
  themes: [],
  flightDurations: [],
  visaTypes: [],
  popularity: [],
  seasonalTags: [],
  searchQuery: "",
  sortBy: "match",
};

function toggleInArray<T>(arr: T[], item: T): T[] {
  return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
}

export const useFilterStore = create<FilterStore>((set) => ({
  ...initialState,

  toggleBudget: (b) =>
    set((s) => ({ budgetLevels: toggleInArray(s.budgetLevels, b) as BudgetLevel[] })),
  toggleMonth: (m) =>
    set((s) => ({ months: toggleInArray(s.months, m) })),
  toggleDayRange: (r) =>
    set((s) => ({ dayRanges: toggleInArray(s.dayRanges, r) as DayRange[] })),
  toggleTheme: (t) =>
    set((s) => ({ themes: toggleInArray(s.themes, t) as Tag[] })),
  toggleFlightDuration: (f) =>
    set((s) => ({
      flightDurations: toggleInArray(s.flightDurations, f) as FlightDuration[],
    })),
  toggleVisaType: (v) =>
    set((s) => ({ visaTypes: toggleInArray(s.visaTypes, v) as VisaType[] })),
  togglePopularity: (p) =>
    set((s) => ({ popularity: toggleInArray(s.popularity, p) as Popularity[] })),
  toggleSeasonalTag: (sTag) =>
    set((s) => ({
      seasonalTags: toggleInArray(s.seasonalTags, sTag) as SeasonalTag[],
    })),
  resetBudgets: () => set({ budgetLevels: [] }),
  resetMonths: () => set({ months: [] }),
  resetDayRanges: () => set({ dayRanges: [] }),
  resetThemes: () => set({ themes: [] }),
  resetFlightDurations: () => set({ flightDurations: [] }),
  resetVisaTypes: () => set({ visaTypes: [] }),
  resetPopularity: () => set({ popularity: [] }),
  resetSeasonalTags: () => set({ seasonalTags: [] }),
  setSearchQuery: (q) => set({ searchQuery: q }),
  setSortBy: (s) => set({ sortBy: s }),
  reset: () => set(initialState),
}));
