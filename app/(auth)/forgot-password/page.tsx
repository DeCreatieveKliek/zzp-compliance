'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Shield, Mail, ArrowLeft, CheckCircle, Loader2 } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Er is iets misgegaan');
        setStatus('error');
        return;
      }

      setStatus('sent');
    } catch {
      setError('Er is iets misgegaan. Probeer het later opnieuw.');
      setStatus('error');
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-blue-100">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="font-black text-gray-900">ZZP Compliance</span>
        </div>

        {status === 'sent' ? (
          <div className="text-center py-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">E-mail verstuurd</h2>
            <p className="text-gray-500 text-sm leading-relaxed mb-6">
              Als er een account bestaat voor <strong>{email}</strong>, ontvangt u binnen enkele minuten een e-mail met een link om uw wachtwoord opnieuw in te stellen.
            </p>
            <p className="text-gray-400 text-xs mb-6">
              Geen e-mail ontvangen? Controleer uw spammap of probeer het opnieuw.
            </p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 text-blue-600 font-semibold text-sm hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Terug naar inloggen
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Wachtwoord vergeten</h1>
              <p className="text-gray-500 mt-1 text-sm">
                Vul uw e-mailadres in en wij sturen u een resetlink.
              </p>
            </div>

            {(status === 'error') && (
              <div className="mb-5 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  E-mailadres
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 placeholder-gray-400"
                    placeholder="naam@bedrijf.nl"
                    autoFocus
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02]"
              >
                {status === 'loading' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Mail className="w-5 h-5" />
                )}
                {status === 'loading' ? 'Versturen...' : 'Resetlink versturen'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link
                href="/login"
                className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Terug naar inloggen
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
