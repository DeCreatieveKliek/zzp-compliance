'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Shield,
  ChevronRight,
  Loader2,
  CheckCircle,
  AlertTriangle,
  HelpCircle,
  CreditCard,
} from 'lucide-react';

interface Answers {
  authority?: boolean;
  substitution?: boolean;
  embedded?: boolean;
  ownTools?: boolean;
  notes?: string;
}

const QUESTIONS = [
  {
    key: 'authority',
    prompt: "Heeft de ZZP'er gezag over anderen of kan deze zelfstandig beslissingen nemen?",
    helpText:
      'Denk aan: leidinggeven aan andere medewerkers, tekenbevoegdheid, of het nemen van bedrijfsbeslissingen.',
    type: 'boolean',
  },
  {
    key: 'substitution',
    prompt: "Kan de ZZP'er een vervanger sturen om het werk uit te voeren?",
    helpText:
      'De mogelijkheid om zelf een vervanger te regelen zonder toestemming van de opdrachtgever duidt op zelfstandigheid.',
    type: 'boolean',
  },
  {
    key: 'embedded',
    prompt: "Werkt de ZZP'er ingebed in de organisatie?",
    helpText:
      'Denk aan: vaste werkplek op kantoor, deelname aan alle interne meetings, gebruik van bedrijfskleding of -systemen.',
    type: 'boolean',
  },
  {
    key: 'ownTools',
    prompt: "Gebruikt de ZZP'er eigen gereedschap en apparatuur?",
    helpText:
      'Eigen laptop, gereedschap, software licenties, etc. Dit ondersteunt zelfstandige status.',
    type: 'boolean',
  },
  {
    key: 'notes',
    prompt: 'Aanvullende opmerkingen of context',
    helpText: 'Voeg hier eventuele aanvullende informatie toe die relevant is voor de beoordeling.',
    type: 'text',
  },
];

export default function NewAssessmentPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [answers, setAnswers] = useState<Answers>({});
  const [step, setStep] = useState(0); // 0 = title, 1..n = questions, final = review
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalSteps = QUESTIONS.length + 1; // +1 for title step
  const currentQuestion = step > 0 ? QUESTIONS[step - 1] : null;
  const isReview = step === totalSteps;

  const handleNext = () => {
    if (step === 0 && !title.trim()) {
      setError('Geef uw beoordeling een titel');
      return;
    }
    setError('');
    setStep((s) => s + 1);
  };

  const handleBooleanAnswer = (key: string, value: boolean) => {
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

      // Start payment flow
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

  const progress = Math.round((step / totalSteps) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
            <Shield className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="font-bold text-gray-900">Nieuwe beoordeling</h1>
            <p className="text-xs text-gray-500">ZZP Compliance Assessment</p>
          </div>
        </div>

        {/* Progress */}
        {!isReview && (
          <div className="mb-8">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Stap {step} van {totalSteps}</span>
              <span>{progress}% voltooid</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-100 overflow-hidden">
          {/* Step 0: Title */}
          {step === 0 && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Stap 1
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  Geef uw beoordeling een naam
                </h2>
                <p className="text-gray-500 text-sm mt-2">
                  Bijv. de naam van de ZZP&apos;er of het project waarvoor u de compliance beoordeelt.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
              )}

              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                placeholder="bijv. Jan de Vries - Project Alpha"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900"
                autoFocus
              />

              <button
                onClick={handleNext}
                className="mt-6 w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all hover:scale-[1.02] shadow-lg shadow-blue-500/20"
              >
                Volgende
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Steps 1-4: Boolean questions */}
          {step > 0 && !isReview && currentQuestion && currentQuestion.type === 'boolean' && (
            <div className="p-8">
              <div className="mb-8">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Vraag {step} van {QUESTIONS.length}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2 leading-snug">
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
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all duration-200 group hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <CheckCircle className="w-6 h-6 text-emerald-600" />
                  </div>
                  <span className="font-semibold text-gray-900">Ja</span>
                </button>
                <button
                  onClick={() => handleBooleanAnswer(currentQuestion.key, false)}
                  className="flex flex-col items-center gap-3 p-6 rounded-2xl border-2 border-gray-200 hover:border-red-400 hover:bg-red-50 transition-all duration-200 group hover:scale-[1.02]"
                >
                  <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center group-hover:bg-red-200 transition-colors">
                    <AlertTriangle className="w-6 h-6 text-red-500" />
                  </div>
                  <span className="font-semibold text-gray-900">Nee</span>
                </button>
              </div>

              {step > 1 && (
                <button
                  onClick={() => setStep((s) => s - 1)}
                  className="mt-4 w-full py-2.5 text-gray-500 text-sm hover:text-gray-700 transition-colors"
                >
                  Vorige vraag
                </button>
              )}
            </div>
          )}

          {/* Step 5: Notes */}
          {step > 0 && !isReview && currentQuestion && currentQuestion.type === 'text' && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Vraag {step} van {QUESTIONS.length}
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">{currentQuestion.prompt}</h2>
                <p className="text-gray-500 text-sm mt-2">{currentQuestion.helpText}</p>
              </div>

              <textarea
                value={(answers as Record<string, string>)[currentQuestion.key] || ''}
                onChange={(e) =>
                  setAnswers((prev) => ({ ...prev, [currentQuestion.key]: e.target.value }))
                }
                placeholder="Optioneel: voeg aanvullende context toe..."
                rows={4}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 transition-all"
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
                  Doorgaan
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Review & Payment */}
          {isReview && (
            <div className="p-8">
              <div className="mb-6">
                <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Samenvatting
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-2">Beoordeling indienen</h2>
                <p className="text-gray-500 text-sm mt-1">
                  Controleer uw antwoorden en dien de beoordeling in.
                </p>
              </div>

              {/* Summary */}
              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-sm text-gray-600">Naam beoordeling</span>
                  <span className="font-semibold text-sm text-gray-900">{title}</span>
                </div>
                {QUESTIONS.filter((q) => q.type === 'boolean').map((q) => (
                  <div key={q.key} className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-sm text-gray-600 pr-4 max-w-xs truncate">{q.prompt}</span>
                    <span
                      className={`font-semibold text-sm ${
                        (answers as Record<string, boolean>)[q.key] === true
                          ? 'text-emerald-600'
                          : (answers as Record<string, boolean>)[q.key] === false
                          ? 'text-red-500'
                          : 'text-gray-400'
                      }`}
                    >
                      {(answers as Record<string, boolean>)[q.key] === true
                        ? 'Ja'
                        : (answers as Record<string, boolean>)[q.key] === false
                        ? 'Nee'
                        : 'Niet beantwoord'}
                    </span>
                  </div>
                ))}
              </div>

              {/* Payment notice */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-5 mb-6">
                <div className="flex items-start gap-3">
                  <CreditCard className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-blue-900 text-sm">Eenmalige betaling vereist</p>
                    <p className="text-blue-700 text-xs mt-1 leading-relaxed">
                      Voor het indienen en inzien van uw compliance beoordeling wordt eenmalig{' '}
                      <strong>€29,99</strong> in rekening gebracht. Na betaling heeft u direct
                      toegang tot uw volledige risicobeoordeling.
                    </p>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-blue-200 flex justify-between items-center">
                  <span className="text-blue-900 font-semibold text-sm">ZZP Compliance Beoordeling</span>
                  <span className="text-blue-900 font-bold">€29,99</span>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                  {error}
                </div>
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

        {/* Free notice */}
        {!isReview && (
          <p className="text-center text-xs text-gray-400 mt-4">
            Het invullen van de vragenlijst is volledig gratis. Betaling alleen bij indiening.
          </p>
        )}
      </div>
    </div>
  );
}
