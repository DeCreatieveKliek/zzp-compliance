'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2, UserPlus, Briefcase, User } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: '',
    type: 'ZZP',
    companyName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.passwordConfirm) {
      setError('Wachtwoorden komen niet overeen');
      return;
    }

    if (form.password.length < 8) {
      setError('Wachtwoord moet minimaal 8 tekens bevatten');
      return;
    }

    setLoading(true);

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      setError(data.error || 'Registratie mislukt');
      return;
    }

    router.push('/login?registered=true');
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-white rounded-3xl shadow-2xl shadow-blue-500/10 p-8 border border-blue-100">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Account aanmaken</h1>
          <p className="text-gray-500 mt-1 text-sm">Gratis starten met ZZP Compliance</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Account type */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">Ik ben een...</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'ZZP' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  form.type === 'ZZP'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <User className="w-6 h-6" />
                <span className="font-semibold text-sm">ZZP&apos;er</span>
                <span className="text-xs opacity-75">Zelfstandige</span>
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: 'BEDRIJF' })}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${
                  form.type === 'BEDRIJF'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-gray-300 text-gray-600'
                }`}
              >
                <Briefcase className="w-6 h-6" />
                <span className="font-semibold text-sm">Bedrijf</span>
                <span className="text-xs opacity-75">Opdrachtgever</span>
              </button>
            </div>
          </div>

          {form.type === 'BEDRIJF' && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Bedrijfsnaam *</label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
                placeholder="bijv. Acme B.V."
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Volledige naam *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              placeholder="bijv. Jan de Vries"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mailadres *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              placeholder="naam@bedrijf.nl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Wachtwoord *</label>
            <input
              type="password"
              required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              placeholder="Minimaal 8 tekens"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Bevestig wachtwoord *</label>
            <input
              type="password"
              required
              value={form.passwordConfirm}
              onChange={(e) => setForm({ ...form, passwordConfirm: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-gray-900"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
            {loading ? 'Account aanmaken...' : 'Gratis account aanmaken'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Al een account?{' '}
          <Link href="/login" className="text-blue-600 font-semibold hover:underline">
            Inloggen
          </Link>
        </p>
      </div>
    </div>
  );
}
