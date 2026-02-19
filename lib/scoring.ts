export const RULESET_VERSION = '1.0.0';
export const THRESHOLDS = { greenMax: 2, orangeMax: 5 };

export interface TriggeredRule {
  label: string;
  weight: number;
  answer: boolean;
  recommendation: string;
}

export interface ScoreResult {
  totalScore: number;
  status: 'GROEN' | 'ORANJE' | 'ROOD';
  triggeredRules: TriggeredRule[];
  rulesetVersion: string;
}

export interface Answers {
  authority?: boolean;
  substitution?: boolean;
  embedded?: boolean;
  ownTools?: boolean;
  notes?: string;
}

const RULES = [
  {
    key: 'authority' as keyof Answers,
    condition: (val: boolean) => val === true,
    weight: 3,
    label: 'Gezag over anderen',
    recommendation:
      "Hoog risico: ZZP'er heeft beslissingsbevoegdheid wat wijst op een dienstverband",
  },
  {
    key: 'substitution' as keyof Answers,
    condition: (val: boolean) => val === true,
    weight: -2,
    label: 'Vervanging toegestaan',
    recommendation: 'Laag risico: mogelijkheid tot vervanging duidt op zelfstandige status',
  },
  {
    key: 'embedded' as keyof Answers,
    condition: (val: boolean) => val === true,
    weight: 2,
    label: 'Ingebed in organisatie',
    recommendation:
      'Gemiddeld risico: werken op locatie als werknemer suggereert mogelijk dienstverband',
  },
  {
    key: 'ownTools' as keyof Answers,
    condition: (val: boolean) => val === true,
    weight: -1,
    label: 'Eigen gereedschap',
    recommendation: 'Laag risico: gebruik van eigen materiaal ondersteunt zelfstandige status',
  },
];

export function computeScore(answers: Answers): ScoreResult {
  let totalScore = 0;
  const triggeredRules: TriggeredRule[] = [];

  RULES.forEach((rule) => {
    const answer = answers[rule.key] as boolean | undefined;
    if (answer !== undefined && rule.condition(answer)) {
      totalScore += rule.weight;
      triggeredRules.push({
        label: rule.label,
        weight: rule.weight,
        answer,
        recommendation: rule.recommendation,
      });
    }
  });

  let status: 'GROEN' | 'ORANJE' | 'ROOD';
  if (totalScore <= THRESHOLDS.greenMax) {
    status = 'GROEN';
  } else if (totalScore <= THRESHOLDS.orangeMax) {
    status = 'ORANJE';
  } else {
    status = 'ROOD';
  }

  return { totalScore, status, triggeredRules, rulesetVersion: RULESET_VERSION };
}
