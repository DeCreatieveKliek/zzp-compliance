'use client';

import React, { useState, useEffect } from 'react';
import { Calendar, AlertCircle, CheckCircle, AlertTriangle, Plus, Clock, Users, Building, UserPlus, Sparkles, Shield, TrendingUp, Moon, Sun, Home, Trash2, BarChart3, Activity, FileText, X, Search, Archive, Download, Mail, Filter } from 'lucide-react';

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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl">
            <Building className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Nieuwe Organisatie
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Naam *</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="bijv. Acme Corp"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
            >
              <option value="CLIENT">Opdrachtgever</option>
              <option value="SUPPLIER">Leverancier</option>
            </select>
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 hover:scale-105"
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl transform animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Nieuwe Opdracht
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ZZP&apos;er *</label>
              <select
                value={formData.contractorId}
                onChange={(e) => setFormData({ ...formData, contractorId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecteer ZZP&apos;er</option>
                {contractors.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organisatie *</label>
              <select
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecteer organisatie</option>
                {organizations.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rol *</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. Frontend Developer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Startdatum *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Einddatum</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Uurtarief (€)</label>
            <input
              type="number"
              value={formData.rateHourly}
              onChange={(e) => setFormData({ ...formData, rateHourly: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. 85"
            />
          </div>
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border-2 border-gray-300 rounded-xl hover:bg-gray-50 font-semibold transition-all duration-200 hover:scale-105"
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

// Recent Activity Component
const RecentActivity = ({ data, darkMode }: any) => {
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

const Dashboard = ({ data, onNavigate, darkMode }: any) => {
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
    <div className="space-y-6">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Overzicht van uw ZZP compliance status</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Totaal Opdrachten</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalEngagements}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl">
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">ZZP&apos;ers</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalContractors}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl">
              <Users className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Organisaties</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalOrganizations}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl">
              <Building className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">Checks Uitgevoerd</p>
              <p className="text-4xl font-bold text-gray-900 dark:text-white mt-2">{totalChecks}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl">
              <Activity className="w-8 h-8 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Status Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
          <BarChart3 className="w-6 h-6" />
          Compliance Status Overzicht
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'GOEDGEKEURD'; }}
            className="p-6 bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border-2 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              <p className="text-3xl font-bold text-green-900 dark:text-green-100">{approvedCount}</p>
            </div>
            <p className="text-sm font-semibold text-green-800 dark:text-green-300">Goedgekeurd</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'TER_BEOORDELING'; }}
            className="p-6 bg-gradient-to-br from-orange-50 to-amber-100 dark:from-orange-900/20 dark:to-amber-900/20 rounded-xl border-2 border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertTriangle className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              <p className="text-3xl font-bold text-orange-900 dark:text-orange-100">{warningCount}</p>
            </div>
            <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Ter Beoordeling</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'AFGEKEURD'; }}
            className="p-6 bg-gradient-to-br from-red-50 to-rose-100 dark:from-red-900/20 dark:to-rose-900/20 rounded-xl border-2 border-red-200 dark:border-red-800 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              <p className="text-3xl font-bold text-red-900 dark:text-red-100">{rejectedCount}</p>
            </div>
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Afgekeurd</p>
          </button>

          <button
            onClick={() => { onNavigate('engagements'); (window as any).statusFilter = 'PLANNED'; }}
            className="p-6 bg-gradient-to-br from-gray-50 to-slate-100 dark:from-gray-700 dark:to-slate-700 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-200 hover:scale-105 cursor-pointer text-left"
          >
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-gray-600 dark:text-gray-400" />
              <p className="text-3xl font-bold text-gray-900 dark:text-gray-100">{pendingCount}</p>
            </div>
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">Nog Te Beoordelen</p>
          </button>
        </div>
      </div>

      {/* Recent Activity */}
      <RecentActivity data={data} darkMode={darkMode} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button
          onClick={() => onNavigate('engagements')}
          className="p-6 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <FileText className="w-8 h-8 mb-3" />
          <p className="font-bold text-lg">Bekijk Opdrachten</p>
          <p className="text-sm opacity-90 mt-1">Beheer al uw ZZP-opdrachten</p>
        </button>

        <button
          onClick={() => onNavigate('people')}
          className="p-6 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Users className="w-8 h-8 mb-3" />
          <p className="font-bold text-lg">Beheer ZZP&apos;ers</p>
          <p className="text-sm opacity-90 mt-1">Organisaties en freelancers</p>
        </button>

        <button
          onClick={() => onNavigate('engagements')}
          className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
        >
          <Plus className="w-8 h-8 mb-3" />
          <p className="font-bold text-lg">Nieuwe Check</p>
          <p className="text-sm opacity-90 mt-1">Start een nieuwe beoordeling</p>
        </button>
      </div>
    </div>
  );
};

const SettingsView = ({ onReset }: any) => {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleReset = () => {
    if (password !== '123456789') {
      alert('Onjuist wachtwoord!');
      return;
    }
    if (confirm('Weet je ABSOLUUT zeker dat je alle data wilt resetten? Dit kan niet ongedaan worden gemaakt.')) {
      onReset();
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Instellingen</h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Systeeminstellingen en gevaarlijke acties</p>
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
                Wachtwoord vereist:
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-red-300 dark:border-red-700 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all duration-200"
                  placeholder="Voer wachtwoord in (123456789)"
                />
              </div>
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-sm text-red-600 dark:text-red-400 hover:underline mt-2"
              >
                {showPassword ? 'Verberg wachtwoord' : 'Toon wachtwoord'}
              </button>
            </div>

            <button
              onClick={handleReset}
              disabled={!password}
              className={`w-full px-6 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                password
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
const PeopleManagement = ({ data, onUpdate, darkMode, onNavigate }: any) => {
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
const ContractorsManagement = ({ data, onUpdate, onBack, darkMode }: any) => {
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
const OrganizationsManagement = ({ data, onUpdate, onBack, darkMode }: any) => {
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
  };

  const handleSubmit = () => {
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
          {questions.map((question: any) => (
            <div key={question.id} className="p-6 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-200 dark:border-gray-600">
              <label className="block text-gray-900 dark:text-white font-semibold mb-4">{question.prompt}</label>
              {question.type === 'BOOLEAN' ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswerChange(question.key, true)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      answers[question.key] === true
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-500'
                    }`}
                  >
                    Ja
                  </button>
                  <button
                    onClick={() => handleAnswerChange(question.key, false)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      answers[question.key] === false
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500'
                    }`}
                  >
                    Nee
                  </button>
                </div>
              ) : (
                <textarea
                  value={answers[question.key] || ''}
                  onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  placeholder="Voer hier uw antwoord in..."
                />
              )}
            </div>
          ))}

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
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAddEngagement, setShowAddEngagement] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', String(newDarkMode));
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

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

  const selectedEngagementData = selectedEngagement
    ? data.engagements.find((e: any) => e.id === selectedEngagement)
    : null;

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50'}`}>
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => { setCurrentView('dashboard'); setSelectedEngagement(null); }}
              className="hover:opacity-80 transition-opacity duration-200"
              title="ZZP Compliance - Ga naar Dashboard"
            >
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/50 hover:scale-110 transition-transform duration-200">
                <Shield className="w-8 h-8 text-white" />
              </div>
            </button>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => { setCurrentView('dashboard'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'dashboard'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  Dashboard
                </button>
                <button
                  onClick={() => { setCurrentView('engagements'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    currentView === 'engagements'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Opdrachten
                </button>
                <button
                  onClick={() => { setCurrentView('people'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    currentView === 'people'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  Beheer
                </button>
                <button
                  onClick={() => { setCurrentView('archive'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'archive'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Archive className="w-4 h-4" />
                  Archief
                </button>
                <button
                  onClick={() => { setCurrentView('settings'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2 ${
                    currentView === 'settings'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <Shield className="w-4 h-4" />
                  Instellingen
                </button>
              </nav>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-xl border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200"
                title={darkMode ? 'Light mode' : 'Dark mode'}
              >
                {darkMode ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'dashboard' && (
          <Dashboard data={data} onNavigate={setCurrentView} darkMode={darkMode} />
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
          <PeopleManagement data={data} onUpdate={handleUpdate} darkMode={darkMode} onNavigate={setCurrentView} />
        )}

        {currentView === 'contractors' && (
          <ContractorsManagement
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setCurrentView('people')}
            darkMode={darkMode}
          />
        )}

        {currentView === 'organizations' && (
          <OrganizationsManagement
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setCurrentView('people')}
            darkMode={darkMode}
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
