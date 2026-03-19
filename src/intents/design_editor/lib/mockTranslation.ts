import { TranslationEntry } from "./types";

export const DUMMY_API_KEY = "dummy-key";

export function isDummyKey(apiKey: string): boolean {
  return apiKey === DUMMY_API_KEY;
}

// Returned when the dummy key is active so Canva reviewers can exercise
// the full plugin UI without a real Anthropic API key.
export const MOCK_ENTRIES: TranslationEntry[] = [
  {
    original: "Smart Energy Monitor",
    a: "Moniteur d'énergie intelligent",
    b: "Système de surveillance énergétique",
    c: "Suivi énergétique avancé",
  },
  {
    original: "Track your energy usage in real time",
    a: "Suivez votre consommation en temps réel",
    b: "Surveillez votre énergie instantanément",
    c: "Visualisez votre usage énergétique en direct",
  },
  {
    original: "Save up to 40% on your electricity bill",
    a: "Économisez jusqu'à 40 % sur votre facture",
    b: "Réduisez votre facture d'électricité de 40 %",
    c: "Jusqu'à 40 % d'économies sur l'électricité",
  },
  {
    original: "Get Started Free",
    a: "Commencer gratuitement",
    b: "Démarrer sans frais",
    c: "Essai gratuit",
  },
  {
    original: "No credit card required",
    a: "Sans carte bancaire",
    b: "Aucune carte de crédit requise",
    c: "Gratuit, sans engagement",
  },
];
