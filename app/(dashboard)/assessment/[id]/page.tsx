import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import { computeScore } from '@/lib/scoring';
import Link from 'next/link';
import {
  CheckCircle,
  AlertTriangle,
  AlertCircle,
  ArrowLeft,
  CreditCard,
  Lock,
  TrendingUp,
} from 'lucide-react';
import SubmitPaymentButton from './submit-payment-button';

export default async function AssessmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;

  const assessment = await prisma.assessment.findFirst({
    where: { id, userId: session.user.id },
    include: { payment: true },
  });

  if (!assessment) notFound();

  const answers = JSON.parse(assessment.answers || '{}');
  const scoreResult = computeScore(answers);
  const isPaid = assessment.status === 'PAID';

  const riskConfig = {
    GROEN: {
      bg: 'from-emerald-500 to-green-500',
      light: 'bg-emerald-50 border-emerald-200',
      text: 'text-emerald-700',
      icon: CheckCircle,
      label: 'Laag risico',
      description:
        "Op basis van de antwoorden is er een laag risico op schijnzelfstandigheid. De ZZP'er voldoet naar alle waarschijnlijkheid aan de voorwaarden voor zelfstandige arbeid.",
    },
    ORANJE: {
      bg: 'from-amber-500 to-orange-500',
      light: 'bg-amber-50 border-amber-200',
      text: 'text-amber-700',
      icon: AlertTriangle,
      label: 'Gemiddeld risico',
      description:
        'Er zijn enkele risicofactoren geïdentificeerd. Wij adviseren om de arbeidsrelatie nader te beoordelen en mogelijk aanpassingen door te voeren.',
    },
    ROOD: {
      bg: 'from-red-500 to-rose-500',
      light: 'bg-red-50 border-red-200',
      text: 'text-red-700',
      icon: AlertCircle,
      label: 'Hoog risico',
      description:
        "Er is een significant risico op schijnzelfstandigheid geconstateerd. Wij adviseren dringend om de arbeidsrelatie te herzien of juridisch advies in te winnen.",
    },
  };

  const config = riskConfig[scoreResult.status] || riskConfig.ORANJE;
  const Icon = config.icon;

  return (
    <div className="p-8 max-w-3xl">
      {/* Back */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Terug naar overzicht
      </Link>

      {/* Title */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{assessment.title}</h1>
        <p className="text-gray-500 text-sm mt-1">
          Aangemaakt op{' '}
          {new Date(assessment.createdAt).toLocaleDateString('nl-NL', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {isPaid ? (
        /* === PAID: Show full results === */
        <div className="space-y-6">
          {/* Risk indicator */}
          <div className={`rounded-3xl p-6 bg-gradient-to-br ${config.bg} text-white shadow-lg`}>
            <div className="flex items-center gap-4 mb-3">
              <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center">
                <Icon className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-white/70 text-sm font-medium">Risicostatus</p>
                <p className="text-2xl font-black text-white">{config.label}</p>
              </div>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">{config.description}</p>
            <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-white/70" />
              <span className="text-white/70 text-xs">Risicoscore: {scoreResult.totalScore} punten</span>
            </div>
          </div>

          {/* Triggered rules */}
          {scoreResult.triggeredRules.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="font-semibold text-gray-900">Gevonden risicofactoren</h2>
              </div>
              <div className="divide-y divide-gray-100">
                {scoreResult.triggeredRules.map((rule, i) => (
                  <div key={i} className="px-6 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-semibold text-sm text-gray-900">{rule.label}</p>
                        <p className="text-gray-500 text-xs mt-1 leading-relaxed">{rule.recommendation}</p>
                      </div>
                      <span
                        className={`flex-shrink-0 text-sm font-bold px-3 py-1 rounded-full ${
                          rule.weight > 0
                            ? 'bg-red-100 text-red-600'
                            : 'bg-emerald-100 text-emerald-600'
                        }`}
                      >
                        {rule.weight > 0 ? `+${rule.weight}` : rule.weight}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Q&A Summary */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Uw antwoorden</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {[
                { key: 'authority', label: 'Gezag over anderen' },
                { key: 'substitution', label: 'Vervanging mogelijk' },
                { key: 'embedded', label: 'Ingebed in organisatie' },
                { key: 'ownTools', label: 'Eigen gereedschap' },
              ].map((q) => (
                <div key={q.key} className="flex items-center justify-between px-6 py-3.5">
                  <span className="text-sm text-gray-600">{q.label}</span>
                  <span
                    className={`text-sm font-semibold ${
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
              {answers.notes && (
                <div className="px-6 py-3.5">
                  <p className="text-sm text-gray-600 font-medium mb-1">Opmerkingen</p>
                  <p className="text-sm text-gray-700 leading-relaxed">{answers.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* === NOT PAID: Teaser + payment CTA === */
        <div className="space-y-6">
          {/* Blurred preview */}
          <div className="relative rounded-3xl overflow-hidden border border-gray-200 shadow-sm">
            <div className="p-6 bg-gradient-to-br from-gray-100 to-gray-200 blur-sm select-none">
              <div className="flex items-center gap-4 mb-3">
                <div className="w-14 h-14 bg-gray-400 rounded-2xl" />
                <div>
                  <div className="h-4 w-24 bg-gray-400 rounded mb-2" />
                  <div className="h-7 w-36 bg-gray-500 rounded" />
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <div className="h-3 bg-gray-400 rounded w-full" />
                <div className="h-3 bg-gray-400 rounded w-4/5" />
                <div className="h-3 bg-gray-400 rounded w-3/5" />
              </div>
            </div>
            {/* Lock overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 backdrop-blur-[2px]">
              <div className="text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mx-auto mb-3 border border-gray-200">
                  <Lock className="w-8 h-8 text-blue-600" />
                </div>
                <p className="font-bold text-gray-900 text-lg">Resultaten vergrendeld</p>
                <p className="text-gray-500 text-sm mt-1">Dien uw beoordeling in om de resultaten te zien</p>
              </div>
            </div>
          </div>

          {/* Payment CTA */}
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-blue-500/30">
            <div className="flex items-start gap-3 mb-4">
              <CreditCard className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-lg">Beoordeling indienen</p>
                <p className="text-blue-200 text-sm mt-1 leading-relaxed">
                  Ontvang uw volledige ZZP compliance beoordeling met risicoscore, gedetailleerde
                  analyse en aanbevelingen.
                </p>
              </div>
            </div>
            <div className="bg-white/10 rounded-2xl p-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="text-white/80 text-sm">ZZP Compliance Beoordeling</span>
                <span className="font-bold text-xl">€29,99</span>
              </div>
              <p className="text-blue-200 text-xs mt-1">Eenmalig, direct resultaat</p>
            </div>
            <SubmitPaymentButton assessmentId={assessment.id} />
          </div>
        </div>
      )}
    </div>
  );
}
