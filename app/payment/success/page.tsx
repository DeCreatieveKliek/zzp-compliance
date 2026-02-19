'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Loader2, ArrowRight, Shield, FileText } from 'lucide-react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const assessmentId = searchParams.get('assessment_id');

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [invoiceId, setInvoiceId] = useState<string | null>(null);

  useEffect(() => {
    if (!assessmentId) {
      setStatus('error');
      return;
    }

    // Poll until the webhook has processed the payment (max ~10s)
    let attempts = 0;
    const poll = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/assessments/${assessmentId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.assessment?.status === 'PAID') {
            // Also fetch the invoice ID if available
            if (data.assessment?.invoice?.id) {
              setInvoiceId(data.assessment.invoice.id);
            }
            setStatus('success');
            return;
          }
        }
      } catch {
        // ignore
      }

      if (attempts < 10) {
        setTimeout(poll, 1500);
      } else {
        // Show success anyway — webhook may arrive slightly later
        setStatus('success');
      }
    };

    poll();
  }, [assessmentId]);

  if (status === 'loading') {
    return (
      <div className="text-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Betaling verwerken...</h2>
        <p className="text-gray-500 text-sm mt-2">Even geduld, uw beoordeling wordt verwerkt.</p>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl text-red-500 font-bold">!</span>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Er is iets misgegaan</h2>
        <p className="text-gray-500 text-sm mt-2 mb-6">
          Uw betaling is mogelijk wel gelukt. Controleer uw dashboard.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold"
        >
          Naar dashboard
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-500/30">
        <CheckCircle className="w-10 h-10 text-white" />
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Betaling geslaagd!</h2>
      <p className="text-gray-500 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
        Uw beoordeling is ingediend en uw compliance rapport is klaar. Bekijk uw resultaten en download uw factuur.
      </p>

      <div className="flex flex-col gap-3">
        {assessmentId && (
          <Link
            href={`/assessment/${assessmentId}`}
            className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all"
          >
            Bekijk mijn resultaten
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}

        {invoiceId && (
          <Link
            href={`/invoice/${invoiceId}`}
            className="inline-flex items-center justify-center gap-2 border-2 border-gray-200 text-gray-700 px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-50 transition-all"
          >
            <FileText className="w-4 h-4" />
            Factuur bekijken
          </Link>
        )}
      </div>

      <div className="mt-4">
        <Link
          href="/dashboard"
          className="text-gray-400 hover:text-gray-600 text-sm transition-colors"
        >
          Terug naar dashboard
        </Link>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-indigo-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="font-black text-xl text-gray-900">ZZP Compliance</span>
      </div>
      <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-blue-100 p-10 w-full max-w-md">
        <Suspense
          fallback={
            <div className="text-center">
              <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
            </div>
          }
        >
          <SuccessContent />
        </Suspense>
      </div>
    </div>
  );
}
