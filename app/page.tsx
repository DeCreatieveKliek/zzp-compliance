'use client';

import React, { useState } from 'react';
import { Calendar, AlertCircle, CheckCircle, AlertTriangle, Plus, Clock, Users, Building, UserPlus, Sparkles, Shield, TrendingUp } from 'lucide-react';

// Mock data store
const DATA_VERSION = '2.0';

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
        name: 'ZZP Risico Beoordeling',
        version: '1.0',
        isActive: true
      }
    ],
    questions: [
      {
        id: '1',
        questionnaireId: '1',
        key: 'authority',
        prompt: 'Heeft de ZZP\'er gezag over anderen of kan deze zelfstandig beslissingen nemen?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 1,
        options: null
      },
      {
        id: '2',
        questionnaireId: '1',
        key: 'substitution',
        prompt: 'Kan de ZZP\'er een vervanger sturen om het werk uit te voeren?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 2,
        options: null
      },
      {
        id: '3',
        questionnaireId: '1',
        key: 'embedded',
        prompt: 'Werkt de ZZP\'er ingebed in de organisatie (zelfde kantoor, aanwezig bij alle meetings)?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 3,
        options: null
      },
      {
        id: '4',
        questionnaireId: '1',
        key: 'ownTools',
        prompt: 'Gebruikt de ZZP\'er eigen gereedschap en apparatuur?',
        type: 'BOOLEAN',
        required: true,
        orderIndex: 4,
        options: null
      },
      {
        id: '5',
        questionnaireId: '1',
        key: 'notes',
        prompt: 'Aanvullende opmerkingen of context',
        type: 'TEXT',
        required: false,
        orderIndex: 5,
        options: null
      }
    ],
    checkRuns: [],
    answers: [],
    scoreResults: [],
    auditEvents: []
  };
}

const RULESET_VERSION = '1.0.0';
const THRESHOLDS = { greenMax: 2, orangeMax: 5 };

const computeScore = (answersByKey: any) => {
  const rules = [
    {
      key: 'authority',
      condition: (val: any) => val === true,
      weight: 3,
      label: 'Gezag over anderen',
      recommendation: 'Hoog risico: ZZP\'er heeft beslissingsbevoegdheid wat wijst op een dienstverband'
    },
    {
      key: 'substitution',
      condition: (val: any) => val === true,
      weight: -2,
      label: 'Vervanging toegestaan',
      recommendation: 'Laag risico: mogelijkheid tot vervanging duidt op zelfstandige status'
    },
    {
      key: 'embedded',
      condition: (val: any) => val === true,
      weight: 2,
      label: 'Ingebed in organisatie',
      recommendation: 'Gemiddeld risico: werken op locatie als werknemer suggereert mogelijk dienstverband'
    },
    {
      key: 'ownTools',
      condition: (val: any) => val === true,
      weight: -1,
      label: 'Eigen gereedschap',
      recommendation: 'Laag risico: gebruik van eigen materiaal ondersteunt zelfstandige status'
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
        answer: answer,
        recommendation: rule.recommendation
      });
    }
  });

  let status;
  if (totalScore <= THRESHOLDS.greenMax) {
    status = 'GROEN';
  } else if (totalScore <= THRESHOLDS.orangeMax) {
    status = 'ORANJE';
  } else {
    status = 'ROOD';
  }

  return {
    totalScore,
    status,
    triggeredRules,
    rulesetVersion: RULESET_VERSION
  };
};

const StatusBadge = ({ status }: { status: string }) => {
  const config: any = {
    GROEN: { 
      bg: 'bg-gradient-to-r from-emerald-500 to-green-500', 
      text: 'text-white', 
      icon: CheckCircle,
      shadow: 'shadow-lg shadow-green-500/50'
    },
    ORANJE: { 
      bg: 'bg-gradient-to-r from-amber-500 to-orange-500', 
      text: 'text-white', 
      icon: AlertTriangle,
      shadow: 'shadow-lg shadow-orange-500/50'
    },
    ROOD: { 
      bg: 'bg-gradient-to-r from-red-500 to-rose-500', 
      text: 'text-white', 
      icon: AlertCircle,
      shadow: 'shadow-lg shadow-red-500/50'
    },
    PLANNED: { 
      bg: 'bg-gradient-to-r from-slate-500 to-gray-500', 
      text: 'text-white', 
      icon: Clock,
      shadow: 'shadow-lg shadow-gray-500/50'
    }
  };

  const cfg = config[status] || config.PLANNED;
  const Icon = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold ${cfg.bg} ${cfg.text} ${cfg.shadow} transition-all duration-300 hover:scale-105`}>
      <Icon className="w-4 h-4" />
      {status}
    </span>
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
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform animate-in slide-in-from-bottom-4 duration-300">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
            <UserPlus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Nieuwe ZZP&apos;er
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Naam *</label>
            <input
              type="text"
              value={formData.displayName}
              onChange={(e) => setFormData({ ...formData, displayName: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="bijv. Jan de Vries"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">E-mail *</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-300"
              placeholder="bijv. jan@example.com"
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

// Voeg hier de rest van de components toe...
// (AddEngagementModal, PeopleManagement, EngagementList, EngagementDetail)

export default function ZZPComplianceApp() {
  const [data, setData] = useState(initializeData);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('engagements');
  const [showAddEngagement, setShowAddEngagement] = useState(false);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <header className="bg-white/80 backdrop-blur-lg shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/50">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ZZP Compliance
                </h1>
                <p className="text-sm text-gray-600 font-medium mt-1">
                  Monitor naleving met geautomatiseerde risicobeoordelingen ✨
                </p>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-semibold transition-all duration-200"
              title="Reset alle data"
            >
              Reset Data
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">🚧 In ontwikkeling</h2>
          <p className="text-gray-600">De volledige applicatie wordt geladen...</p>
        </div>
      </div>

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600 font-medium">
            ZZP Compliance MVP • <span className="font-bold text-blue-600">{data.tenant.name}</span> • Multi-tenant architectuur 🚀
          </p>
        </div>
      </footer>
    </div>
  );
}
