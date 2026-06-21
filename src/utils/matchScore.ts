import type {
  Destination,
  FilterState,
  DayRange,
  FlightDuration,
  BudgetLevel,
} from "@/types";

export function getDayRange(min: number, max: number): DayRange[] {
  const ranges: DayRange[] = [];
  if (min <= 5) ranges.push("3-5");
  if (min <= 7 && max >= 5) ranges.push("5-7");
  if (min <= 10 && max >= 7) ranges.push("7-10");
  if (max >= 10) ranges.push("10+");
  return ranges;
}

export function getFlightDuration(hours: number): FlightDuration {
  if (hours < 2) return "<2h";
  if (hours < 5) return "2-5h";
  if (hours < 10) return "5-10h";
  return "10h+";
}

export function computeMatchScore(
  dest: Destination,
  filters: FilterState,
): { score: number; passed: boolean } {
  let score = 0;
  let passed = true;

  if (filters.budgetLevels.length > 0) {
    if (filters.budgetLevels.includes(dest.budgetLevel as BudgetLevel)) {
      score += 10;
    } else {
      passed = false;
    }
  }

  if (filters.months.length > 0) {
    const overlap = dest.bestMonths.filter((m) =>
      filters.months.includes(m),
    ).length;
    if (overlap > 0) {
      score += Math.min(10, overlap * 3);
    } else {
      passed = false;
    }
  }

  if (filters.dayRanges.length > 0) {
    const destRanges = getDayRange(
      dest.suggestedDays.min,
      dest.suggestedDays.max,
    );
    const overlap = destRanges.filter((r) =>
      filters.dayRanges.includes(r),
    ).length;
    if (overlap > 0) {
      score += Math.min(10, overlap * 5);
    } else {
      passed = false;
    }
  }

  if (filters.themes.length > 0) {
    const overlap = dest.tags.filter((t) =>
      filters.themes.includes(t),
    ).length;
    if (overlap > 0) {
      score += Math.min(15, overlap * 5);
    } else {
      passed = false;
    }
  }

  if (filters.flightDurations.length > 0) {
    const destFlight = getFlightDuration(dest.flightHoursFromShanghai);
    if (filters.flightDurations.includes(destFlight)) {
      score += 10;
    } else {
      passed = false;
    }
  }

  if (filters.visaTypes.length > 0) {
    if (filters.visaTypes.includes(dest.visaType)) {
      score += 10;
    } else {
      passed = false;
    }
  }

  if (filters.popularity.length > 0) {
    if (filters.popularity.includes(dest.popularity)) {
      score += 10;
    } else {
      passed = false;
    }
  }

  if (filters.seasonalTags.length > 0) {
    const overlap = (dest.seasonalTags || []).filter((t) =>
      filters.seasonalTags.includes(t),
    ).length;
    if (overlap > 0) {
      score += overlap * 8;
    } else {
      passed = false;
    }
  }

  if (filters.searchQuery.trim()) {
    const q = filters.searchQuery.toLowerCase().trim();
    const haystack = [
      dest.name,
      dest.nameEn,
      dest.country,
      dest.tagline,
      dest.description,
      ...dest.tags,
    ]
      .join(" ")
      .toLowerCase();
    if (haystack.includes(q)) {
      score += 20;
    } else {
      passed = false;
    }
  }

  return { score, passed };
}

export function filterAndSortDestinations(
  destinations: Destination[],
  filters: FilterState,
): (Destination & { matchScore: number })[] {
  const noFilters =
    filters.budgetLevels.length === 0 &&
    filters.months.length === 0 &&
    filters.dayRanges.length === 0 &&
    filters.themes.length === 0 &&
    filters.flightDurations.length === 0 &&
    filters.visaTypes.length === 0 &&
    filters.popularity.length === 0 &&
    filters.seasonalTags.length === 0 &&
    filters.searchQuery.trim() === "";

  const result: (Destination & { matchScore: number })[] = [];

  for (const dest of destinations) {
    if (noFilters) {
      result.push({ ...dest, matchScore: dest.recommendScore });
      continue;
    }
    const { score, passed } = computeMatchScore(dest, filters);
    if (passed) {
      result.push({ ...dest, matchScore: score + dest.recommendScore * 0.3 });
    }
  }

  switch (filters.sortBy) {
    case "budget-asc":
      result.sort(
        (a, b) =>
          a.budgetLevel - b.budgetLevel || b.matchScore - a.matchScore,
      );
      break;
    case "flight-asc":
      result.sort(
        (a, b) =>
          a.flightHoursFromShanghai - b.flightHoursFromShanghai ||
          b.matchScore - a.matchScore,
      );
      break;
    case "recommend":
      result.sort(
        (a, b) =>
          b.recommendScore - a.recommendScore ||
          b.matchScore - a.matchScore,
      );
      break;
    default:
      result.sort((a, b) => b.matchScore - a.matchScore);
  }

  return result;
}
