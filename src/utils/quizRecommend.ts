import type { Destination } from "@/types";

export interface QuizAnswers {
  q1: "A" | "B";
  q2: "A" | "B";
  q3: "A" | "B";
}

export interface QuizResult {
  destination: Destination;
  score: number;
  percentage: number;
}

export function computeQuizRecommendations(
  destinations: Destination[],
  answers: QuizAnswers,
): QuizResult[] {
  const scored = destinations.map((dest) => {
    let score = 0;

    if (answers.q1 === "A") {
      if (dest.tags.includes("beach")) score += 25;
      if (dest.tags.includes("nature")) score += 12;
      if (dest.tags.includes("honeymoon")) score += 8;
      if (dest.tags.includes("adventure")) score += 5;
    } else {
      if (dest.tags.includes("city")) score += 25;
      if (dest.tags.includes("food")) score += 15;
      if (dest.tags.includes("ancient-city")) score += 12;
      if (dest.tags.includes("solo-friendly")) score += 8;
      if (dest.tags.includes("family")) score += 5;
    }

    if (answers.q2 === "A") {
      if (dest.budgetLevel === 1) score += 25;
      else if (dest.budgetLevel === 2) score += 8;
    } else {
      if (dest.budgetLevel === 3) score += 25;
      else if (dest.budgetLevel === 2) score += 10;
      if (dest.tags.includes("honeymoon")) score += 8;
    }

    if (answers.q3 === "A") {
      if (dest.suggestedDays.min <= 5) score += 20;
      if (dest.suggestedDays.max <= 7) score += 5;
      if (dest.flightHoursFromShanghai < 5) score += 10;
      if (dest.flightHoursFromShanghai < 10) score += 5;
    } else {
      if (dest.suggestedDays.max >= 10) score += 20;
      if (dest.suggestedDays.min >= 5) score += 5;
      if (dest.tags.includes("nature")) score += 8;
      if (dest.tags.includes("road-trip")) score += 8;
      if (dest.tags.includes("adventure")) score += 8;
    }

    score += dest.recommendScore * 0.2;

    return { destination: dest, score };
  });

  scored.sort((a, b) => b.score - a.score);

  const maxScore = scored[0]?.score || 1;
  return scored.slice(0, 3).map((s) => ({
    destination: s.destination,
    score: s.score,
    percentage: Math.round((s.score / maxScore) * 100),
  }));
}
