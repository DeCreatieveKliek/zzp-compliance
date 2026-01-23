'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle, AlertTriangle, Plus, Clock, Users, Building, UserPlus, Sparkles, Shield, TrendingUp, Home, Trash2, BarChart3, Activity, FileText, X, Search, Archive, Download, Mail, Filter, ChevronDown } from 'lucide-react';

// Mock data store
const DATA_VERSION = '4.0-multi-arrest';

const initializeData = () => {
  if (typeof window === 'undefined') return getDefaultData();
  
  const stored = localStorage.getItem('zzp_compliance_data');
  const storedVersion = localStorage.getItem('zzp_compliance_version');
  
  if (stored && storedVersion === DATA_VERSION) {
    return JSON.parse(stored);
  }

  const defaultData = getDefaultData();
  localStorage.setItem('zzp_compliance_data', JSON.stringify(defaultData));
  localStorage.setItem('zzp_compliance_version', DATA_VERSION);
  return defaultData;
};

function getDefaultData() {
  return {
    version: DATA_VERSION,
    tenant: { id: '1', slug: 'demo', name: 'Demo Tenant' },
    organizations: [
      { id: '1', tenantId: '1', name: 'Acme Corp', type: 'CLIENT' }
    ],
    contractors: [
      { id: '1', tenantId: '1', displayName: 'Jan de Vries', email: 'jan@example.com' }
    ],
    engagements: [
      {
        id: '1',
        tenantId: '1',
        organizationId: '1',
        contractorId: '1',
        roleTitle: 'Frontend Developer',
        startDate: '2024-01-15',
        endDate: '2024-12-31',
        rateHourly: 85,
        metadata: {}
      }
    ],
    questionnaires: [
      {
        id: '1',
        tenantId: '1',
        name: 'Multi-arrest ZZP Beoordeling',
        version: '3.0',
        isActive: true
      }
    ],
    questions: [
      {
        id: '1',
        questionnaireId: '1',
        key: 'substitution',
        prompt: 'Kan de ZZP\'er een vervanger sturen om het werk uit te voeren zonder toestemming?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 1,
        options: null
      },
      {
        id: '2',
        questionnaireId: '1',
        key: 'instructions',
        prompt: 'Moet de ZZP\'er instructies en aanwijzingen van de opdrachtgever opvolgen over hoe het werk wordt uitgevoerd?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 2,
        options: null
      },
      {
        id: '3',
        questionnaireId: '1',
        key: 'workSchedule',
        prompt: 'Bepaalt de opdrachtgever wanneer en hoeveel uur de ZZP\'er moet werken?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 3,
        options: null
      },
      {
        id: '4',
        questionnaireId: '1',
        key: 'integration',
        prompt: 'Werkt de ZZP\'er volledig geïntegreerd in de organisatie (vast bureau, bedrijfsemail, toegang tot alle systemen)?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 4,
        options: null
      },
      {
        id: '5',
        questionnaireId: '1',
        key: 'ownMaterials',
        prompt: 'Gebruikt de ZZP\'er eigen gereedschap, materialen en apparatuur voor het werk?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 5,
        options: null
      },
      {
        id: '6',
        questionnaireId: '1',
        key: 'financialRisk',
        prompt: 'Loopt de ZZP\'er financieel risico (eigen investering, mogelijk verlies, meerdere opdrachtgevers)?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 6,
        options: null
      },
      {
        id: '7',
        questionnaireId: '1',
        key: 'ownClients',
        prompt: 'Heeft de ZZP\'er naast deze opdracht ook andere opdrachtgevers?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 7,
        options: null
      },
      {
        id: '8',
        questionnaireId: '1',
        key: 'fixedSalary',
        prompt: 'Krijgt de ZZP\'er een vast maandelijks bedrag dat lijkt op een salaris?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 8,
        options: null
      },
      {
        id: '9',
        questionnaireId: '1',
        key: 'contractualFreedom',
        prompt: 'Kan de ZZP\'er vrij onderhandelen over prijzen en contractvoorwaarden? (Groen/Schoevers)',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 9,
        options: null
      },
      {
        id: '10',
        questionnaireId: '1',
        key: 'refuseWork',
        prompt: 'Kan de ZZP\'er opdrachten weigeren zonder consequenties? (Groen/Schoevers)',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 10,
        options: null
      },
      {
        id: '11',
        questionnaireId: '1',
        key: 'platformDependency',
        prompt: 'Is de ZZP\'er afhankelijk van een platform of systeem van de opdrachtgever? (Helpling)',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 11,
        options: null
      },
      {
        id: '12',
        questionnaireId: '1',
        key: 'ratingSystem',
        prompt: 'Wordt de ZZP\'er beoordeeld via een ratingsysteem dat invloed heeft op toekomstige opdrachten? (Helpling)',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 12,
        options: null
      },
      {
        id: '13',
        questionnaireId: '1',
        key: 'clientChoice',
        prompt: 'Kan de ZZP\'er zelf klanten kiezen of worden deze toegewezen? (Helpling)',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 13,
        options: null
      },
      {
        id: '14',
        questionnaireId: '1',
        key: 'notes',
        prompt: 'Aanvullende opmerkingen of context',
        type: 'TEXT',
        required: false,
        orderIndex: 14,
        options: null
      }
    ],
    checkRuns: [],
    answers: [],
    scoreResults: [],
    auditEvents: [],
    archivedEngagements: [],
    archivedContractors: [],
    archivedOrganizations: []
  };
}

const RULESET_VERSION = '3.0.0-multi-arrest';
const THRESHOLDS = {
  approved: 4,  // Max 4 risicopunten = goedgekeurd
  warning: 8    // 5-8 punten = ter beoordeling, 9+ = afgekeurd
};

const computeScore = (answersByKey: any) => {
  const rules = [
    {
      key: 'substitution',
      condition: (val: any) => val === false,
      weight: 4,
      category: 'critical',
      label: 'Geen vervangingsmogelijkheid',
      recommendation: 'KRITIEK: Volgens Deliveroo-arrest is het niet kunnen sturen van een vervanger een sterke indicator voor een dienstverband.'
    },
    {
      key: 'instructions',
      condition: (val: any) => val === true,
      weight: 3,
      category: 'high',
      label: 'Moet instructies opvolgen',
      recommendation: 'HOOG RISICO: Gezagsverhouding waarbij instructies moeten worden opgevolgd duidt op dienstverband (Deliveroo-arrest).'
    },
    {
      key: 'workSchedule',
      condition: (val: any) => val === true,
      weight: 3,
      category: 'high',
      label: 'Werkschema wordt bepaald',
      recommendation: 'HOOG RISICO: Opdrachtgever bepaalt wanneer er wordt gewerkt, wat wijst op een gezagsverhouding.'
    },
    {
      key: 'fixedSalary',
      condition: (val: any) => val === true,
      weight: 3,
      category: 'high',
      label: 'Vast maandelijks bedrag',
      recommendation: 'HOOG RISICO: Een vaste maandelijkse betaling lijkt op een salaris en duidt op een arbeidsovereenkomst.'
    },
    {
      key: 'integration',
      condition: (val: any) => val === true,
      weight: 2,
      category: 'medium',
      label: 'Volledig geïntegreerd in organisatie',
      recommendation: 'GEMIDDELD RISICO: Volledige integratie in de organisatie kan wijzen op een arbeidsrelatie.'
    },
    {
      key: 'ownMaterials',
      condition: (val: any) => val === false,
      weight: 2,
      category: 'medium',
      label: 'Geen eigen materialen',
      recommendation: 'GEMIDDELD RISICO: Het niet gebruiken van eigen gereedschap vermindert het ondernemersrisico.'
    },
    {
      key: 'financialRisk',
      condition: (val: any) => val === false,
      weight: 3,
      category: 'high',
      label: 'Geen financieel risico',
      recommendation: 'HOOG RISICO: Volgens Deliveroo-arrest moet een ZZP\'er ondernemersrisico lopen.'
    },
    {
      key: 'ownClients',
      condition: (val: any) => val === false,
      weight: 2,
      category: 'medium',
      label: 'Geen andere opdrachtgevers',
      recommendation: 'GEMIDDELD RISICO: Afhankelijkheid van één opdrachtgever duidt op minder zelfstandigheid.'
    },
    // Positieve indicatoren
    {
      key: 'substitution',
      condition: (val: any) => val === true,
      weight: -3,
      category: 'positive',
      label: 'Vervangingsmogelijkheid aanwezig',
      recommendation: 'POSITIEF: Het kunnen sturen van een vervanger is een sterke indicator voor zelfstandigheid (Deliveroo-arrest).'
    },
    {
      key: 'ownMaterials',
      condition: (val: any) => val === true,
      weight: -2,
      category: 'positive',
      label: 'Gebruikt eigen materialen',
      recommendation: 'POSITIEF: Eigen gereedschap en materialen tonen ondernemerschap.'
    },
    {
      key: 'financialRisk',
      condition: (val: any) => val === true,
      weight: -3,
      category: 'positive',
      label: 'Loopt financieel risico',
      recommendation: 'POSITIEF: Ondernemersrisico is essentieel voor ZZP-status volgens Deliveroo-arrest.'
    },
    {
      key: 'ownClients',
      condition: (val: any) => val === true,
      weight: -2,
      category: 'positive',
      label: 'Heeft meerdere opdrachtgevers',
      recommendation: 'POSITIEF: Meerdere opdrachtgevers tonen echte zelfstandigheid.'
    },
    // Groen/Schoevers criteria
    {
      key: 'contractualFreedom',
      condition: (val: any) => val === false,
      weight: 3,
      category: 'high',
      label: 'Geen contractvrijheid',
      recommendation: 'HOOG RISICO: Volgens Groen/Schoevers-arrest moet een ZZP\'er vrij kunnen onderhandelen over voorwaarden en prijzen.'
    },
    {
      key: 'refuseWork',
      condition: (val: any) => val === false,
      weight: 3,
      category: 'high',
      label: 'Kan werk niet weigeren',
      recommendation: 'HOOG RISICO: Het niet kunnen weigeren van opdrachten duidt op een gezagsverhouding (Groen/Schoevers).'
    },
    {
      key: 'contractualFreedom',
      condition: (val: any) => val === true,
      weight: -2,
      category: 'positive',
      label: 'Contractvrijheid aanwezig',
      recommendation: 'POSITIEF: Vrije onderhandeling over voorwaarden toont zelfstandigheid (Groen/Schoevers).'
    },
    {
      key: 'refuseWork',
      condition: (val: any) => val === true,
      weight: -2,
      category: 'positive',
      label: 'Kan opdrachten weigeren',
      recommendation: 'POSITIEF: De vrijheid om werk te weigeren is kenmerkend voor zelfstandigheid (Groen/Schoevers).'
    },
    // Helpling criteria
    {
      key: 'platformDependency',
      condition: (val: any) => val === true,
      weight: 3,
      category: 'high',
      label: 'Platform afhankelijkheid',
      recommendation: 'HOOG RISICO: Afhankelijkheid van platform/systeem duidt op controle door opdrachtgever (Helpling-arrest).'
    },
    {
      key: 'ratingSystem',
      condition: (val: any) => val === true,
      weight: 2,
      category: 'medium',
      label: 'Rating systeem aanwezig',
      recommendation: 'GEMIDDELD RISICO: Beoordelingssysteem kan leiden tot indirecte controle (Helpling-arrest).'
    },
    {
      key: 'clientChoice',
      condition: (val: any) => val === false,
      weight: 2,
      category: 'medium',
      label: 'Geen klantenkeuze',
      recommendation: 'GEMIDDELD RISICO: Toegewezen klanten vermindert zelfstandigheid (Helpling-arrest).'
    },
    {
      key: 'platformDependency',
      condition: (val: any) => val === false,
      weight: -2,
      category: 'positive',
      label: 'Geen platform afhankelijkheid',
      recommendation: 'POSITIEF: Onafhankelijk van platforms toont echte zelfstandigheid (Helpling).'
    },
    {
      key: 'clientChoice',
      condition: (val: any) => val === true,
      weight: -2,
      category: 'positive',
      label: 'Kan klanten kiezen',
      recommendation: 'POSITIEF: Zelf klanten kunnen kiezen is kenmerkend voor ondernemerschap (Helpling).'
    }
  ];

  let totalScore = 0;
  const triggeredRules: any[] = [];

  rules.forEach(rule => {
    const answer = answersByKey[rule.key];
    if (answer !== undefined && rule.condition(answer)) {
      totalScore += rule.weight;
      triggeredRules.push({
        label: rule.label,
        weight: rule.weight,
        category: rule.category,
        answer: answer,
        recommendation: rule.recommendation
      });
    }
  });

  let status;
  let statusLabel;
  let verdict;

  if (totalScore <= THRESHOLDS.approved) {
    status = 'GOEDGEKEURD';
    statusLabel = 'GOEDGEKEURD';
    verdict = 'Deze ZZP-opdracht voldoet aan de criteria uit het Deliveroo-arrest. Er is voldoende zelfstandigheid en ondernemersrisico.';
  } else if (totalScore <= THRESHOLDS.warning) {
    status = 'TER_BEOORDELING';
    statusLabel = 'TER BEOORDELING';
    verdict = 'Deze opdracht bevat enkele risicofactoren. Aanvullende juridische beoordeling wordt aanbevolen.';
  } else {
    status = 'AFGEKEURD';
    statusLabel = 'AFGEKEURD';
    verdict = 'Deze opdracht voldoet NIET aan de criteria uit het Deliveroo-arrest. Er zijn te veel indicatoren voor een dienstverband. Raadpleeg een juridisch adviseur.';
  }

  // Generate advice
  let adviceForContractor = '';
  let adviceForClient = '';

  if (status === 'AFGEKEURD' || status === 'TER_BEOORDELING') {
    const contractorAdvice = [];
    const clientAdvice = [];

    if (answersByKey.substitution === false) {
      contractorAdvice.push('Zorg dat u in uw contract vastlegt dat u een vervanger kunt sturen zonder voorafgaande toestemming.');
      clientAdvice.push('Neem in het contract op dat de ZZP\'er een vervanger mag sturen zonder uw toestemming.');
    }

    if (answersByKey.instructions === true) {
      contractorAdvice.push('Minimaliseer de instructies die u ontvangt. Werk op basis van eindresultaat in plaats van specifieke werkinstructies.');
      clientAdvice.push('Geef geen gedetailleerde instructies over HOE het werk moet worden uitgevoerd. Focus op WAT het eindresultaat moet zijn.');
    }

    if (answersByKey.workSchedule === true) {
      contractorAdvice.push('Bepaal zelf uw werkuren en -dagen. Maak dit expliciet in het contract.');
      clientAdvice.push('Laat de ZZP\'er zelf bepalen wanneer en hoeveel uur er wordt gewerkt. Spreek alleen deadlines en beschikbaarheid af.');
    }

    if (answersByKey.fixedSalary === true) {
      contractorAdvice.push('Factureer op basis van geleverde prestaties of declarabele uren, niet met een vast maandbedrag.');
      clientAdvice.push('Betaal op basis van declarabele uren of resultaat, niet met een vast maandelijks bedrag.');
    }

    if (answersByKey.integration === true) {
      contractorAdvice.push('Werk niet volledig geïntegreerd in de organisatie. Gebruik eigen werkplek en e-mail waar mogelijk.');
      clientAdvice.push('Integreer de ZZP\'er niet volledig in uw organisatie. Geen vaste werkplek, bedrijfsemail of volledige systeemtoegang.');
    }

    if (answersByKey.ownMaterials === false) {
      contractorAdvice.push('Gebruik waar mogelijk uw eigen apparatuur, tools en materialen.');
      clientAdvice.push('Stimuleer dat de ZZP\'er eigen apparatuur en gereedschap gebruikt.');
    }

    if (answersByKey.financialRisk === false) {
      contractorAdvice.push('Zorg voor ondernemersrisico door eigen investeringen te doen en meerdere opdrachtgevers te hebben.');
      clientAdvice.push('De ZZP\'er moet ondernemersrisico lopen. Geen vaste kosten vergoeden die normaal bij een werkgever horen.');
    }

    if (answersByKey.ownClients === false) {
      contractorAdvice.push('Ontwikkel actief uw klantenbestand en werk voor meerdere opdrachtgevers.');
      clientAdvice.push('Eis niet dat de ZZP\'er exclusief voor u werkt. Moedig aan dat de ZZP\'er ook andere opdrachten aanneemt.');
    }

    // Groen/Schoevers criteria
    if (answersByKey.contractualFreedom === false) {
      contractorAdvice.push('Onderhandel actief over uw tarieven en contractvoorwaarden. Laat u niet voorschrijven wat de standaardvoorwaarden zijn.');
      clientAdvice.push('Laat de ZZP\'er vrij onderhandelen over tarieven en voorwaarden. Gebruik geen standaard niet-onderhandelbare contracten (Groen/Schoevers).');
    }

    if (answersByKey.refuseWork === false) {
      contractorAdvice.push('Eis het recht op om opdrachten te weigeren zonder dat dit gevolgen heeft voor toekomstige samenwerking.');
      clientAdvice.push('De ZZP\'er moet opdrachten kunnen weigeren zonder negatieve consequenties. Dit is essentieel volgens Groen/Schoevers-arrest.');
    }

    // Helpling criteria
    if (answersByKey.platformDependency === true) {
      contractorAdvice.push('Verminder afhankelijkheid van het platform. Gebruik eigen kanalen voor acquisitie en communicatie waar mogelijk.');
      clientAdvice.push('Maak de ZZP\'er niet afhankelijk van uw platform of systemen voor het verkrijgen van opdrachten (Helpling-arrest).');
    }

    if (answersByKey.ratingSystem === true) {
      contractorAdvice.push('Zorg dat beoordelingen transparant zijn en geen indirecte controle uitoefenen op uw werkwijze.');
      clientAdvice.push('Gebruik beoordelingssystemen niet als controlemiddel. Ratings mogen geen invloed hebben op toewijzing van werk (Helpling).');
    }

    if (answersByKey.clientChoice === false) {
      contractorAdvice.push('Eis het recht om zelf te kiezen voor welke klanten u werkt.');
      clientAdvice.push('Laat de ZZP\'er zelf klanten kiezen in plaats van deze toe te wijzen (Helpling-arrest).');
    }

    adviceForContractor = contractorAdvice.length > 0
      ? contractorAdvice.join('\n\n')
      : 'Blijf werken zoals u nu doet. Uw situatie voldoet aan de criteria voor zelfstandigheid.';

    adviceForClient = clientAdvice.length > 0
      ? clientAdvice.join('\n\n')
      : 'De huidige opdrachtstructuur voldoet aan de criteria. Handhaaf deze werkwijze.';
  } else {
    adviceForContractor = 'Deze opdracht voldoet aan alle criteria uit het Deliveroo-arrest. Blijf op dezelfde manier werken.';
    adviceForClient = 'Deze samenwerking is goed gestructureerd volgens het Deliveroo-arrest. Handhaaf deze werkwijze.';
  }

  return {
    totalScore,
    status,
    statusLabel,
    verdict,
    triggeredRules,
    adviceForContractor,
    adviceForClient,
    rulesetVersion: RULESET_VERSION
  };
};

// SearchableSelect Component
const SearchableSelect = ({ options, value, onChange, placeholder, label }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const selectedOption = options.find((opt: any) => opt.value === value);

  const filteredOptions = options.filter((opt: any) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="relative">
      <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
        {label} *
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 text-left flex items-center justify-between"
        >
          <span className={selectedOption ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl shadow-2xl max-h-80 overflow-hidden">
            <div className="p-3 border-b border-gray-200 dark:border-gray-600">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Type om te zoeken..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-60">
              {filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                  Geen resultaten gevonden
                </div>
              ) : (
                filteredOptions.map((option: any) => (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => handleSelect(option.value)}
                    className={`w-full px-4 py-3 text-left hover:bg-purple-50 dark:hover:bg-gray-600 transition-colors ${
                      value === option.value ? 'bg-purple-100 dark:bg-gray-600 font-semibold' : ''
                    }`}
                  >
                    <span className="text-gray-900 dark:text-white">{option.label}</span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Overlay to close dropdown when clicking outside */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setIsOpen(false);
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    GOEDGEKEURD: {
      bg: 'bg-gradient-to-r from-emerald-500 to-green-600',
      text: 'text-white',
      icon: CheckCircle,
      shadow: 'shadow-xl shadow-green-500/50',
      label: '✓ GOEDGEKEURD'
    },
    TER_BEOORDELING: {
      bg: 'bg-gradient-to-r from-amber-500 to-orange-600',
      text: 'text-white',
      icon: AlertTriangle,
      shadow: 'shadow-xl shadow-orange-500/50',
      label: '⚠ TER BEOORDELING'
    },
    AFGEKEURD: {
      bg: 'bg-gradient-to-r from-red-500 to-rose-600',
      text: 'text-white',
      icon: AlertCircle,
      shadow: 'shadow-xl shadow-red-500/50',
      label: '✗ AFGEKEURD'
    },
    PLANNED: {
      bg: 'bg-gradient-to-r from-slate-500 to-gray-600',
      text: 'text-white',
      icon: Clock,
      shadow: 'shadow-xl shadow-gray-500/50',
      label: 'NOG TE BEOORDELEN'
    }
  };

  const cfg = config[status] || config.PLANNED;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-base font-bold ${cfg.bg} ${cfg.text} ${cfg.shadow} transition-all duration-300 hover:scale-105 uppercase tracking-wide`}>
      <Icon className="w-5 h-5" />
      {cfg.label}
    </span>
  );
};

const ExportModal = ({ onClose, scoreResult, engagement, contractor, organization }: any) => {
  const [email, setEmail] = useState('');
  const [exportType, setExportType] = useState<'pdf' | 'email'>('pdf');

  const generatePDFContent = () => {
    const content = `
ZZP COMPLIANCE RAPPORT
======================

Beoordeling: Multi-arrest Compliance Check
Datum: ${new Date().toLocaleDateString('nl-NL', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

OPDRACHT DETAILS
-----------------
Rol: ${engagement.roleTitle}
ZZP'er: ${contractor.displayName}
Organisatie: ${organization.name}
Periode: ${engagement.startDate}${engagement.endDate ? ` - ${engagement.endDate}` : ''}
${engagement.rateHourly > 0 ? `Uurtarief: €${engagement.rateHourly}` : ''}

BEOORDELING RESULTAAT
---------------------
Status: ${scoreResult.status}
Risico Score: ${scoreResult.totalScore}
Verdict: ${scoreResult.verdict}

${scoreResult.adviceForContractor ? `
ADVIES VOOR ZZP'ER
------------------
${scoreResult.adviceForContractor}
` : ''}

${scoreResult.adviceForClient ? `
ADVIES VOOR OPDRACHTGEVER
--------------------------
${scoreResult.adviceForClient}
` : ''}

---
Gegenereerd door ZZP Compliance MVP • DCK x ZENO
Ruleset versie: ${scoreResult.rulesetVersion}
    `;
    return content;
  };

  const handleExport = () => {
    if (exportType === 'pdf') {
      const content = generatePDFContent();
      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `zzp-compliance-${engagement.roleTitle.replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      alert('Rapport gedownload! (Productie versie zou een PDF genereren)');
      onClose();
    } else if (exportType === 'email') {
      if (!email) {
        alert('Vul een email adres in');
        return;
      }
      // In productie zou dit een API call zijn naar een backend
      alert(`Rapport zou worden verstuurd naar: ${email}\n(Productie versie zou via backend een email versturen)`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <Download className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Rapport Exporteren
          </h3>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
            <p className="text-sm text-blue-900 dark:text-blue-200 font-semibold">
              {engagement.roleTitle}
            </p>
            <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
              {contractor.displayName} @ {organization.name}
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setExportType('pdf')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                exportType === 'pdf'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <Download className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Download PDF</p>
            </button>
            <button
              onClick={() => setExportType('email')}
              className={`flex-1 p-4 rounded-xl border-2 transition-all duration-200 ${
                exportType === 'email'
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  : 'border-gray-200 dark:border-gray-600 hover:border-blue-300'
              }`}
            >
              <Mail className="w-6 h-6 mx-auto mb-2 text-blue-600" />
              <p className="text-sm font-semibold text-gray-900 dark:text-white">Verstuur Email</p>
            </button>
          </div>

          {exportType === 'email' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                Email adres *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="naam@example.com"
              />
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200 dark:text-white"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/50 transition-all duration-200"
            >
              {exportType === 'pdf' ? 'Download' : 'Verstuur'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeleteConfirmModal = ({ onClose, onConfirm, itemName, itemType }: any) => {
  const [confirmText, setConfirmText] = useState('');
  const [sliderValue, setSliderValue] = useState(0);
  const isConfirmed = confirmText.toLowerCase() === 'verwijderen' && sliderValue >= 95;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl">
            <AlertCircle className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Bevestig Verwijderen
          </h3>
        </div>

        <div className="space-y-6">
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl">
            <p className="text-red-900 dark:text-red-200 font-semibold">
              Let op! Deze actie kan niet ongedaan worden gemaakt.
            </p>
            <p className="text-red-700 dark:text-red-300 text-sm mt-2">
              Je staat op het punt om <span className="font-bold">{itemName}</span> ({itemType}) permanent te verwijderen.
            </p>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Typ "verwijderen" om te bevestigen:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
              placeholder="verwijderen"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
              Sleep de balk naar rechts om definitief te verwijderen:
            </label>
            <div className="relative">
              <div className="h-14 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-red-500 to-rose-600 transition-all duration-100 flex items-center justify-center"
                  style={{ width: `${sliderValue}%` }}
                >
                  {sliderValue >= 95 && (
                    <CheckCircle className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={sliderValue}
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <p className="text-sm font-bold text-gray-700 dark:text-gray-300">
                  {sliderValue < 95 ? 'Sleep naar rechts →' : 'Gereed!'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200 dark:text-white"
            >
              Annuleren
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={!isConfirmed}
              className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                isConfirmed
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/50 cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              Verwijderen
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AddContractorModal = ({ onClose, onAdd }: any) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.displayName || !formData.email) {
      alert('Vul alle velden in');
      return;
    }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nieuwe ZZP&apos;er
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Naam *</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="bijv. Jan de Vries"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">E-mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="bijv. jan@example.com"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200 hover:scale-105 dark:text-white"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-105"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddOrganizationModal = ({ onClose, onAdd }: any) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'CLIENT'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) {
      alert('Vul een organisatienaam in');
      return;
    }
    onAdd(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nieuwe Organisatie
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Naam *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
              placeholder="bijv. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300 dark:hover:border-gray-500"
            >
              <option value="CLIENT">Opdrachtgever</option>
              <option value="SUPPLIER">Leverancier</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200 hover:scale-105 dark:text-white"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg shadow-purple-500/50 transition-all duration-200 hover:scale-105"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const AddEngagementModal = ({ onClose, onAdd, contractors, organizations }: any) => {
  const [formData, setFormData] = useState({
    contractorId: '',
    organizationId: '',
    roleTitle: '',
    startDate: '',
    endDate: '',
    rateHourly: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contractorId || !formData.organizationId || !formData.roleTitle || !formData.startDate) {
      alert('Vul alle verplichte velden in');
      return;
    }
    onAdd({
      ...formData,
      rateHourly: formData.rateHourly ? parseFloat(formData.rateHourly) : 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-2xl transform animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
            Nieuwe Opdracht
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <SearchableSelect
              label="ZZP'er"
              placeholder="Selecteer ZZP'er"
              value={formData.contractorId}
              onChange={(value: string) => setFormData({ ...formData, contractorId: value })}
              options={contractors.map((c: any) => ({ value: c.id, label: c.displayName }))}
            />
            <SearchableSelect
              label="Organisatie"
              placeholder="Selecteer organisatie"
              value={formData.organizationId}
              onChange={(value: string) => setFormData({ ...formData, organizationId: value })}
              options={organizations.map((o: any) => ({ value: o.id, label: o.name }))}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Rol *</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. Frontend Developer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Startdatum *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Einddatum</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Uurtarief (€)</label>
            <input
              type="number"
              value={formData.rateHourly}
              onChange={(e) => setFormData({ ...formData, rateHourly: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. 85"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 font-semibold transition-all duration-200 hover:scale-105 dark:text-white"
            >
              Annuleren
            </button>
            <button
              type="submit"
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Payment View Component
const PaymentView = ({ onPaymentComplete }: any) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDemo, setShowDemo] = useState(false);

  const handleMolliePayment = () => {
    setIsProcessing(true);

    // Simulate Mollie payment redirect
    setTimeout(() => {
      // In een echte implementatie zou hier een redirect naar Mollie zijn
      // Voor demo doeleinden simuleren we direct een succesvolle betaling
      localStorage.setItem('zzp_payment_status', 'paid');
      localStorage.setItem('zzp_payment_date', new Date().toISOString());
      onPaymentComplete();
      setIsProcessing(false);
    }, 2000);
  };

  const handleDemoAccess = () => {
    localStorage.setItem('zzp_payment_status', 'paid');
    localStorage.setItem('zzp_payment_date', new Date().toISOString());
    onPaymentComplete();
  };

  return (
    <div className="min-h-screen bg-white dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 flex items-center justify-center p-6">
      <div className="max-w-2xl w-full">
        <div className="card-zeno p-8 md:p-12">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-[#7a00df] rounded-2xl mb-6">
              <Shield className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-[#313131] dark:text-white mb-3">
              ZZP Compliance Toolkit
            </h1>
            <p className="text-lg text-[#313131]/70 dark:text-gray-400">
              Professionele compliance checks voor ZZP'ers
            </p>
          </div>

          {/* Features */}
          <div className="mb-10 space-y-4">
            <div className="flex items-start gap-4 p-5 bg-[#7a00df]/5 rounded-xl border border-[#7a00df]/10">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#00d084]/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#00d084]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#313131] dark:text-white mb-1">Multi-arrest Beoordeling</h3>
                <p className="text-sm text-[#313131]/60 dark:text-gray-400">
                  Gebaseerd op Deliveroo, Groen/Schoevers en Helpling arresten
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-[#7a00df]/5 rounded-xl border border-[#7a00df]/10">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#0693e3]/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#0693e3]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#313131] dark:text-white mb-1">Automatische Risico-analyse</h3>
                <p className="text-sm text-[#313131]/60 dark:text-gray-400">
                  Ontvang direct concrete aanbevelingen en advies
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 p-5 bg-[#7a00df]/5 rounded-xl border border-[#7a00df]/10">
              <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-[#7a00df]/10 rounded-lg">
                <CheckCircle className="w-6 h-6 text-[#7a00df]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#313131] dark:text-white mb-1">Beheer Systeem</h3>
                <p className="text-sm text-[#313131]/60 dark:text-gray-400">
                  Volledige toolkit voor opdrachten, ZZP'ers en organisaties
                </p>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="bg-[#7a00df] rounded-2xl p-8 mb-6 text-white">
            <div className="text-center">
              <p className="text-sm opacity-90 mb-2">Eenmalige toegang</p>
              <div className="flex items-center justify-center gap-2 mb-2">
                <span className="text-6xl font-bold">€1</span>
              </div>
              <p className="text-sm opacity-90">Veilig betalen via Mollie</p>
            </div>
          </div>

          {/* Payment Button */}
          <button
            onClick={handleMolliePayment}
            disabled={isProcessing}
            className="btn-zeno-primary w-full py-4 text-lg mb-4 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-sm"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verwerken...
              </span>
            ) : (
              '💳 Betaal €1 via Mollie'
            )}
          </button>

          {/* Demo Access */}
          <div className="text-center">
            <button
              onClick={() => setShowDemo(!showDemo)}
              className="text-sm text-[#7a00df] dark:text-[#7a00df] hover:underline font-medium"
            >
              {showDemo ? 'Verberg demo optie' : 'Demo toegang (alleen voor ontwikkeling)'}
            </button>
            {showDemo && (
              <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
                <p className="text-sm text-[#313131] dark:text-gray-300 mb-3">
                  <strong>Let op:</strong> Dit is alleen voor demo doeleinden
                </p>
                <button
                  onClick={handleDemoAccess}
                  className="px-5 py-2.5 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 font-semibold transition-all"
                >
                  Demo Toegang Activeren
                </button>
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center gap-2 text-sm text-[#313131]/60 dark:text-gray-400">
              <Shield className="w-4 h-4" />
              <p>Veilige betaling via Mollie • SSL versleuteld</p>
            </div>
          </div>
        </div>

        {/* ZenoZorg branding */}
        <div className="text-center mt-6">
          <p className="text-sm text-[#313131]/60 dark:text-gray-400">
            Een product van <span className="font-semibold text-[#7a00df]">ZenoZorg</span>
          </p>
        </div>
      </div>
    </div>
  );
};

// Recent Activity Component
const RecentActivity = ({ data }: any) => {
  const recentEvents = (data.auditEvents || []).slice(0, 10);

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'CREATE':
        return <Plus className="w-4 h-4" />;
      case 'DELETE':
      case 'BULK_DELETE':
        return <Trash2 className="w-4 h-4" />;
      case 'ARCHIVE':
      case 'BULK_ARCHIVE':
        return <Archive className="w-4 h-4" />;
      case 'UNARCHIVE':
        return <Activity className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
      case 'DELETE':
      case 'BULK_DELETE':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'ARCHIVE':
      case 'BULK_ARCHIVE':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      case 'UNARCHIVE':
        return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30';
      default:
        return 'text-gray-600 bg-gray-100 dark:text-gray-400 dark:bg-gray-700';
    }
  };

  const getActionLabel = (action: string) => {
    switch (action) {
      case 'CREATE':
        return 'Aangemaakt';
      case 'DELETE':
        return 'Verwijderd';
      case 'BULK_DELETE':
        return 'Bulk Verwijderd';
      case 'ARCHIVE':
        return 'Gearchiveerd';
      case 'BULK_ARCHIVE':
        return 'Bulk Gearchiveerd';
      case 'UNARCHIVE':
        return 'Teruggehaald';
      default:
        return action;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Zojuist';
    if (diffMins < 60) return `${diffMins} minuten geleden`;
    if (diffHours < 24) return `${diffHours} uur geleden`;
    if (diffDays < 7) return `${diffDays} dagen geleden`;
    return date.toLocaleDateString('nl-NL', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Activity className="w-6 h-6 text-purple-600" />
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Recente Activiteit</h2>
        </div>
      </div>

      {recentEvents.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nog geen activiteiten</p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentEvents.map((event: any) => (
            <div
              key={event.id}
              className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:shadow-md transition-all duration-200"
            >
              <div className={`p-2 rounded-lg ${getActionColor(event.action)}`}>
                {getActionIcon(event.action)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {getActionLabel(event.action)}: {event.entityType}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {event.entityName}
                    </p>
                    {event.details && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                        {event.details}
                      </p>
                    )}
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                    {formatTimestamp(event.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Dashboard = ({ data, onNavigate }: any) => {
  const totalEngagements = data.engagements.length;
  const totalContractors = data.contractors.length;
  const totalOrganizations = data.organizations.length;
  const totalChecks = data.checkRuns.length;

  const engagementsWithScores = data.engagements.map((eng: any) => {
    const latestCheck = data.checkRuns
      .filter((cr: any) => cr.engagementId === eng.id)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
    const score = latestCheck ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheck.id) : null;
    return { ...eng, latestScore: score };
  });

  const approvedCount = engagementsWithScores.filter((e: any) => e.latestScore?.status === 'GOEDGEKEURD').length;
  const warningCount = engagementsWithScores.filter((e: any) => e.latestScore?.status === 'TER_BEOORDELING').length;
  const rejectedCount = engagementsWithScores.filter((e: any) => e.latestScore?.status === 'AFGEKEURD').length;
  const pendingCount = engagementsWithScores.filter((e: any) => !e.latestScore).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-[#313131] dark:text-white mb-2">Dashboard</h1>
        <p className="text-[#313131]/70 dark:text-gray-400">Overzicht van uw ZZP compliance status</p>
      </div>

      {/* Key Metrics - ZenoZorg Style */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="card-zeno group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400 font-medium mb-2">Totaal Opdrachten</p>
              <p className="text-4xl font-bold text-[#313131] dark:text-white">{totalEngagements}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#7a00df]/10 rounded-lg group-hover:bg-[#7a00df]/20 transition-colors">
              <FileText className="w-7 h-7 text-[#7a00df]" />
            </div>
          </div>
        </div>

        <div className="card-zeno group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400 font-medium mb-2">ZZP&apos;ers</p>
              <p className="text-4xl font-bold text-[#313131] dark:text-white">{totalContractors}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#0693e3]/10 rounded-lg group-hover:bg-[#0693e3]/20 transition-colors">
              <Users className="w-7 h-7 text-[#0693e3]" />
            </div>
          </div>
        </div>

        <div className="card-zeno group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400 font-medium mb-2">Organisaties</p>
              <p className="text-4xl font-bold text-[#313131] dark:text-white">{totalOrganizations}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#00d084]/10 rounded-lg group-hover:bg-[#00d084]/20 transition-colors">
              <Building className="w-7 h-7 text-[#00d084]" />
            </div>
          </div>
        </div>

        <div className="card-zeno group">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400 font-medium mb-2">Checks Uitgevoerd</p>
              <p className="text-4xl font-bold text-[#313131] dark:text-white">{totalChecks}</p>
            </div>
            <div className="w-14 h-14 flex items-center justify-center bg-[#7a00df]/10 rounded-lg group-hover:bg-[#7a00df]/20 transition-colors">
              <Activity className="w-7 h-7 text-[#7a00df]" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status Overview - ZenoZorg Style */}
      <div className="card-zeno">
        <h2 className="text-2xl font-bold text-[#313131] dark:text-white mb-6 flex items-center gap-3">
          <div className="w-10 h-10 flex items-center justify-center bg-[#7a00df]/10 rounded-lg">
            <BarChart3 className="w-5 h-5 text-[#7a00df]" />
          </div>
          <span>Compliance Status Overzicht</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'GOEDGEKEURD'; }}
            className="p-6 bg-green-50 hover:bg-green-100 dark:bg-green-900/30 dark:hover:bg-green-900/40 rounded-lg border-2 border-green-200 dark:border-green-800 hover:border-green-300 dark:hover:border-green-700 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <CheckCircle className="w-8 h-8 text-[#00d084]" />
              <p className="text-3xl font-bold text-[#313131] dark:text-white">{approvedCount}</p>
            </div>
            <p className="text-sm font-semibold text-[#313131] dark:text-gray-300">Goedgekeurd</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'TER_BEOORDELING'; }}
            className="p-6 bg-orange-50 hover:bg-orange-100 dark:bg-orange-900/30 dark:hover:bg-orange-900/40 rounded-lg border-2 border-orange-200 dark:border-orange-800 hover:border-orange-300 dark:hover:border-orange-700 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <p className="text-3xl font-bold text-[#313131] dark:text-white">{warningCount}</p>
            </div>
            <p className="text-sm font-semibold text-[#313131] dark:text-gray-300">Ter Beoordeling</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'AFGEKEURD'; }}
            className="p-6 bg-red-50 hover:bg-red-100 dark:bg-red-900/30 dark:hover:bg-red-900/40 rounded-lg border-2 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <p className="text-3xl font-bold text-[#313131] dark:text-white">{rejectedCount}</p>
            </div>
            <p className="text-sm font-semibold text-[#313131] dark:text-gray-300">Afgekeurd</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'PLANNED'; }}
            className="p-6 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 transition-all group text-left"
          >
            <div className="flex items-center justify-between mb-3">
              <Clock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              <p className="text-3xl font-bold text-[#313131] dark:text-white">{pendingCount}</p>
            </div>
            <p className="text-sm font-semibold text-[#313131] dark:text-gray-300">Nog Te Beoordelen</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity data={data} />

      {/* Quick Actions - ZenoZorg Style */}
      <div>
        <h2 className="text-2xl font-bold text-[#313131] dark:text-white mb-6">Snelle Acties</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('engagements')}
            className="group card-zeno hover:border-[#7a00df]/40 transition-all"
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#7a00df]/10 group-hover:bg-[#7a00df]/20 rounded-xl mb-4 transition-colors">
                <FileText className="w-8 h-8 text-[#7a00df]" />
              </div>
              <p className="font-bold text-lg text-[#313131] dark:text-white mb-2">Bekijk Opdrachten</p>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400">Beheer al uw ZZP-opdrachten</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('people')}
            className="group card-zeno hover:border-[#0693e3]/40 transition-all"
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#0693e3]/10 group-hover:bg-[#0693e3]/20 rounded-xl mb-4 transition-colors">
                <Users className="w-8 h-8 text-[#0693e3]" />
              </div>
              <p className="font-bold text-lg text-[#313131] dark:text-white mb-2">Beheer ZZP&apos;ers</p>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400">Organisaties en freelancers</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('engagements')}
            className="group card-zeno hover:border-[#00d084]/40 transition-all"
          >
            <div className="flex flex-col items-center text-center py-4">
              <div className="w-16 h-16 flex items-center justify-center bg-[#00d084]/10 group-hover:bg-[#00d084]/20 rounded-xl mb-4 transition-colors">
                <Plus className="w-8 h-8 text-[#00d084]" />
              </div>
              <p className="font-bold text-lg text-[#313131] dark:text-white mb-2">Nieuwe Check</p>
              <p className="text-sm text-[#313131]/60 dark:text-gray-400">Start een nieuwe beoordeling</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

const SettingsView = ({ onReset }: any) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const SETTINGS_PASSWORD = 'admin2024';

  const handleLogin = () => {
    if (loginPassword === SETTINGS_PASSWORD) {
      setIsLoggedIn(true);
      setLoginError('');
      setLoginPassword('');
    } else {
      setLoginError('Onjuist wachtwoord! Probeer opnieuw.');
    }
  };

  const handleReset = () => {
    if (resetPassword !== '123456789') {
      alert('Onjuist wachtwoord voor reset!');
      return;
    }
    if (confirm('Weet je ABSOLUUT zeker dat je alle data wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
      onReset();
      setIsLoggedIn(false);
    }
  };

  // Login scherm
  if (!isLoggedIn) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Instellingen</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Login vereist voor toegang</p>
        </div>

        <div className="max-w-md mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-center mb-6">
              <div className="p-4 bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30 rounded-2xl">
                <Shield className="w-12 h-12 text-purple-600 dark:text-purple-400" />
              </div>
            </div>

            <h3 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-2">
              Beveiligde Toegang
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
              Voer uw wachtwoord in om toegang te krijgen tot instellingen
            </p>

            {loginError && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                <p className="text-sm text-red-600 dark:text-red-400 text-center">{loginError}</p>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  Wachtwoord
                </label>
                <div className="relative">
                  <input
                    type={showLoginPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => {
                      setLoginPassword(e.target.value);
                      setLoginError('');
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    placeholder="Voer wachtwoord in"
                  />
                </div>
                <button
                  onClick={() => setShowLoginPassword(!showLoginPassword)}
                  className="text-sm text-purple-600 dark:text-purple-400 hover:underline mt-2"
                >
                  {showLoginPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
                </button>
              </div>

              <button
                onClick={handleLogin}
                disabled={!loginPassword}
                className={`w-full px-6 py-3 rounded-xl font-bold text-lg transition-all duration-200 ${
                  loginPassword
                    ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:from-purple-700 hover:to-indigo-700 shadow-lg shadow-purple-500/50 hover:scale-[1.02] cursor-pointer'
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
                }`}
              >
                Inloggen
              </button>
            </div>

            <div className="mt-6 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                <strong>Standaard wachtwoord:</strong> admin2024
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Settings pagina (na login)
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Instellingen</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Systeeminstellingen en gevaarlijke acties</p>
        </div>
        <button
          onClick={() => setIsLoggedIn(false)}
          className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold transition-all"
        >
          Uitloggen
        </button>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3 mb-6">
          <Shield className="w-6 h-6 text-gray-600 dark:text-gray-400" />
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Gevaarlijke Zone</h3>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800 rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            <h4 className="text-xl font-bold text-red-900 dark:text-red-100">Data Reset</h4>
          </div>

          <p className="text-red-800 dark:text-red-200 mb-6">
            <strong>Let op!</strong> Deze actie verwijdert ALLE data permanent:
          </p>

          <ul className="list-disc list-inside text-red-700 dark:text-red-300 mb-6 space-y-1">
            <li>Alle ZZP'ers en organisaties</li>
            <li>Alle opdrachten en beoordelingen</li>
            <li>Alle gearchiveerde items</li>
            <li>Alle check resultaten en scores</li>
          </ul>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-red-900 dark:text-red-100 mb-2">
                Reset wachtwoord vereist:
              </label>
              <div className="relative">
                <input
                  type={showResetPassword ? 'text' : 'password'}
                  value={resetPassword}
                  onChange={(e) => setResetPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Voer wachtwoord in (123456789)"
                />
              </div>
              <button
                onClick={() => setShowResetPassword(!showResetPassword)}
                className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
              >
                {showResetPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
              </button>
            </div>

            <button
              onClick={handleReset}
              disabled={!resetPassword}
              className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                resetPassword
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-lg shadow-red-500/50 hover:scale-[1.02] cursor-pointer'
                  : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-500 cursor-not-allowed'
              }`}
            >
              🗑️ Reset Alle Data (Permanent!)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ArchivedView = ({ data, onUnarchive, onUnarchiveContractor, onUnarchiveOrganization }: any) => {
  const archivedEngagements = data.archivedEngagements || [];
  const archivedContractors = data.contractors.filter((c: any) => c.archived) || [];
  const archivedOrganizations = data.organizations.filter((o: any) => o.archived) || [];

  const totalArchived = archivedEngagements.length + archivedContractors.length + archivedOrganizations.length;

  const getContractor = (id: string) => data.contractors.find((c: any) => c.id === id);
  const getOrganization = (id: string) => data.organizations.find((o: any) => o.id === id);

  const getEngagementCount = (contractorId: string) => {
    return data.engagements.filter((e: any) => e.contractorId === contractorId).length;
  };

  const getOrgEngagementCount = (organizationId: string) => {
    return data.engagements.filter((e: any) => e.organizationId === organizationId).length;
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Archief</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Gearchiveerde opdrachten, ZZP&apos;ers en organisaties</p>
      </div>

      {totalArchived === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-12 border border-gray-200 dark:border-gray-700 text-center">
          <Archive className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <p className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Geen gearchiveerde items</p>
          <p className="text-gray-600 dark:text-gray-400">Items die je archiveert verschijnen hier</p>
        </div>
      )}

      {archivedContractors.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            Gearchiveerde ZZP&apos;ers ({archivedContractors.length})
          </h3>
          <div className="space-y-3">
            {archivedContractors.map((contractor: any) => (
              <div
                key={contractor.id}
                className="flex items-center justify-between p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{contractor.displayName}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contractor.email}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {getEngagementCount(contractor.id)} opdracht(en)
                  </p>
                </div>
                <button
                  onClick={() => onUnarchiveContractor(contractor.id)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-semibold transition-all duration-200"
                >
                  <Archive className="w-4 h-4" />
                  Terughalen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {archivedOrganizations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Building className="w-6 h-6 text-purple-600" />
            Gearchiveerde Organisaties ({archivedOrganizations.length})
          </h3>
          <div className="space-y-3">
            {archivedOrganizations.map((org: any) => (
              <div
                key={org.id}
                className="flex items-center justify-between p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800 hover:shadow-md transition-all duration-200"
              >
                <div className="flex-1">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white">{org.name}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {org.type === 'CLIENT' ? 'Opdrachtgever' : 'Leverancier'}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    {getOrgEngagementCount(org.id)} opdracht(en)
                  </p>
                </div>
                <button
                  onClick={() => onUnarchiveOrganization(org.id)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 font-semibold transition-all duration-200"
                >
                  <Archive className="w-4 h-4" />
                  Terughalen
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {archivedEngagements.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="w-6 h-6 text-green-600" />
            Gearchiveerde Opdrachten ({archivedEngagements.length})
          </h3>
          <div className="space-y-4">
            {archivedEngagements.map((engagement: any) => {
              const contractor = getContractor(engagement.contractorId);
              const organization = getOrganization(engagement.organizationId);

              return (
                <div
                  key={engagement.id}
                  className="flex items-center justify-between p-6 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex-1">
                    <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{engagement.roleTitle}</h4>
                    <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                      <p className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {contractor?.displayName || 'Onbekend'}
                        <span className="text-gray-400 dark:text-gray-500">@</span>
                        {organization?.name || 'Onbekend'}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Gearchiveerd op {new Date(engagement.archivedAt).toLocaleDateString('nl-NL')}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => onUnarchive(engagement.id)}
                    className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 font-semibold transition-all duration-200"
                  >
                    <Archive className="w-4 h-4" />
                    Terughalen
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

// Management Hub - keuze tussen ZZP'ers, Organisaties en Overzicht
const PeopleManagement = ({ data, onUpdate, onNavigate }: any) => {
  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl p-12 border border-gray-100 dark:border-gray-700">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">Beheer Hub</h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">Kies wat u wilt beheren</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => onNavigate('contractors')}
            className="p-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Users className="w-12 h-12 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xl mb-2">ZZP&apos;ers</p>
            <p className="text-sm opacity-90 mb-4">Beheer freelancers en contractors</p>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold">{data.contractors.length}</p>
              <p className="text-xs opacity-80">Totaal</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('organizations')}
            className="p-8 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <Building className="w-12 h-12 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xl mb-2">Organisaties</p>
            <p className="text-sm opacity-90 mb-4">Beheer opdrachtgevers en leveranciers</p>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold">{data.organizations.length}</p>
              <p className="text-xs opacity-80">Totaal</p>
            </div>
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="p-8 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 group"
          >
            <BarChart3 className="w-12 h-12 mb-4 mx-auto group-hover:scale-110 transition-transform" />
            <p className="font-bold text-xl mb-2">Dashboard</p>
            <p className="text-sm opacity-90 mb-4">Overzicht en statistieken</p>
            <div className="bg-white/20 rounded-lg p-3 text-center">
              <p className="text-3xl font-bold">{data.engagements.length}</p>
              <p className="text-xs opacity-80">Opdrachten</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

// Contractors Management met zoek en bulk operaties
const ContractorsManagement = ({ data, onUpdate, onBack }: any) => {
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  const addContractor = (formData: any) => {
    const newContractor = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      displayName: formData.displayName,
      email: formData.email,
      archived: false
    };
    const auditEvent = createAuditEvent('CREATE', 'ZZP\'er', formData.displayName, `Email: ${formData.email}`);
    onUpdate({
      ...data,
      contractors: [...data.contractors, newContractor],
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setShowAddContractor(false);
  };

  const handleDeleteContractor = (contractor: any) => {
    setDeleteItem({ type: 'ZZP\'er', item: contractor });
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    const auditEvent = createAuditEvent('DELETE', 'ZZP\'er', deleteItem.item.displayName, 'Inclusief bijbehorende opdrachten');
    onUpdate({
      ...data,
      contractors: data.contractors.filter((c: any) => c.id !== deleteItem.item.id),
      engagements: data.engagements.filter((e: any) => e.contractorId !== deleteItem.item.id),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setDeleteItem(null);
  };

  const filteredContractors = data.contractors
    .filter((c: any) => !c.archived)
    .filter((contractor: any) => {
      const matchesSearch = searchQuery === '' ||
        contractor.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contractor.email.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSearch;
    });

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredContractors.map((c: any) => c.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Weet u zeker dat u ${selectedItems.length} ZZP'er(s) wilt verwijderen?`)) return;

    const auditEvent = createAuditEvent('BULK_DELETE', 'ZZP\'ers', `${selectedItems.length} ZZP'ers`, 'Inclusief bijbehorende opdrachten');
    onUpdate({
      ...data,
      contractors: data.contractors.filter((c: any) => !selectedItems.includes(c.id)),
      engagements: data.engagements.filter((e: any) => !selectedItems.includes(e.contractorId)),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setSelectedItems([]);
    setBulkMode(false);
  };

  const handleBulkArchive = () => {
    if (selectedItems.length === 0) return;

    const auditEvent = createAuditEvent('BULK_ARCHIVE', 'ZZP\'ers', `${selectedItems.length} ZZP'ers`, 'Gearchiveerd via bulk operatie');
    onUpdate({
      ...data,
      contractors: data.contractors.map((c: any) =>
        selectedItems.includes(c.id) ? { ...c, archived: true } : c
      ),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setSelectedItems([]);
    setBulkMode(false);
  };

  const getEngagementCount = (contractorId: string) => {
    return data.engagements.filter((e: any) => e.contractorId === contractorId).length;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">ZZP&apos;ers Beheer</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">({filteredContractors.length})</span>
          </div>
          <div className="flex items-center gap-3">
            {bulkMode && selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700 font-semibold transition-all"
                >
                  <Archive className="w-4 h-4" />
                  Archiveer ({selectedItems.length})
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Verwijder ({selectedItems.length})
                </button>
              </div>
            )}
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                bulkMode
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {bulkMode ? 'Annuleer' : 'Bulk Modus'}
            </button>
            <button
              onClick={() => setShowAddContractor(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nieuwe ZZP&apos;er
            </button>
          </div>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Zoek op naam of email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>
        </div>

        {bulkMode && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl">
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Selecteer Alles
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={deselectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Deselecteer Alles
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
              {selectedItems.length} geselecteerd
            </span>
          </div>
        )}

        <div className="space-y-3">
          {filteredContractors.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Geen ZZP&apos;ers gevonden</p>
              {searchQuery && <p className="text-sm mt-2">Probeer een andere zoekopdracht</p>}
            </div>
          ) : (
            filteredContractors.map((contractor: any) => (
              <div
                key={contractor.id}
                className={`flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border transition-all duration-200 ${
                  selectedItems.includes(contractor.id)
                    ? 'border-blue-500 ring-2 ring-blue-200 dark:ring-blue-800'
                    : 'border-blue-100 dark:border-blue-800 hover:shadow-md'
                }`}
              >
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(contractor.id)}
                    onChange={() => toggleSelectItem(contractor.id)}
                    className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{contractor.displayName}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{contractor.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getEngagementCount(contractor.id)} opdracht(en)
                    </p>
                  </div>
                  {!bulkMode && (
                    <button
                      onClick={() => handleDeleteContractor(contractor)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      title="Verwijder ZZP'er"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddContractor && <AddContractorModal onClose={() => setShowAddContractor(false)} onAdd={addContractor} />}
      {deleteItem && (
        <DeleteConfirmModal
          onClose={() => setDeleteItem(null)}
          onConfirm={confirmDelete}
          itemName={deleteItem.item.displayName}
          itemType={deleteItem.type}
        />
      )}
    </div>
  );
};

// Organizations Management met zoek en bulk operaties
const OrganizationsManagement = ({ data, onUpdate, onBack }: any) => {
  const [showAddOrg, setShowAddOrg] = useState(false);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  const addOrganization = (formData: any) => {
    const newOrg = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      name: formData.name,
      type: formData.type,
      archived: false
    };
    const auditEvent = createAuditEvent('CREATE', 'Organisatie', formData.name, `Type: ${formData.type === 'CLIENT' ? 'Opdrachtgever' : 'Leverancier'}`);
    onUpdate({
      ...data,
      organizations: [...data.organizations, newOrg],
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setShowAddOrg(false);
  };

  const handleDeleteOrganization = (org: any) => {
    setDeleteItem({ type: 'Organisatie', item: org });
  };

  const confirmDelete = () => {
    if (!deleteItem) return;
    const auditEvent = createAuditEvent('DELETE', 'Organisatie', deleteItem.item.name, 'Inclusief bijbehorende opdrachten');
    onUpdate({
      ...data,
      organizations: data.organizations.filter((o: any) => o.id !== deleteItem.item.id),
      engagements: data.engagements.filter((e: any) => e.organizationId !== deleteItem.item.id),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setDeleteItem(null);
  };

  const filteredOrganizations = data.organizations
    .filter((o: any) => !o.archived)
    .filter((org: any) => {
      const matchesSearch = searchQuery === '' ||
        org.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'ALL' || org.type === typeFilter;
      return matchesSearch && matchesType;
    });

  const toggleSelectItem = (id: string) => {
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredOrganizations.map((o: any) => o.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    if (!confirm(`Weet u zeker dat u ${selectedItems.length} organisatie(s) wilt verwijderen?`)) return;

    const auditEvent = createAuditEvent('BULK_DELETE', 'Organisaties', `${selectedItems.length} organisaties`, 'Inclusief bijbehorende opdrachten');
    onUpdate({
      ...data,
      organizations: data.organizations.filter((o: any) => !selectedItems.includes(o.id)),
      engagements: data.engagements.filter((e: any) => !selectedItems.includes(e.organizationId)),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setSelectedItems([]);
    setBulkMode(false);
  };

  const handleBulkArchive = () => {
    if (selectedItems.length === 0) return;

    const auditEvent = createAuditEvent('BULK_ARCHIVE', 'Organisaties', `${selectedItems.length} organisaties`, 'Gearchiveerd via bulk operatie');
    onUpdate({
      ...data,
      organizations: data.organizations.map((o: any) =>
        selectedItems.includes(o.id) ? { ...o, archived: true } : o
      ),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    });
    setSelectedItems([]);
    setBulkMode(false);
  };

  const getEngagementCount = (organizationId: string) => {
    return data.engagements.filter((e: any) => e.organizationId === organizationId).length;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-all"
            >
              <X className="w-6 h-6 text-gray-600 dark:text-gray-400" />
            </button>
            <Building className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Organisaties Beheer</h2>
            <span className="text-sm text-gray-500 dark:text-gray-400">({filteredOrganizations.length})</span>
          </div>
          <div className="flex items-center gap-3">
            {bulkMode && selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleBulkArchive}
                  className="flex items-center gap-2 bg-yellow-600 text-white px-4 py-2 rounded-xl hover:bg-yellow-700 font-semibold transition-all"
                >
                  <Archive className="w-4 h-4" />
                  Archiveer ({selectedItems.length})
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl hover:bg-red-700 font-semibold transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                  Verwijder ({selectedItems.length})
                </button>
              </div>
            )}
            <button
              onClick={() => setBulkMode(!bulkMode)}
              className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                bulkMode
                  ? 'bg-gray-600 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {bulkMode ? 'Annuleer' : 'Bulk Modus'}
            </button>
            <button
              onClick={() => setShowAddOrg(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg shadow-purple-500/50 transition-all duration-200 hover:scale-105"
            >
              <Plus className="w-5 h-5" />
              Nieuwe Organisatie
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Zoek op naam..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all appearance-none"
            >
              <option value="ALL">Alle Types</option>
              <option value="CLIENT">Opdrachtgevers</option>
              <option value="VENDOR">Leveranciers</option>
            </select>
          </div>
        </div>

        {bulkMode && (
          <div className="mb-4 flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
            <button
              onClick={selectAll}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Selecteer Alles
            </button>
            <span className="text-gray-400">|</span>
            <button
              onClick={deselectAll}
              className="text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              Deselecteer Alles
            </button>
            <span className="text-sm text-gray-600 dark:text-gray-400 ml-auto">
              {selectedItems.length} geselecteerd
            </span>
          </div>
        )}

        <div className="space-y-3">
          {filteredOrganizations.length === 0 ? (
            <div className="text-center py-12 text-gray-500 dark:text-gray-400">
              <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg">Geen organisaties gevonden</p>
              {searchQuery && <p className="text-sm mt-2">Probeer een andere zoekopdracht</p>}
            </div>
          ) : (
            filteredOrganizations.map((org: any) => (
              <div
                key={org.id}
                className={`flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border transition-all duration-200 ${
                  selectedItems.includes(org.id)
                    ? 'border-purple-500 ring-2 ring-purple-200 dark:ring-purple-800'
                    : 'border-purple-100 dark:border-purple-800 hover:shadow-md'
                }`}
              >
                {bulkMode && (
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(org.id)}
                    onChange={() => toggleSelectItem(org.id)}
                    className="w-5 h-5 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                )}
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 dark:text-white">{org.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {org.type === 'CLIENT' ? 'Opdrachtgever' : 'Leverancier'}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white">
                      {getEngagementCount(org.id)} opdracht(en)
                    </p>
                  </div>
                  {!bulkMode && (
                    <button
                      onClick={() => handleDeleteOrganization(org)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-all duration-200"
                      title="Verwijder organisatie"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showAddOrg && <AddOrganizationModal onClose={() => setShowAddOrg(false)} onAdd={addOrganization} />}
      {deleteItem && (
        <DeleteConfirmModal
          onClose={() => setDeleteItem(null)}
          onConfirm={confirmDelete}
          itemName={deleteItem.item.name}
          itemType={deleteItem.type}
        />
      )}
    </div>
  );
};

const EngagementList = ({ data, onSelectEngagement, onAddEngagement, onBulkDelete, onBulkArchive }: any) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState((window as any).statusFilter || 'ALL');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [bulkMode, setBulkMode] = useState(false);

  useEffect(() => {
    if ((window as any).statusFilter) {
      setStatusFilter((window as any).statusFilter);
      (window as any).statusFilter = null;
    }
  }, []);

  const getLatestCheckRun = (engagementId: string) => {
    return data.checkRuns
      .filter((cr: any) => cr.engagementId === engagementId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getContractor = (id: string) => data.contractors.find((c: any) => c.id === id);
  const getOrganization = (id: string) => data.organizations.find((o: any) => o.id === id);

  const filteredEngagements = data.engagements.filter((engagement: any) => {
    const contractor = getContractor(engagement.contractorId);
    const organization = getOrganization(engagement.organizationId);
    const latestCheck = getLatestCheckRun(engagement.id);
    const scoreResult = latestCheck ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheck.id) : null;
    const status = scoreResult?.status || 'PLANNED';

    const matchesSearch = searchQuery === '' ||
      engagement.roleTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contractor?.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      organization?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'ALL' || status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const toggleSelectItem = (e: React.ChangeEvent<HTMLInputElement>, id: string) => {
    e.stopPropagation();
    setSelectedItems(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    setSelectedItems(filteredEngagements.map((e: any) => e.id));
  };

  const deselectAll = () => {
    setSelectedItems([]);
  };

  const handleBulkDelete = () => {
    if (selectedItems.length === 0) return;
    onBulkDelete(selectedItems);
    setSelectedItems([]);
    setBulkMode(false);
  };

  const handleBulkArchive = () => {
    if (selectedItems.length === 0) return;
    onBulkArchive(selectedItems);
    setSelectedItems([]);
    setBulkMode(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Opdrachten</h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Overzicht van alle ZZP-opdrachten en hun compliance status</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => setBulkMode(!bulkMode)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              bulkMode
                ? 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
                : 'border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
            }`}
          >
            <Filter className="w-5 h-5" />
            {bulkMode ? 'Bulk Mode Uit' : 'Bulk Selectie'}
          </button>
          <button
            onClick={onAddEngagement}
            className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Opdracht
          </button>
        </div>
      </div>

      {bulkMode && selectedItems.length > 0 && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-200 dark:border-blue-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
              {selectedItems.length} item(s) geselecteerd
            </p>
            <button
              onClick={selectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Alles selecteren
            </button>
            <button
              onClick={deselectAll}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Deselecteren
            </button>
          </div>
          <div className="flex gap-3">
            <button
              onClick={handleBulkArchive}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 font-semibold transition-all duration-200"
            >
              <Archive className="w-4 h-4" />
              Archiveren
            </button>
            <button
              onClick={handleBulkDelete}
              className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 font-semibold transition-all duration-200"
            >
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </button>
          </div>
        </div>
      )}

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Zoek op rol, ZZP'er of organisatie..."
            className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="ALL">Alle Statussen</option>
          <option value="GOEDGEKEURD">Goedgekeurd</option>
          <option value="TER_BEOORDELING">Ter Beoordeling</option>
          <option value="AFGEKEURD">Afgekeurd</option>
          <option value="PLANNED">Nog Te Beoordelen</option>
        </select>
      </div>

      <div className="grid gap-6">
        {filteredEngagements.map((engagement: any) => {
          const contractor = getContractor(engagement.contractorId);
          const organization = getOrganization(engagement.organizationId);
          const latestCheck = getLatestCheckRun(engagement.id);
          const scoreResult = latestCheck ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheck.id) : null;

          return (
            <div
              key={engagement.id}
              onClick={() => {
                if (bulkMode) {
                  const e = { stopPropagation: () => {} } as React.ChangeEvent<HTMLInputElement>;
                  toggleSelectItem(e, engagement.id);
                } else {
                  onSelectEngagement(engagement.id);
                }
              }}
              className={`bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border-2 transition-all duration-300 cursor-pointer transform hover:scale-[1.02] ${
                bulkMode && selectedItems.includes(engagement.id)
                  ? 'border-blue-500 dark:border-blue-400 shadow-blue-500/50'
                  : 'border-gray-200 dark:border-gray-700 hover:shadow-2xl'
              }`}
            >
              <div className="flex items-start justify-between">
                {bulkMode && (
                  <div className="mr-4 pt-1" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(engagement.id)}
                      onChange={(e) => toggleSelectItem(e, engagement.id)}
                      className="w-6 h-6 rounded border-2 border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{engagement.roleTitle}</h3>
                    {scoreResult && <StatusBadge status={scoreResult.status} />}
                    {!scoreResult && <StatusBadge status="PLANNED" />}
                  </div>
                  <div className="space-y-2 text-gray-600 dark:text-gray-400">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{contractor?.displayName}</span>
                      <span className="text-gray-400 dark:text-gray-500">@</span>
                      <span className="font-semibold">{organization?.name}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {engagement.startDate} {engagement.endDate && `— ${engagement.endDate}`}
                    </p>
                    {engagement.rateHourly > 0 && (
                      <p className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        €{engagement.rateHourly}/uur
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {scoreResult && (
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Laatste check: {new Date(latestCheck.timestamp).toLocaleDateString('nl-NL')} • Score: {scoreResult.totalScore}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EngagementDetail = ({ engagement, data, onUpdate, onBack }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);
  const [showExport, setShowExport] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Set<string>>(new Set());
  const [showValidationError, setShowValidationError] = useState(false);

  const contractor = data.contractors.find((c: any) => c.id === engagement.contractorId);
  const organization = data.organizations.find((o: any) => o.id === engagement.organizationId);
  const questionnaire = data.questionnaires[0];
  const questions = data.questions.filter((q: any) => q.questionnaireId === questionnaire.id).sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  const latestCheckRun = data.checkRuns
    .filter((cr: any) => cr.engagementId === engagement.id)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const scoreResult = latestCheckRun ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheckRun.id) : null;

  const handleAnswerChange = (questionKey: string, value: any) => {
    setAnswers({ ...answers, [questionKey]: value });
    // Remove from validation errors when answered
    if (validationErrors.has(questionKey)) {
      const newErrors = new Set(validationErrors);
      newErrors.delete(questionKey);
      setValidationErrors(newErrors);
    }
    if (showValidationError) {
      setShowValidationError(false);
    }
  };

  const handleSubmit = () => {
    // Validate that all questions are answered
    const unansweredQuestions = questions.filter((q: any) => {
      const answer = answers[q.key];
      return answer === undefined || answer === null || answer === '';
    });

    if (unansweredQuestions.length > 0) {
      const errorKeys = new Set<string>(unansweredQuestions.map((q: any) => q.key));
      setValidationErrors(errorKeys);
      setShowValidationError(true);
      // Scroll to first error
      const firstErrorElement = document.getElementById(`question-${unansweredQuestions[0].key}`);
      if (firstErrorElement) {
        firstErrorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }

    const checkRunId = String(Date.now());
    const timestamp = new Date().toISOString();

    const newCheckRun = {
      id: checkRunId,
      tenantId: data.tenant.id,
      engagementId: engagement.id,
      questionnaireId: questionnaire.id,
      timestamp,
      completedBy: 'Demo User'
    };

    const newAnswers = Object.entries(answers).map(([key, value]) => {
      const question = questions.find((q: any) => q.key === key);
      return {
        id: `${checkRunId}-${key}`,
        checkRunId,
        questionId: question.id,
        value: typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)
      };
    });

    const score = computeScore(answers);
    const newScoreResult = {
      id: String(Date.now()) + '-score',
      checkRunId,
      totalScore: score.totalScore,
      status: score.status,
      verdict: score.verdict,
      rulesetVersion: score.rulesetVersion,
      triggeredRules: JSON.stringify(score.triggeredRules),
      adviceForContractor: score.adviceForContractor,
      adviceForClient: score.adviceForClient
    };

    onUpdate({
      ...data,
      checkRuns: [...data.checkRuns, newCheckRun],
      answers: [...data.answers, ...newAnswers],
      scoreResults: [...data.scoreResults, newScoreResult]
    });

    setShowResults(true);
  };

  if (showResults && scoreResult) {
    const triggeredRules = JSON.parse(scoreResult.triggeredRules || '[]');
    const criticalRules = triggeredRules.filter((r: any) => r.category === 'critical');
    const highRiskRules = triggeredRules.filter((r: any) => r.category === 'high');
    const mediumRiskRules = triggeredRules.filter((r: any) => r.category === 'medium');
    const positiveRules = triggeredRules.filter((r: any) => r.category === 'positive');

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
          >
            ← Terug naar overzicht
          </button>
          <button
            onClick={() => setShowExport(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/50 transition-all duration-200"
          >
            <Download className="w-5 h-5" />
            Exporteer Rapport
          </button>
        </div>

        {showExport && (
          <ExportModal
            onClose={() => setShowExport(false)}
            scoreResult={scoreResult}
            engagement={engagement}
            contractor={contractor}
            organization={organization}
          />
        )}

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-10 border-2 border-gray-200 dark:border-gray-700">
          <div className="text-center mb-8">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-200 rounded-full text-sm font-semibold mb-4">
              Multi-arrest Compliance Beoordeling
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">{engagement.roleTitle}</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6 text-lg">{contractor?.displayName} @ {organization?.name}</p>
            <div className="mb-6">
              <StatusBadge status={scoreResult.status} />
            </div>
            <div className={`p-6 rounded-2xl ${
              scoreResult.status === 'GOEDGEKEURD' ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-200 dark:border-green-800' :
              scoreResult.status === 'AFGEKEURD' ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-200 dark:border-red-800' :
              'bg-orange-50 dark:bg-orange-900/20 border-2 border-orange-200 dark:border-orange-800'
            }`}>
              <p className={`text-lg font-semibold ${
                scoreResult.status === 'GOEDGEKEURD' ? 'text-green-900 dark:text-green-100' :
                scoreResult.status === 'AFGEKEURD' ? 'text-red-900 dark:text-red-100' :
                'text-orange-900 dark:text-orange-100'
              }`}>
                {scoreResult.verdict || 'Beoordeling voltooied'}
              </p>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-600">
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{scoreResult.totalScore}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Risico Score</p>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 p-6 rounded-xl border border-red-200 dark:border-red-800">
                <p className="text-3xl font-bold text-red-900 dark:text-red-100">{criticalRules.length + highRiskRules.length + mediumRiskRules.length}</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">Risicofactoren</p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200 dark:border-green-800">
                <p className="text-3xl font-bold text-green-900 dark:text-green-100">{positiveRules.length}</p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">Positieve Factoren</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {criticalRules.length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-6 border-2 border-red-200 dark:border-red-800">
                <h3 className="text-xl font-bold text-red-900 dark:text-red-100 mb-4 flex items-center gap-2">
                  <AlertCircle className="w-6 h-6" />
                  Kritieke Risicofactoren
                </h3>
                <div className="space-y-3">
                  {criticalRules.map((rule: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-red-300 dark:border-red-700">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/40">
                          <AlertCircle className="w-5 h-5 text-red-700 dark:text-red-300" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-red-900 dark:text-red-100">{rule.label}</p>
                          <p className="text-sm text-red-700 dark:text-red-300 mt-1">{rule.recommendation}</p>
                          <p className="text-xs text-red-600 dark:text-red-400 mt-2 font-semibold">Risico-impact: +{rule.weight} punten</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highRiskRules.length > 0 && (
              <div className="bg-orange-50 dark:bg-orange-900/20 rounded-2xl p-6 border-2 border-orange-200 dark:border-orange-800">
                <h3 className="text-xl font-bold text-orange-900 dark:text-orange-100 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Hoge Risicofactoren
                </h3>
                <div className="space-y-3">
                  {highRiskRules.map((rule: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-orange-300 dark:border-orange-700">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/40">
                          <AlertTriangle className="w-5 h-5 text-orange-700 dark:text-orange-300" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-orange-900 dark:text-orange-100">{rule.label}</p>
                          <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">{rule.recommendation}</p>
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-2 font-semibold">Risico-impact: +{rule.weight} punten</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {mediumRiskRules.length > 0 && (
              <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-2xl p-6 border-2 border-yellow-200 dark:border-yellow-800">
                <h3 className="text-xl font-bold text-yellow-900 dark:text-yellow-100 mb-4">Gemiddelde Risicofactoren</h3>
                <div className="space-y-3">
                  {mediumRiskRules.map((rule: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border border-yellow-300 dark:border-yellow-700">
                      <p className="font-semibold text-yellow-900 dark:text-yellow-100">{rule.label}</p>
                      <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">{rule.recommendation}</p>
                      <p className="text-xs text-yellow-600 dark:text-yellow-400 mt-2">Impact: +{rule.weight} punten</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {positiveRules.length > 0 && (
              <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6 border-2 border-green-200 dark:border-green-800">
                <h3 className="text-xl font-bold text-green-900 dark:text-green-100 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-6 h-6" />
                  Positieve Factoren (Zelfstandigheid)
                </h3>
                <div className="space-y-3">
                  {positiveRules.map((rule: any, idx: number) => (
                    <div key={idx} className="bg-white dark:bg-gray-800 rounded-lg p-4 border-2 border-green-300 dark:border-green-700">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/40">
                          <CheckCircle className="w-5 h-5 text-green-700 dark:text-green-300" />
                        </div>
                        <div className="flex-1">
                          <p className="font-bold text-green-900 dark:text-green-100">{rule.label}</p>
                          <p className="text-sm text-green-700 dark:text-green-300 mt-1">{rule.recommendation}</p>
                          <p className="text-xs text-green-600 dark:text-green-400 mt-2 font-semibold">Positieve impact: {rule.weight} punten</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {(scoreResult.adviceForContractor || scoreResult.adviceForClient) && (
            <div className="mt-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Advies voor Verbetering</h3>

              {scoreResult.adviceForContractor && (
                <div className="bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 rounded-2xl p-6 border-2 border-blue-200 dark:border-blue-800">
                  <h4 className="text-xl font-bold text-blue-900 dark:text-blue-100 mb-4 flex items-center gap-2">
                    <Users className="w-6 h-6" />
                    Voor de ZZP&apos;er
                  </h4>
                  <div className="space-y-3 text-blue-900 dark:text-blue-100">
                    {scoreResult.adviceForContractor.split('\n\n').map((advice: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                        <div className="p-1 bg-blue-500 rounded-full mt-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <p className="flex-1 text-sm font-medium">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {scoreResult.adviceForClient && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 rounded-2xl p-6 border-2 border-purple-200 dark:border-purple-800">
                  <h4 className="text-xl font-bold text-purple-900 dark:text-purple-100 mb-4 flex items-center gap-2">
                    <Building className="w-6 h-6" />
                    Voor de Opdrachtgever
                  </h4>
                  <div className="space-y-3 text-purple-900 dark:text-purple-100">
                    {scoreResult.adviceForClient.split('\n\n').map((advice: string, idx: number) => (
                      <div key={idx} className="flex items-start gap-3 p-4 bg-white/50 dark:bg-gray-800/50 rounded-xl">
                        <div className="p-1 bg-purple-500 rounded-full mt-1">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                        <p className="flex-1 text-sm font-medium">{advice}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="mt-8 pt-8 border-t-2 border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Beoordeeld op {new Date(latestCheckRun.timestamp).toLocaleDateString('nl-NL', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
              Ruleset versie: {scoreResult.rulesetVersion}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
      >
        ← Terug naar overzicht
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{engagement.roleTitle}</h2>
          <div className="flex items-center gap-4 text-gray-600 dark:text-gray-400">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {contractor?.displayName}
            </span>
            <span className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {organization?.name}
            </span>
          </div>
        </div>

        {scoreResult && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Laatste beoordeling</p>
                <StatusBadge status={scoreResult.status} />
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Bekijk details →
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Nieuwe Beoordeling</h3>
            <p className="text-gray-600 dark:text-gray-400">Beantwoord de vragen volgens de criteria uit het Deliveroo-arrest, Groen/Schoevers-arrest en Helpling-arrest</p>
          </div>

          {showValidationError && (
            <div className="p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-700 rounded-xl flex items-start gap-3 animate-in slide-in-from-top-2">
              <AlertCircle className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 dark:text-red-200">Niet alle vragen zijn beantwoord</p>
                <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                  Beantwoord alle vragen voordat u de beoordeling indient. De niet-ingevulde vragen zijn hieronder gemarkeerd.
                </p>
              </div>
            </div>
          )}

          {questions.map((question: any) => {
            const hasError = validationErrors.has(question.key);
            return (
              <div
                key={question.id}
                id={`question-${question.key}`}
                className={`p-6 rounded-xl border-2 transition-all duration-200 ${
                  hasError
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-500 dark:border-red-700 animate-pulse'
                    : 'bg-gray-50 dark:bg-gray-700/50 border-gray-200 dark:border-gray-600'
                }`}
              >
                <div className="flex items-start gap-2 mb-4">
                  <label className="block text-gray-900 dark:text-white font-semibold flex-1">
                    {question.prompt}
                  </label>
                  {hasError && (
                    <span className="flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-semibold">
                      <AlertCircle className="w-4 h-4" />
                      Verplicht
                    </span>
                  )}
                </div>
                {question.type === 'BOOLEAN' ? (
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleAnswerChange(question.key, true)}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        answers[question.key] === true
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                          : hasError
                          ? 'bg-white dark:bg-gray-700 border-2 border-red-500 dark:border-red-700 text-gray-700 dark:text-gray-300 hover:border-green-500'
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-500'
                      }`}
                    >
                      Ja
                    </button>
                    <button
                      onClick={() => handleAnswerChange(question.key, false)}
                      className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        answers[question.key] === false
                          ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50'
                          : hasError
                          ? 'bg-white dark:bg-gray-700 border-2 border-red-500 dark:border-red-700 text-gray-700 dark:text-gray-300 hover:border-red-500'
                          : 'bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-red-500'
                      }`}
                    >
                      Nee
                    </button>
                  </div>
                ) : (
                  <textarea
                    value={answers[question.key] || ''}
                    onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                    className={`w-full px-4 py-3 border-2 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${
                      hasError
                        ? 'border-red-500 dark:border-red-700 bg-white dark:bg-gray-800 dark:text-white'
                        : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 dark:text-white'
                    }`}
                    rows={4}
                    placeholder="Voer hier uw antwoord in..."
                  />
                )}
                {hasError && (
                  <p className="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                    Dit veld is verplicht
                  </p>
                )}
              </div>
            );
          })}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02]"
          >
            Beoordeling Indienen
          </button>
        </div>
      </div>
    </div>
  );
};

// Helper function to log audit events
const createAuditEvent = (action: string, entityType: string, entityName: string, details?: string) => {
  return {
    id: String(Date.now() + Math.random()),
    timestamp: new Date().toISOString(),
    action,
    entityType,
    entityName,
    details: details || '',
    user: 'System User'
  };
};

export default function ZZPComplianceApp() {
  const [data, setData] = useState(initializeData);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('payment');
  const [showAddEngagement, setShowAddEngagement] = useState(false);
  const [isPaid, setIsPaid] = useState(false);

  useEffect(() => {
    const paymentStatus = localStorage.getItem('zzp_payment_status') === 'paid';

    // Altijd dark mode activeren
    document.documentElement.classList.add('dark');

    setIsPaid(paymentStatus);
    if (paymentStatus) {
      setCurrentView('dashboard');
    } else {
      setCurrentView('payment');
    }
  }, []);

  const handleUpdate = (newData: any) => {
    setData(newData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zzp_compliance_data', JSON.stringify(newData));
      localStorage.setItem('zzp_compliance_version', DATA_VERSION);
    }
  };

  const handleReset = () => {
    if (confirm('Weet je zeker dat je alle data wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('zzp_compliance_data');
        localStorage.removeItem('zzp_compliance_version');
        window.location.reload();
      }
    }
  };

  const addEngagement = (formData: any) => {
    const newEngagement = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      organizationId: formData.organizationId,
      contractorId: formData.contractorId,
      roleTitle: formData.roleTitle,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      rateHourly: formData.rateHourly,
      metadata: {}
    };
    handleUpdate({ ...data, engagements: [...data.engagements, newEngagement] });
  };

  const handleBulkDeleteEngagements = (ids: string[]) => {
    if (!confirm(`Weet je zeker dat je ${ids.length} opdracht(en) definitief wilt verwijderen?`)) {
      return;
    }
    const auditEvent = createAuditEvent('BULK_DELETE', 'Opdrachten', `${ids.length} opdrachten`, 'Inclusief bijbehorende check runs en antwoorden');
    const newData = {
      ...data,
      engagements: data.engagements.filter((e: any) => !ids.includes(e.id)),
      checkRuns: data.checkRuns.filter((cr: any) => !ids.includes(cr.engagementId)),
      answers: data.answers.filter((a: any) => {
        const checkRun = data.checkRuns.find((cr: any) => cr.id === a.checkRunId);
        return checkRun && !ids.includes(checkRun.engagementId);
      }),
      scoreResults: data.scoreResults.filter((sr: any) => {
        const checkRun = data.checkRuns.find((cr: any) => cr.id === sr.checkRunId);
        return checkRun && !ids.includes(checkRun.engagementId);
      }),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    };
    handleUpdate(newData);
  };

  const handleBulkArchiveEngagements = (ids: string[]) => {
    const engagementsToArchive = data.engagements.filter((e: any) => ids.includes(e.id));
    const auditEvent = createAuditEvent('BULK_ARCHIVE', 'Opdrachten', `${ids.length} opdrachten`, 'Gearchiveerd via bulk operatie');
    const newData = {
      ...data,
      engagements: data.engagements.filter((e: any) => !ids.includes(e.id)),
      archivedEngagements: [...(data.archivedEngagements || []), ...engagementsToArchive.map((e: any) => ({
        ...e,
        archivedAt: new Date().toISOString()
      }))],
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    };
    handleUpdate(newData);
  };

  const handleUnarchiveEngagement = (id: string) => {
    const engagementToUnarchive = data.archivedEngagements.find((e: any) => e.id === id);
    if (!engagementToUnarchive) return;

    const { archivedAt, ...engagement } = engagementToUnarchive;
    const auditEvent = createAuditEvent('UNARCHIVE', 'Opdracht', engagement.roleTitle, 'Teruggehaald uit archief');
    const newData = {
      ...data,
      archivedEngagements: data.archivedEngagements.filter((e: any) => e.id !== id),
      engagements: [...data.engagements, engagement],
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    };
    handleUpdate(newData);
  };

  const handleUnarchiveContractor = (id: string) => {
    const contractor = data.contractors.find((c: any) => c.id === id);
    if (!contractor) return;

    const auditEvent = createAuditEvent('UNARCHIVE', 'ZZP\'er', contractor.displayName, 'Teruggehaald uit archief');
    const newData = {
      ...data,
      contractors: data.contractors.map((c: any) =>
        c.id === id ? { ...c, archived: false } : c
      ),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    };
    handleUpdate(newData);
  };

  const handleUnarchiveOrganization = (id: string) => {
    const org = data.organizations.find((o: any) => o.id === id);
    if (!org) return;

    const auditEvent = createAuditEvent('UNARCHIVE', 'Organisatie', org.name, 'Teruggehaald uit archief');
    const newData = {
      ...data,
      organizations: data.organizations.map((o: any) =>
        o.id === id ? { ...o, archived: false } : o
      ),
      auditEvents: [auditEvent, ...(data.auditEvents || [])]
    };
    handleUpdate(newData);
  };

  const handlePaymentComplete = () => {
    setIsPaid(true);
    setCurrentView('dashboard');
  };

  const selectedEngagementData = selectedEngagement
    ? data.engagements.find((e: any) => e.id === selectedEngagement)
    : null;

  // Payment wall - show payment screen if not paid
  if (!isPaid) {
    return <PaymentView onPaymentComplete={handlePaymentComplete} />;
  }

  return (
    <div className="min-h-screen dark bg-gray-900">
      {/* Professional ZenoZorg Header */}
      <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo & Brand */}
            <button
              onClick={() => { setCurrentView('dashboard'); setSelectedEngagement(null); }}
              className="flex items-center gap-3 hover:opacity-90 transition-opacity group"
              title="ZZP Compliance Toolkit"
            >
              <div className="flex items-center justify-center w-12 h-12 bg-[#7a00df] rounded-lg shadow-sm group-hover:shadow-md transition-all">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-lg font-bold text-[#313131] dark:text-white leading-none">ZZP Compliance</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">Toolkit voor ZZP'ers</span>
              </div>
            </button>

            {/* Navigation & Actions */}
            <div className="flex items-center gap-6">
              <nav className="hidden lg:flex items-center gap-1">
                <button
                  onClick={() => { setCurrentView('dashboard'); setSelectedEngagement(null); }}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'dashboard'
                      ? 'bg-[#7a00df] text-white'
                      : 'text-[#313131] dark:text-gray-300 hover:bg-[#eeeeee] dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Home className="w-4 h-4" />
                    <span>Dashboard</span>
                  </div>
                </button>
                <button
                  onClick={() => { setCurrentView('engagements'); setSelectedEngagement(null); }}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'engagements'
                      ? 'bg-[#7a00df] text-white'
                      : 'text-[#313131] dark:text-gray-300 hover:bg-[#eeeeee] dark:hover:bg-gray-700'
                  }`}
                >
                  Opdrachten
                </button>
                <button
                  onClick={() => { setCurrentView('people'); setSelectedEngagement(null); }}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'people' || currentView === 'contractors' || currentView === 'organizations'
                      ? 'bg-[#7a00df] text-white'
                      : 'text-[#313131] dark:text-gray-300 hover:bg-[#eeeeee] dark:hover:bg-gray-700'
                  }`}
                >
                  Beheer
                </button>
                <button
                  onClick={() => { setCurrentView('archive'); setSelectedEngagement(null); }}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'archive'
                      ? 'bg-[#7a00df] text-white'
                      : 'text-[#313131] dark:text-gray-300 hover:bg-[#eeeeee] dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Archive className="w-4 h-4" />
                    <span>Archief</span>
                  </div>
                </button>
                <button
                  onClick={() => { setCurrentView('settings'); setSelectedEngagement(null); }}
                  className={`px-4 py-2 rounded-md font-medium text-sm transition-all ${
                    currentView === 'settings'
                      ? 'bg-[#7a00df] text-white'
                      : 'text-[#313131] dark:text-gray-300 hover:bg-[#eeeeee] dark:hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    <span>Instellingen</span>
                  </div>
                </button>
              </nav>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        {currentView === 'dashboard' && (
          <Dashboard data={data} onNavigate={setCurrentView} />
        )}

        {currentView === 'engagements' && !selectedEngagement && (
          <EngagementList
            data={data}
            onSelectEngagement={setSelectedEngagement}
            onAddEngagement={() => setShowAddEngagement(true)}
            onBulkDelete={handleBulkDeleteEngagements}
            onBulkArchive={handleBulkArchiveEngagements}
          />
        )}

        {currentView === 'engagements' && selectedEngagement && selectedEngagementData && (
          <EngagementDetail
            engagement={selectedEngagementData}
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setSelectedEngagement(null)}
          />
        )}

        {currentView === 'people' && (
          <PeopleManagement data={data} onUpdate={handleUpdate} onNavigate={setCurrentView} />
        )}

        {currentView === 'contractors' && (
          <ContractorsManagement
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setCurrentView('people')}
          />
        )}

        {currentView === 'organizations' && (
          <OrganizationsManagement
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setCurrentView('people')}
          />
        )}

        {currentView === 'archive' && (
          <ArchivedView
            data={data}
            onUnarchive={handleUnarchiveEngagement}
            onUnarchiveContractor={handleUnarchiveContractor}
            onUnarchiveOrganization={handleUnarchiveOrganization}
          />
        )}

        {currentView === 'settings' && (
          <SettingsView
            onReset={handleReset}
          />
        )}
      </div>

      {showAddEngagement && (
        <AddEngagementModal
          onClose={() => setShowAddEngagement(false)}
          onAdd={addEngagement}
          contractors={data.contractors}
          organizations={data.organizations}
        />
      )}

      <footer className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-700 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
            ZZP Compliance MVP  •  <span className="font-bold text-blue-600 dark:text-blue-400">DCK x ZENO</span> • Multi-tenant architectuur beta 0.1
          </p>
        </div>
      </footer>
    </div>
  );
}
