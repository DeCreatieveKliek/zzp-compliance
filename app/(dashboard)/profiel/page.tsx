'use client';

import { useEffect, useState } from 'react';
import { User, Lock, Save, Eye, EyeOff, CheckCircle, AlertCircle, MapPin } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  type: string;
  companyName: string | null;
  street: string | null;
  houseNumber: string | null;
  postalCode: string | null;
  city: string | null;
}

function Alert({ type, message }: { type: 'success' | 'error'; message: string }) {
  const cfg = {
    success: {
      cls: 'bg-emerald-50 border-emerald-200 text-emerald-800',
      Icon: CheckCircle,
      iconCls: 'text-emerald-500',
    },
    error: {
      cls: 'bg-red-50 border-red-200 text-red-800',
      Icon: AlertCircle,
      iconCls: 'text-red-500',
    },
  }[type];

  return (
    <div className={`flex items-start gap-2.5 px-4 py-3 rounded-xl border text-sm ${cfg.cls}`}>
      <cfg.Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${cfg.iconCls}`} />
      {message}
    </div>
  );
}

export default function ProfielPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Profile form state
  const [name, setName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [street, setStreet] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [city, setCity] = useState('');
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileAlert, setProfileAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Password form state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordAlert, setPasswordAlert] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  useEffect(() => {
    fetch('/api/profiel')
      .then((r) => r.json())
      .then(({ user }) => {
        setProfile(user);
        setName(user.name ?? '');
        setCompanyName(user.companyName ?? '');
        setStreet(user.street ?? '');
        setHouseNumber(user.houseNumber ?? '');
        setPostalCode(user.postalCode ?? '');
        setCity(user.city ?? '');
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    setProfileSaving(true);
    setProfileAlert(null);
    try {
      const res = await fetch('/api/profiel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'profile', name, companyName, street, houseNumber, postalCode, city }),
      });
      const data = await res.json();
      if (!res.ok) {
        setProfileAlert({ type: 'error', message: data.error ?? 'Opslaan mislukt' });
      } else {
        setProfileAlert({ type: 'success', message: 'Profiel opgeslagen.' });
      }
    } catch {
      setProfileAlert({ type: 'error', message: 'Verbindingsfout. Probeer opnieuw.' });
    } finally {
      setProfileSaving(false);
    }
  }

  async function handlePasswordSave(e: React.FormEvent) {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordAlert(null);
    try {
      const res = await fetch('/api/profiel', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'password', currentPassword, newPassword, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPasswordAlert({ type: 'error', message: data.error ?? 'Opslaan mislukt' });
      } else {
        setPasswordAlert({ type: 'success', message: 'Wachtwoord succesvol gewijzigd.' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      }
    } catch {
      setPasswordAlert({ type: 'error', message: 'Verbindingsfout. Probeer opnieuw.' });
    } finally {
      setPasswordSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-64">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isBedrijf = profile?.type === 'BEDRIJF';

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Mijn profiel</h1>
        <p className="text-gray-500 mt-1 text-sm">Beheer uw account- en adresgegevens</p>
      </div>

      {/* Profile section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-6">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <User className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Accountgegevens</h2>
        </div>
        <form onSubmit={handleProfileSave} className="px-6 py-5 space-y-4">
          {/* Read-only: email + type */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                E-mailadres
              </label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                {profile?.email}
              </p>
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Accounttype
              </label>
              <p className="text-sm text-gray-700 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
                {isBedrijf ? 'Bedrijf' : "ZZP'er"}
              </p>
            </div>
          </div>

          <div>
            <label htmlFor="name" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Naam
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {isBedrijf && (
            <div>
              <label htmlFor="companyName" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                Bedrijfsnaam
              </label>
              <input
                id="companyName"
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
          )}

          {/* Address section */}
          <div className="pt-2 border-t border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Adresgegevens</span>
            </div>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="col-span-2">
                <label htmlFor="street" className="block text-xs text-gray-500 mb-1">Straatnaam</label>
                <input
                  id="street"
                  type="text"
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Keizersgracht"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div>
                <label htmlFor="houseNumber" className="block text-xs text-gray-500 mb-1">Huisnummer</label>
                <input
                  id="houseNumber"
                  type="text"
                  value={houseNumber}
                  onChange={(e) => setHouseNumber(e.target.value)}
                  placeholder="42A"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="postalCode" className="block text-xs text-gray-500 mb-1">Postcode</label>
                <input
                  id="postalCode"
                  type="text"
                  value={postalCode}
                  onChange={(e) => setPostalCode(e.target.value)}
                  placeholder="1234 AB"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
              <div className="col-span-2">
                <label htmlFor="city" className="block text-xs text-gray-500 mb-1">Plaats</label>
                <input
                  id="city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Amsterdam"
                  className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                />
              </div>
            </div>
          </div>

          {profileAlert && <Alert type={profileAlert.type} message={profileAlert.message} />}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {profileSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              {profileSaving ? 'Opslaan…' : 'Opslaan'}
            </button>
          </div>
        </form>
      </div>

      {/* Password section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Lock className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-gray-900 text-sm">Wachtwoord wijzigen</h2>
        </div>
        <form onSubmit={handlePasswordSave} className="px-6 py-5 space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Huidig wachtwoord
            </label>
            <div className="relative">
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowCurrent((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Nieuw wachtwoord
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2.5 pr-10 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
              <button
                type="button"
                onClick={() => setShowNew((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                tabIndex={-1}
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-1">Minimaal 8 tekens</p>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
              Herhaal nieuw wachtwoord
            </label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
            />
          </div>

          {passwordAlert && <Alert type={passwordAlert.type} message={passwordAlert.message} />}

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg shadow-blue-500/30 transition-all duration-200 hover:scale-[1.02] text-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {passwordSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Lock className="w-4 h-4" />
              )}
              {passwordSaving ? 'Opslaan…' : 'Wachtwoord wijzigen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
