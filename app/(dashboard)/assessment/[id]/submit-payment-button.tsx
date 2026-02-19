'use client';

import { useState } from 'react';
import { Loader2, CreditCard } from 'lucide-react';

export default function SubmitPaymentButton({ assessmentId }: { assessmentId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePay = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payments/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assessmentId }),
      });

      const text = await res.text();
      let data: { error?: string; url?: string } = {};
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(`Server fout (${res.status}): Mollie API key mogelijk niet ingesteld in Vercel.`);
      }

      if (!res.ok) {
        throw new Error(data.error || 'Betaling starten mislukt');
      }

      if (data.url) window.location.href = data.url;
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Er is iets misgegaan');
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="mb-3 p-3 bg-red-500/20 border border-red-400 rounded-xl text-white text-sm">
          {error}
        </div>
      )}
      <button
        onClick={handlePay}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-white text-blue-700 py-3.5 rounded-xl font-bold hover:bg-blue-50 disabled:opacity-50 transition-all hover:scale-[1.02] shadow-lg"
      >
        {loading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <CreditCard className="w-5 h-5" />
        )}
        {loading ? 'Doorsturen naar betaling...' : 'Betalen & resultaten bekijken'}
      </button>
    </div>
  );
}
