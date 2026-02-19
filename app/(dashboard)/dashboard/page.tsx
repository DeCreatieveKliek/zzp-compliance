import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { PlusCircle, CheckCircle, AlertTriangle, AlertCircle, Clock, FileText } from 'lucide-react';

function RiskBadge({ level }: { level: string | null }) {
  if (!level) return <span className="text-xs text-gray-400 font-medium">Onbekend</span>;

  const config: Record<string, { cls: string; icon: React.ElementType; label: string }> = {
    GROEN: {
      cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200',
      icon: CheckCircle,
      label: 'Laag risico',
    },
    ORANJE: {
      cls: 'bg-amber-100 text-amber-700 border border-amber-200',
      icon: AlertTriangle,
      label: 'Gemiddeld risico',
    },
    ROOD: {
      cls: 'bg-red-100 text-red-700 border border-red-200',
      icon: AlertCircle,
      label: 'Hoog risico',
    },
  };

  const c = config[level];
  if (!c) return null;
  const Icon = c.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${c.cls}`}>
      <Icon className="w-3.5 h-3.5" />
      {c.label}
    </span>
  );
}

export default async function DashboardPage() {
  const session = await auth();

  const assessments = await prisma.assessment.findMany({
    where: { userId: session!.user.id },
    include: { payment: true },
    orderBy: { createdAt: 'desc' },
  });

  const paid = assessments.filter((a) => a.status === 'PAID').length;
  const draft = assessments.filter((a) => a.status === 'DRAFT').length;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welkom, {session!.user.name?.split(' ')[0]}
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Beheer uw ZZP compliance beoordelingen
          </p>
        </div>
        <Link
          href="/assessment/new"
          className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          Nieuwe beoordeling
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Totaal</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{assessments.length}</p>
          <p className="text-xs text-gray-400 mt-1">beoordelingen</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Voltooid</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{paid}</p>
          <p className="text-xs text-gray-400 mt-1">betaald & ingediend</p>
        </div>
        <div className="bg-white rounded-2xl p-5 border border-gray-200 shadow-sm">
          <p className="text-sm text-gray-500 font-medium">Concept</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{draft}</p>
          <p className="text-xs text-gray-400 mt-1">nog in te dienen</p>
        </div>
      </div>

      {/* Assessments list */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            Mijn beoordelingen
          </h2>
        </div>

        {assessments.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nog geen beoordelingen</h3>
            <p className="text-gray-500 text-sm mb-6">
              Start uw eerste ZZP compliance beoordeling. Het invullen is gratis.
            </p>
            <Link
              href="/assessment/new"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all duration-200 text-sm"
            >
              <PlusCircle className="w-4 h-4" />
              Start eerste beoordeling
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {assessments.map((assessment) => (
              <Link
                key={assessment.id}
                href={`/assessment/${assessment.id}`}
                className="flex items-center justify-between px-6 py-4 hover:bg-blue-50/50 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    assessment.status === 'PAID'
                      ? 'bg-emerald-100'
                      : 'bg-amber-100'
                  }`}>
                    {assessment.status === 'PAID' ? (
                      <CheckCircle className="w-5 h-5 text-emerald-600" />
                    ) : (
                      <Clock className="w-5 h-5 text-amber-500" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-700 transition-colors">{assessment.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(assessment.createdAt).toLocaleDateString('nl-NL', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {assessment.status === 'PAID' ? (
                    <RiskBadge level={assessment.riskLevel} />
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-600 border border-gray-200">
                      <Clock className="w-3.5 h-3.5" />
                      Concept
                    </span>
                  )}
                  <span className="text-sm font-medium text-blue-600 group-hover:text-blue-700 transition-colors">
                    {assessment.status === 'PAID' ? 'Bekijken →' : 'Indienen →'}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
