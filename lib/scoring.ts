export const RULESET_VERSION = '2.0.0';
export const THRESHOLDS = { greenMax: 4, orangeMax: 10 };

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
  // Categorie 1: Gezagsverhouding
  instructies?: boolean;
  werkTijden?: boolean;
  toezicht?: boolean;
  // Categorie 2: Persoonlijke arbeidsplicht
  persoonlijkVerplicht?: boolean;
  vervanger?: boolean;
  verlof?: boolean;
  // Categorie 3: Beloning en risico
  vasteVergoeding?: boolean;
  doorbetaling?: boolean;
  financieelRisico?: boolean;
  // Categorie 4: Inbedding in de organisatie
  vasteWerkplek?: boolean;
  bedrijfsmiddelen?: boolean;
  eigenGereedschap?: boolean;
  teamlid?: boolean;
  // Categorie 5: Zelfstandig ondernemerschap
  meerdereOpdrachtgevers?: boolean;
  exclusiviteit?: boolean;
  kvkInschrijving?: boolean;
  aansprakelijkheidsverzekering?: boolean;
  langetermijn?: boolean;
  // Vrij veld
  notes?: string;
}

const RULES: Array<{
  key: keyof Answers;
  condition: (val: boolean) => boolean;
  weight: number;
  label: string;
  recommendation: string;
}> = [
  // Categorie 1: Gezagsverhouding
  {
    key: 'instructies',
    condition: (v) => v === true,
    weight: 3,
    label: 'Instructies over werkmethode',
    recommendation:
      'Hoog risico: wanneer de opdrachtgever bepaalt hoe het werk uitgevoerd moet worden, is er sprake van een gezagsverhouding die kenmerkend is voor een dienstverband.',
  },
  {
    key: 'werkTijden',
    condition: (v) => v === true,
    weight: 2,
    label: 'Vaste werktijden of aanwezigheidsplicht',
    recommendation:
      'Risicofactor: vaste aanwezigheidsverplichtingen zijn typerend voor een arbeidsovereenkomst in plaats van een opdrachtovereenkomst.',
  },
  {
    key: 'toezicht',
    condition: (v) => v === true,
    weight: 2,
    label: 'Dagelijks toezicht en aansturing',
    recommendation:
      'Risicofactor: directe dagelijkse controle door de opdrachtgever wijst op een gezagsverhouding en daarmee op een mogelijke arbeidsrelatie.',
  },
  // Categorie 2: Persoonlijke arbeidsplicht
  {
    key: 'persoonlijkVerplicht',
    condition: (v) => v === true,
    weight: 2,
    label: 'Persoonlijke uitvoerplicht',
    recommendation:
      'Risicofactor: een verplichting tot persoonlijke uitvoering zonder vervanging is een kenmerk van een arbeidsovereenkomst.',
  },
  {
    key: 'vervanger',
    condition: (v) => v === true,
    weight: -2,
    label: 'Vrije vervanging mogelijk',
    recommendation:
      'Positief teken: de mogelijkheid om zelfstandig een vervanger aan te wijzen duidt op echte zelfstandigheid en ondernemersvrijheid.',
  },
  {
    key: 'verlof',
    condition: (v) => v === true,
    weight: 2,
    label: 'Verlofgoedkeuring vereist',
    recommendation:
      'Risicofactor: het moeten aanvragen van verlof- of vakantiegoedkeuring suggereert een werkgevers-werknemersverhouding.',
  },
  // Categorie 3: Beloning en risico
  {
    key: 'vasteVergoeding',
    condition: (v) => v === true,
    weight: 3,
    label: 'Vaste vergoeding ongeacht output',
    recommendation:
      'Hoog risico: een vast salaris los van geleverde prestaties is een sterk kenmerk van een arbeidsovereenkomst (loonbetaling).',
  },
  {
    key: 'doorbetaling',
    condition: (v) => v === true,
    weight: 2,
    label: 'Doorbetaling bij ziekte of vakantie',
    recommendation:
      'Risicofactor: het recht op doorbetaling bij ziekte of vakantie is exclusief voorbehouden aan werknemers en duidt sterk op een dienstverband.',
  },
  {
    key: 'financieelRisico',
    condition: (v) => v === true,
    weight: -2,
    label: 'Aantoonbaar financieel ondernemersrisico',
    recommendation:
      'Positief teken: het dragen van financieel risico (bijv. aansprakelijkheid voor fouten, niet-betaalde opdrachten) is typisch voor een echte zelfstandige ondernemer.',
  },
  // Categorie 4: Inbedding in de organisatie
  {
    key: 'vasteWerkplek',
    condition: (v) => v === true,
    weight: 2,
    label: 'Vaste werkplek bij opdrachtgever',
    recommendation:
      'Risicofactor: een vaste bureau- of werkplaats binnen de organisatie duidt op structurele inbedding die kenmerkend is voor een dienstverband.',
  },
  {
    key: 'bedrijfsmiddelen',
    condition: (v) => v === true,
    weight: 2,
    label: 'Hoofdzakelijk gebruik van bedrijfsmiddelen',
    recommendation:
      'Risicofactor: het overwegend gebruiken van materialen, systemen en apparatuur van de opdrachtgever wijst op een gebrek aan economische zelfstandigheid.',
  },
  {
    key: 'eigenGereedschap',
    condition: (v) => v === true,
    weight: -1,
    label: 'Eigen professioneel gereedschap',
    recommendation:
      'Positief teken: het inbrengen van eigen gereedschap, software en apparatuur ondersteunt de zelfstandige status.',
  },
  {
    key: 'teamlid',
    condition: (v) => v === true,
    weight: 2,
    label: 'Intern gepresenteerd als teamlid',
    recommendation:
      'Risicofactor: wanneer de opdrachtnemer op het intranet, in het organogram of met bedrijfskleding als medewerker wordt gepresenteerd, is er sprake van sterke organisatorische inbedding.',
  },
  // Categorie 5: Zelfstandig ondernemerschap
  {
    key: 'meerdereOpdrachtgevers',
    condition: (v) => v === true,
    weight: -2,
    label: 'Meerdere opdrachtgevers tegelijk',
    recommendation:
      'Positief teken: het gelijktijdig werken voor meerdere opdrachtgevers is een sterk bewijs van echte zelfstandigheid en ondernemerschap.',
  },
  {
    key: 'exclusiviteit',
    condition: (v) => v === true,
    weight: 2,
    label: 'Contractuele exclusiviteit',
    recommendation:
      'Risicofactor: een exclusiviteitsbeding dat de opdrachtnemer verbiedt voor anderen te werken is niet passend bij een zelfstandig ondernemer.',
  },
  {
    key: 'kvkInschrijving',
    condition: (v) => v === true,
    weight: -1,
    label: 'KvK-inschrijving aanwezig',
    recommendation:
      'Positief teken: inschrijving in het Handelsregister is een formele indicator van ondernemersstatus, hoewel dit op zichzelf niet doorslaggevend is.',
  },
  {
    key: 'aansprakelijkheidsverzekering',
    condition: (v) => v === true,
    weight: -1,
    label: 'Eigen aansprakelijkheidsverzekering',
    recommendation:
      'Positief teken: een eigen beroeps- of bedrijfsaansprakelijkheidsverzekering toont aan dat de opdrachtnemer als zelfstandig ondernemer risico draagt.',
  },
  {
    key: 'langetermijn',
    condition: (v) => v === true,
    weight: 1,
    label: 'Langdurige of steeds verlengde opdracht',
    recommendation:
      'Aandachtspunt: een langdurige samenwerking (>12 maanden) of structureel verlengde opdracht kan bij andere risicofactoren bijdragen aan het vermoeden van een dienstverband.',
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

// Question metadata for display purposes
export const QUESTION_LABELS: Record<string, string> = {
  instructies: 'Instructies over werkmethode',
  werkTijden: 'Vaste werktijden / aanwezigheidsplicht',
  toezicht: 'Dagelijks toezicht',
  persoonlijkVerplicht: 'Persoonlijke uitvoerplicht',
  vervanger: 'Vrije vervanging mogelijk',
  verlof: 'Verlofgoedkeuring vereist',
  vasteVergoeding: 'Vaste vergoeding ongeacht output',
  doorbetaling: 'Doorbetaling bij ziekte/vakantie',
  financieelRisico: 'Financieel ondernemersrisico',
  vasteWerkplek: 'Vaste werkplek bij opdrachtgever',
  bedrijfsmiddelen: 'Hoofdzakelijk bedrijfsmiddelen opdrachtgever',
  eigenGereedschap: 'Eigen professioneel gereedschap',
  teamlid: 'Intern gepresenteerd als teamlid',
  meerdereOpdrachtgevers: 'Meerdere opdrachtgevers',
  exclusiviteit: 'Contractuele exclusiviteit',
  kvkInschrijving: 'KvK-inschrijving',
  aansprakelijkheidsverzekering: 'Eigen aansprakelijkheidsverzekering',
  langetermijn: 'Langdurige opdracht (>12 mnd)',
};
