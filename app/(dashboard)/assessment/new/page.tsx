'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ChevronRight,
  Loader2,
  CheckCircle,
  XCircle,
  HelpCircle,
  CreditCard,
  Users,
  UserCheck,
  Banknote,
  Building2,
  Briefcase,
} from 'lucide-react';

interface Answers {
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

interface Category {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  questions: Question[];
}

interface Question {
  key: keyof Answers;
  prompt: string;
  helpText: string;
  type: 'boolean' | 'text';
}

const CATEGORIES: Category[] = [
  {
    id: 'gezag',
    title: 'Gezagsverhouding',
    subtitle: 'Instructies, werktijden en toezicht',
    icon: Users,
    color: 'from-violet-500 to-purple-600',
    questions: [
      {
        key: 'instructies',
        prompt: 'Geeft de opdrachtgever gedetailleerde instructies over hóé het werk uitgevoerd moet worden?',
        helpText:
          'Denk aan: werkmethoden, processen of volgorde van handelingen die voorgeschreven worden. Niet: het eindresultaat of de doelstelling van het werk.',
        type: 'boolean',
      },
      {
        key: 'werkTijden',
        prompt: 'Zijn er vaste werktijden of aanwezigheidsverplichtingen afgesproken?',
        helpText:
          'Bijv. verplicht aanwezig zijn van 9:00-17:00, vaste standplaats, deelname aan verplichte dagelijkse of wekelijkse meetings op vaste tijden.',
        type: 'boolean',
      },
      {
        key: 'toezicht',
        prompt: 'Is er sprake van dagelijks toezicht of directe aansturing door de opdrachtgever?',
        helpText:
          'Denk aan: een direct leidinggevende die dagelijks taken verdeelt, voortgang controleert of prestatiegesprekken voert zoals met vaste medewerkers.',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'persoonlijk',
    title: 'Persoonlijke arbeidsplicht',
    subtitle: 'Vervanging, uitvoering en verlof',
    icon: UserCheck,
    color: 'from-blue-500 to-indigo-600',
    questions: [
      {
        key: 'persoonlijkVerplicht',
        prompt: 'Is de opdrachtnemer contractueel verplicht het werk persoonlijk uit te voeren?',
        helpText:
          'Als vervanging contractueel niet is toegestaan of altijd goedkeuring vereist, wijst dit op een persoonlijke arbeidsplicht — kenmerkend voor een arbeidsovereenkomst.',
        type: 'boolean',
      },
      {
        key: 'vervanger',
        prompt: 'Kan de opdrachtnemer zelfstandig een gekwalificeerde vervanger aanwijzen zonder toestemming van de opdrachtgever?',
        helpText:
          'Echte zelfstandigen kunnen zelf een vervanger regelen. Als de opdrachtgever altijd akkoord moet geven, duidt dit op een persoonlijke arbeidsplicht.',
        type: 'boolean',
      },
      {
        key: 'verlof',
        prompt: 'Moet de opdrachtnemer verlof, vakantie of afwezigheid vooraf laten goedkeuren door de opdrachtgever?',
        helpText:
          'Een zelfstandig ondernemer heeft geen verlofaanvraag nodig. Als de opdrachtnemer dit wel moet doen, is er sprake van werkgeversgezag over beschikbaarheid.',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'beloning',
    title: 'Beloning en financieel risico',
    subtitle: 'Vergoeding, ziekte en ondernemersrisico',
    icon: Banknote,
    color: 'from-emerald-500 to-teal-600',
    questions: [
      {
        key: 'vasteVergoeding',
        prompt: 'Ontvangt de opdrachtnemer een vaste periodieke vergoeding, ongeacht de daadwerkelijk geleverde output of gepresteerde uren?',
        helpText:
          'Een vaste maandelijkse betaling los van resultaten lijkt op loon. Uurtarieven of output-gebaseerde vergoedingen passen beter bij een zelfstandige.',
        type: 'boolean',
      },
      {
        key: 'doorbetaling',
        prompt: 'Is er recht op doorbetaling van de vergoeding bij ziekte, vakantie of andere afwezigheid?',
        helpText:
          'Doorbetaling bij ziekte of vakantie is een wettelijk recht van werknemers. Een zelfstandige heeft hier geen recht op — als dit wel is afgesproken, wijst het sterk op een dienstverband.',
        type: 'boolean',
      },
      {
        key: 'financieelRisico',
        prompt: 'Loopt de opdrachtnemer aantoonbaar financieel ondernemersrisico (bijv. aansprakelijkheid voor fouten, niet-betaalde facturen)?',
        helpText:
          'Echte ondernemers dragen eigen risico. Denk aan: debiteuren die niet betalen, aansprakelijkheid voor geleden schade, kosten voor herwerk of eigen faillissementsrisico.',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'inbedding',
    title: 'Inbedding in de organisatie',
    subtitle: 'Werkplek, middelen en presentatie',
    icon: Building2,
    color: 'from-amber-500 to-orange-600',
    questions: [
      {
        key: 'vasteWerkplek',
        prompt: 'Heeft de opdrachtnemer een vaste werkplek (bureau, werkplaats) binnen de organisatie van de opdrachtgever?',
        helpText:
          'Een permanent toegewezen bureau of werkplek duidt op structurele inbedding. Incidenteel gebruik van een werkruimte voor overleg is minder risicovol.',
        type: 'boolean',
      },
      {
        key: 'bedrijfsmiddelen',
        prompt: 'Maakt de opdrachtnemer hoofdzakelijk gebruik van materialen, systemen of apparatuur van de opdrachtgever (laptop, auto, gereedschap, licenties)?',
        helpText:
          'Als de opdrachtgever de primaire werkmiddelen verschaft, ontbreekt economische zelfstandigheid. Een eigen laptop, tools of software is een positief teken.',
        type: 'boolean',
      },
      {
        key: 'eigenGereedschap',
        prompt: 'Gebruikt de opdrachtnemer overwegend eigen professioneel gereedschap, software of apparatuur voor de opdracht?',
        helpText:
          'Eigen investeringen in gereedschap en software tonen ondernemerschap. Denk aan: eigen laptop, vakliteratuur, specialistische tools of licenties op eigen naam.',
        type: 'boolean',
      },
      {
        key: 'teamlid',
        prompt: 'Wordt de opdrachtnemer intern gepresenteerd als medewerker of teamlid (bijv. in het organogram, op intranet, met bedrijfse-mail of bedrijfskleding)?',
        helpText:
          'Als de opdrachtgever de opdrachtnemer naar buiten toe presenteert als eigen medewerker (bedrijfse-mail, visitekaartje, organogram), is er sprake van sterke organisatorische inbedding.',
        type: 'boolean',
      },
    ],
  },
  {
    id: 'ondernemerschap',
    title: 'Zelfstandig ondernemerschap',
    subtitle: 'Meerdere klanten, KvK en exclusiviteit',
    icon: Briefcase,
    color: 'from-rose-500 to-pink-600',
    questions: [
      {
        key: 'meerdereOpdrachtgevers',
        prompt: 'Heeft de opdrachtnemer tegelijkertijd meerdere opdrachtgevers of klanten?',
        helpText:
          'Het gelijktijdig werken voor meerdere opdrachtgevers is een van de sterkste indicatoren van echte zelfstandigheid en ondernemerschap.',
        type: 'boolean',
      },
      {
        key: 'exclusiviteit',
        prompt: 'Is contractueel vastgelegd dat de opdrachtnemer uitsluitend voor de opdrachtgever mag werken (exclusiviteitsbeding)?',
        helpText:
          'Een contractueel verbod om voor anderen te werken is niet passend bij een zelfstandig ondernemer en vergroot het risico op schijnzelfstandigheid aanzienlijk.',
        type: 'boolean',
      },
      {
        key: 'kvkInschrijving',
        prompt: 'Is de opdrachtnemer ingeschreven in het KvK Handelsregister als ondernemer of eenmanszaak?',
        helpText:
          'KvK-inschrijving is een formele basisvoorwaarde voor ondernemerschap in Nederland. Afwezigheid hiervan is een risicosignaal, hoewel aanwezigheid op zichzelf niet voldoende is.',
        type: 'boolean',
      },
      {
        key: 'aansprakelijkheidsverzekering',
        prompt: 'Heeft de opdrachtnemer een eigen beroeps- of bedrijfsaansprakelijkheidsverzekering afgesloten?',
        helpText:
          'Een eigen aansprakelijkheidsverzekering toont dat de opdrachtnemer als zelfstandige risico draagt en professioneel handelt als ondernemer.',
        type: 'boolean',
      },
      {
        key: 'langetermijn',
        prompt: 'Betreft het een samenwerking van meer dan 12 maanden, of wordt de overeenkomst structureel telkens verlengd?',
        helpText:
          'Een langdurige exclusieve relatie met één opdrachtgever — zeker in combinatie met andere risicofactoren — vergroot het risico op kwalificatie als arbeidsovereenkomst.',
        type: 'boolean',
      },
    ],
  },
];

// Flat list of all questions for step navigation
const ALL_QUESTIONS: (Question & { categoryTitle: string; categoryColor: string })[] = CATEGORIES.flatMap((cat) =>
  cat.questions.map((q) => ({ ...q, categoryTitle: cat.title, categoryColor: cat.color }))
);

const NOTES_QUESTION: Question = {
  key: 'notes',
  prompt: 'Aanvullende opmerkingen of context',
  helpText: 'Voeg hier eventuele aanvullende informatie toe die relevant kan zijn voor de beoordeling, zoals bijzondere contractuele afspraken of specifieke werkomstandigheden.',
  type: 'text',
};

export default function NewAssessmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0); // 0=title, 1..n=questions, n+1=notes, n+2=review
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalBooleanQuestions = ALL_QUESTIONS.length;
  const notesStep = totalBooleanQuestions + 1;
  const reviewStep = notesStep + 1;
  const isNotesStep = step === notesStep;
  const isReview = step === reviewStep;

  const currentQuestion = step > 0 && step <= totalBooleanQuestions ? ALL_QUESTIONS[step - 1] : null;

  // Progress: exclude review from progress bar
  const progressMax = notesStep;
  const progress = Math.min(100, Math.round((step / progressMax) * 100));

  const handleNext = () => {
    if (step === 0 && !title.trim()) {
      setError('Geef uw beoordeling een titel');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleBooleanAnswer = (key: keyof Answers, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((s) => s + 1);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title || 'Nieuwe beoordeling', answers }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Opslaan mislukt');
      }

      const { assessment } = await res.json();

      const payRes = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId: assessment.id }),
      });

      if (!payRes.ok) {
        const data = await payRes.json();
        throw new Error(data.error || 'Betaling starten mislukt');
      }

      const { url } = await payRes.json();

      if (url) {
        window.location.href = url;
      } else {
        router.push(`/assessment/${assessment.id}`);
      }
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Er is iets misgegaan');
      setSubmitting(false);
    }
  };

  // Find category info for current question
  const currentCategoryIndex = currentQuestion
    ? CATEGORIES.findIndex((cat) => cat.questions.some((q) => q.key === currentQuestion.key))
    : -1;
  const currentCategory = currentCategoryIndex >= 0 ? CATEGORIES[currentCategoryIndex] : null;

  // Count answered questions per category for progress display
  const answeredCount = Object.keys(answers).filter((k) => k !== 'notes').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/20">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900 leading-tight">Nieuwe beoordeling</h1>
            <p className="text-xs text-gray-500">ZZP Compliance Assessment — Wet DBA</p>
          </div>
        </div>

        {/* Progress bar */}
        {!isReview && (
          <div className="mb-6">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              {step === 0 ? (
                <span>Start</span>
              ) : isNotesStep ? (
                <span>Aanvullende informatie</span>
              ) : currentCategory ? (
                <span>
                  {currentCategory.title} — vraag {((currentQuestion ? ALL_QUESTIONS.indexOf(currentQuestion) : 0))} van {totalBooleanQuestions}
                </span>
              ) : null}
              <span>{answeredCount} van {totalBooleanQuestions} vragen beantwoord</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            {/* Category pills */}
            {!isNotesStep && step > 0 && (
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {CATEGORIES.map((cat, i) => {
                  const catQuestions = cat.questions;
                  const catAnswered = catQuestions.filter((q) => answers[q.key] !== undefined).length;
                  const isCurrent = currentCategoryIndex === i;
                  const isDone = catAnswered === catQuestions.length;
                  return (
                    <div
                      key={cat.id}
                      className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                        isCurrent
                          ? 'bg-indigo-100 text-indigo-700 border border-indigo-300'
                          : isDone
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isDone && <CheckCircle className="w-3 h-3" />}
                      {cat.title}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-100 overflow-hidden">

          {/* Step 0: Title */}
          {step === 0 && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Stap 1 van {reviewStep}</span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">Geef uw beoordeling een naam</h2>
                <p className="text-gray-500 text-sm mt-2">
                  Bijv. de naam van de ZZP&apos;er of het project waarvoor u de compliance beoordeelt.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
              )}

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder="bijv. Jan de Vries — Project Alpha"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                autoFocus
              />

              {/* Category overview */}
              <div className="mt-6 grid grid-cols-1 gap-2">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  return (
                    <div key={cat.id} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${cat.color} flex items-center justify-center flex-shrink-0`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-800">{cat.title}</p>
                        <p className="text-xs text-gray-500">{cat.questions.length} vragen — {cat.subtitle}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <button
                onClick={handleNext}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20"
              >
                Start de beoordeling
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Boolean questions */}
          {currentQuestion && currentQuestion.type === 'boolean' && (
            <div className="p-8">
              {/* Category header */}
              {currentCategory && (
                <div className={`flex items-center gap-2 mb-6 px-3 py-2 rounded-xl bg-gradient-to-r ${currentCategory.color} bg-opacity-10`}>
                  <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${currentCategory.color} flex items-center justify-center flex-shrink-0`}>
                    <currentCategory.icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-xs font-semibold text-gray-700">{currentCategory.title}</span>
                </div>
              )}

              <div className="mb-8">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Vraag {step} van {totalBooleanQuestions}
                </span>
                <h2 className="text-lg font-bold text-gray-900 mt-2 leading-snug">
                  {currentQuestion.prompt}
                </h2>
                <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-xl">
                  <HelpCircle className="w-4 h-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <p className="text-blue-700 text-xs leading-relaxed">{currentQuestion.helpText}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleBooleanAnswer(currentQuestion.key, true)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle className="w-7 h-7 text-emerald-600" />
                  </div>
                  <span className="font-bold text-gray-900">Ja</span>
                </button>
                <button
                  onClick={() => handleBooleanAnswer(currentQuestion.key, false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-200 group hover:scale-[1.02] active:scale-[0.98]"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <XCircle className="w-7 h-7 text-red-500" />
                  </div>
                  <span className="font-bold text-gray-900">Nee</span>
                </button>
              </div>

              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-4 w-full py-2.5 text-gray-400 text-sm hover:text-gray-600 transition-colors"
                >
                  ← Vorige vraag
                </button>
              )}
            </div>
          )}

          {/* Notes step */}
          {isNotesStep && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Aanvullende informatie
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{NOTES_QUESTION.prompt}</h2>
                <p className="text-gray-500 text-sm mt-2">{NOTES_QUESTION.helpText}</p>
              </div>

              <textarea
                value={(answers.notes as string) || ''}
                onChange={(e) => setAnswers((prev) => ({ ...prev, notes: e.target.value }))}
                placeholder="Optioneel: bijv. bijzondere contractuele afspraken, specifieke werkomstandigheden of andere relevante context..."
                rows={5}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-400 transition-all"
              />

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                >
                  Vorige
                </button>
                <button
                  onClick={handleNext}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg shadow-blue-500/20"
                >
                  Controleren
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Review & Payment */}
          {isReview && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">Samenvatting</span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">Beoordeling indienen</h2>
                <p className="text-gray-500 text-sm mt-1">Controleer uw antwoorden en dien in via Mollie.</p>
              </div>

              {/* Summary per category */}
              <div className="space-y-4 mb-6 max-h-72 overflow-y-auto pr-1">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600 font-medium">Naam beoordeling</span>
                  <span className="font-semibold text-sm text-gray-900">{title}</span>
                </div>
                {CATEGORIES.map((cat) => (
                  <div key={cat.id}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-5 h-5 rounded bg-gradient-to-br ${cat.color} flex items-center justify-center`}>
                        <cat.icon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">{cat.title}</span>
                    </div>
                    {cat.questions.map((q) => (
                      <div key={q.key as string} className="flex justify-between items-center py-1.5 pl-7 border-b border-gray-50">
                        <span className="text-xs text-gray-600 pr-4 flex-1 leading-snug">{q.prompt.length > 70 ? q.prompt.slice(0, 70) + '…' : q.prompt}</span>
                        <span
                          className={`flex-shrink-0 text-xs font-semibold ml-2 ${
                            answers[q.key] === true
                              ? 'text-emerald-600'
                              : answers[q.key] === false
                              ? 'text-red-500'
                              : 'text-gray-400'
                          }`}
                        >
                          {answers[q.key] === true ? 'Ja' : answers[q.key] === false ? 'Nee' : '—'}
                        </span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>

              {/* Payment notice */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Eenmalige betaling via Mollie</p>
                    <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                      Na betaling heeft u direct toegang tot uw volledige compliance beoordeling met risicoscore, gedetailleerde analyse en aanbevelingen. U ontvangt ook een factuur.
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                  <span className="text-blue-900 font-semibold text-sm">ZZP Compliance Beoordeling</span>
                  <span className="text-blue-900 font-bold text-lg">€29,99</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">{error}</div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="flex-1 py-3 border-2 border-gray-200 rounded-xl text-gray-600 font-semibold hover:bg-gray-50 transition-all"
                >
                  Vorige
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-500/30"
                >
                  {submitting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CreditCard className="w-4 h-4" />
                  )}
                  {submitting ? 'Doorsturen...' : 'Betalen & indienen'}
                </button>
              </div>
            </div>
          )}
        </div>

        {!isReview && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Het invullen van de vragenlijst is gratis. Betaling alleen bij indiening.
          </p>
        )}
      </div>
    </div>
  );
}
