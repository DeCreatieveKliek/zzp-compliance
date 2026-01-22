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

const AddEngagementModal = ({ onClose, onAdd, contractors, organizations }: any) => {
  const [formData, setFormData] = useState({
    contractorId: '',
    organizationId: '',
    roleTitle: '',
    startDate: '',
    endDate: '',
    rateHourly: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.contractorId || !formData.organizationId || !formData.roleTitle || !formData.startDate) {
      alert('Vul alle verplichte velden in');
      return;
    }
    onAdd({
      ...formData,
      rateHourly: formData.rateHourly ? parseFloat(formData.rateHourly) : 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl transform animate-in slide-in-from-bottom-4 duration-300 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            Nieuwe Opdracht
          </h3>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ZZP&apos;er *</label>
              <select
                value={formData.contractorId}
                onChange={(e) => setFormData({ ...formData, contractorId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecteer ZZP&apos;er</option>
                {contractors.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.displayName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Organisatie *</label>
              <select
                value={formData.organizationId}
                onChange={(e) => setFormData({ ...formData, organizationId: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Selecteer organisatie</option>
                {organizations.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Rol *</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. Frontend Developer"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Startdatum *</label>
              <input
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Einddatum</label>
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Uurtarief (€)</label>
            <input
              type="number"
              value={formData.rateHourly}
              onChange={(e) => setFormData({ ...formData, rateHourly: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. 85"
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
              className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105"
            >
              Toevoegen
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PeopleManagement = ({ data, onUpdate }: any) => {
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [showAddOrg, setShowAddOrg] = useState(false);

  const addContractor = (formData: any) => {
    const newContractor = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      displayName: formData.displayName,
      email: formData.email
    };
    onUpdate({ ...data, contractors: [...data.contractors, newContractor] });
  };

  const addOrganization = (formData: any) => {
    const newOrg = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      name: formData.name,
      type: formData.type
    };
    onUpdate({ ...data, organizations: [...data.organizations, newOrg] });
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Users className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">ZZP&apos;ers</h2>
          </div>
          <button
            onClick={() => setShowAddContractor(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-semibold shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nieuwe ZZP&apos;er
          </button>
        </div>
        <div className="space-y-3">
          {data.contractors.map((contractor: any) => (
            <div key={contractor.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200">
              <div>
                <p className="font-semibold text-gray-900">{contractor.displayName}</p>
                <p className="text-sm text-gray-600">{contractor.email}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-purple-600" />
            <h2 className="text-2xl font-bold text-gray-900">Organisaties</h2>
          </div>
          <button
            onClick={() => setShowAddOrg(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-pink-700 font-semibold shadow-lg shadow-purple-500/50 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-5 h-5" />
            Nieuwe Organisatie
          </button>
        </div>
        <div className="space-y-3">
          {data.organizations.map((org: any) => (
            <div key={org.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-100 hover:shadow-md transition-all duration-200">
              <div>
                <p className="font-semibold text-gray-900">{org.name}</p>
                <p className="text-sm text-gray-600">{org.type === 'CLIENT' ? 'Opdrachtgever' : 'Leverancier'}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddContractor && <AddContractorModal onClose={() => setShowAddContractor(false)} onAdd={addContractor} />}
      {showAddOrg && <AddOrganizationModal onClose={() => setShowAddOrg(false)} onAdd={addOrganization} />}
    </div>
  );
};

const EngagementList = ({ data, onSelectEngagement, onAddEngagement }: any) => {
  const getLatestCheckRun = (engagementId: string) => {
    return data.checkRuns
      .filter((cr: any) => cr.engagementId === engagementId)
      .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
  };

  const getContractor = (id: string) => data.contractors.find((c: any) => c.id === id);
  const getOrganization = (id: string) => data.organizations.find((o: any) => o.id === id);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Opdrachten</h2>
          <p className="text-gray-600 mt-1">Overzicht van alle ZZP-opdrachten en hun compliance status</p>
        </div>
        <button
          onClick={onAddEngagement}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-xl hover:from-green-700 hover:to-emerald-700 font-semibold shadow-lg shadow-green-500/50 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Opdracht
        </button>
      </div>

      <div className="grid gap-6">
        {data.engagements.map((engagement: any) => {
          const contractor = getContractor(engagement.contractorId);
          const organization = getOrganization(engagement.organizationId);
          const latestCheck = getLatestCheckRun(engagement.id);
          const scoreResult = latestCheck ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheck.id) : null;

          return (
            <div
              key={engagement.id}
              onClick={() => onSelectEngagement(engagement.id)}
              className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:scale-[1.02]"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <h3 className="text-2xl font-bold text-gray-900">{engagement.roleTitle}</h3>
                    {scoreResult && <StatusBadge status={scoreResult.status} />}
                    {!scoreResult && <StatusBadge status="PLANNED" />}
                  </div>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="font-semibold">{contractor?.displayName}</span>
                      <span className="text-gray-400">@</span>
                      <span className="font-semibold">{organization?.name}</span>
                    </p>
                    <p className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {engagement.startDate} {engagement.endDate && `— ${engagement.endDate}`}
                    </p>
                    {engagement.rateHourly > 0 && (
                      <p className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4" />
                        €{engagement.rateHourly}/uur
                      </p>
                    )}
                  </div>
                </div>
              </div>
              {scoreResult && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Laatste check: {new Date(latestCheck.timestamp).toLocaleDateString('nl-NL')} • Score: {scoreResult.totalScore}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

const EngagementDetail = ({ engagement, data, onUpdate, onBack }: any) => {
  const [answers, setAnswers] = useState<any>({});
  const [showResults, setShowResults] = useState(false);

  const contractor = data.contractors.find((c: any) => c.id === engagement.contractorId);
  const organization = data.organizations.find((o: any) => o.id === engagement.organizationId);
  const questionnaire = data.questionnaires[0];
  const questions = data.questions.filter((q: any) => q.questionnaireId === questionnaire.id).sort((a: any, b: any) => a.orderIndex - b.orderIndex);

  const latestCheckRun = data.checkRuns
    .filter((cr: any) => cr.engagementId === engagement.id)
    .sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

  const scoreResult = latestCheckRun ? data.scoreResults.find((sr: any) => sr.checkRunId === latestCheckRun.id) : null;

  const handleAnswerChange = (questionKey: string, value: any) => {
    setAnswers({ ...answers, [questionKey]: value });
  };

  const handleSubmit = () => {
    const checkRunId = String(Date.now());
    const timestamp = new Date().toISOString();

    const newCheckRun = {
      id: checkRunId,
      tenantId: data.tenant.id,
      engagementId: engagement.id,
      questionnaireId: questionnaire.id,
      timestamp,
      completedBy: 'Demo User'
    };

    const newAnswers = Object.entries(answers).map(([key, value]) => {
      const question = questions.find((q: any) => q.key === key);
      return {
        id: `${checkRunId}-${key}`,
        checkRunId,
        questionId: question.id,
        value: typeof value === 'boolean' ? (value ? 'true' : 'false') : String(value)
      };
    });

    const score = computeScore(answers);
    const newScoreResult = {
      id: String(Date.now()) + '-score',
      checkRunId,
      totalScore: score.totalScore,
      status: score.status,
      rulesetVersion: score.rulesetVersion,
      triggeredRules: JSON.stringify(score.triggeredRules)
    };

    onUpdate({
      ...data,
      checkRuns: [...data.checkRuns, newCheckRun],
      answers: [...data.answers, ...newAnswers],
      scoreResults: [...data.scoreResults, newScoreResult]
    });

    setShowResults(true);
  };

  if (showResults && scoreResult) {
    const triggeredRules = JSON.parse(scoreResult.triggeredRules || '[]');

    return (
      <div className="space-y-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
        >
          ← Terug naar overzicht
        </button>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Compliance Beoordeling</h2>
            <p className="text-gray-600 mb-6">{engagement.roleTitle}</p>
            <StatusBadge status={scoreResult.status} />
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Analyse</h3>
              <div className="space-y-4">
                {triggeredRules.map((rule: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className={`p-2 rounded-lg ${rule.weight > 0 ? 'bg-red-100' : 'bg-green-100'}`}>
                        {rule.weight > 0 ? <AlertCircle className="w-5 h-5 text-red-600" /> : <CheckCircle className="w-5 h-5 text-green-600" />}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{rule.label}</p>
                        <p className="text-sm text-gray-600 mt-1">{rule.recommendation}</p>
                        <p className="text-xs text-gray-500 mt-2">Impact: {rule.weight > 0 ? '+' : ''}{rule.weight} punten</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">Totale Score: {scoreResult.totalScore}</p>
              <p className="text-sm text-gray-600 mt-2">
                Beoordeeld op {new Date(latestCheckRun.timestamp).toLocaleDateString('nl-NL')}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200"
      >
        ← Terug naar overzicht
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{engagement.roleTitle}</h2>
          <div className="flex items-center gap-4 text-gray-600">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              {contractor?.displayName}
            </span>
            <span className="flex items-center gap-2">
              <Building className="w-4 h-4" />
              {organization?.name}
            </span>
          </div>
        </div>

        {scoreResult && (
          <div className="mb-8 p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Laatste beoordeling</p>
                <StatusBadge status={scoreResult.status} />
              </div>
              <button
                onClick={() => setShowResults(true)}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Bekijk details →
              </button>
            </div>
          </div>
        )}

        <div className="space-y-6">
          <h3 className="text-xl font-bold text-gray-900">Nieuwe Beoordeling</h3>
          {questions.map((question: any) => (
            <div key={question.id} className="p-6 bg-gray-50 rounded-xl border border-gray-200">
              <label className="block text-gray-900 font-semibold mb-4">{question.prompt}</label>
              {question.type === 'BOOLEAN' ? (
                <div className="flex gap-4">
                  <button
                    onClick={() => handleAnswerChange(question.key, true)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      answers[question.key] === true
                        ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-green-500'
                    }`}
                  >
                    Ja
                  </button>
                  <button
                    onClick={() => handleAnswerChange(question.key, false)}
                    className={`flex-1 py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                      answers[question.key] === false
                        ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-lg shadow-red-500/50'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-red-500'
                    }`}
                  >
                    Nee
                  </button>
                </div>
              ) : (
                <textarea
                  value={answers[question.key] || ''}
                  onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={4}
                  placeholder="Voer hier uw antwoord in..."
                />
              )}
            </div>
          ))}

          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl hover:from-blue-700 hover:to-indigo-700 font-bold text-lg shadow-lg shadow-blue-500/50 transition-all duration-200 hover:scale-[1.02]"
          >
            Beoordeling Indienen
          </button>
        </div>
      </div>
    </div>
  );
};

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

  const addEngagement = (formData: any) => {
    const newEngagement = {
      id: String(Date.now()),
      tenantId: data.tenant.id,
      organizationId: formData.organizationId,
      contractorId: formData.contractorId,
      roleTitle: formData.roleTitle,
      startDate: formData.startDate,
      endDate: formData.endDate || null,
      rateHourly: formData.rateHourly,
      metadata: {}
    };
    handleUpdate({ ...data, engagements: [...data.engagements, newEngagement] });
  };

  const selectedEngagementData = selectedEngagement
    ? data.engagements.find((e: any) => e.id === selectedEngagement)
    : null;

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
                  Monitor naleving met geautomatiseerde risicobeoordelingen
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="flex gap-2">
                <button
                  onClick={() => { setCurrentView('engagements'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    currentView === 'engagements'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Opdrachten
                </button>
                <button
                  onClick={() => { setCurrentView('people'); setSelectedEngagement(null); }}
                  className={`px-6 py-2 rounded-xl font-semibold transition-all duration-200 ${
                    currentView === 'people'
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  Beheer
                </button>
              </nav>
              <button
                onClick={handleReset}
                className="px-4 py-2 text-sm border-2 border-red-200 text-red-600 rounded-xl hover:bg-red-50 font-semibold transition-all duration-200"
                title="Reset alle data"
              >
                Reset Data
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {currentView === 'engagements' && !selectedEngagement && (
          <EngagementList
            data={data}
            onSelectEngagement={setSelectedEngagement}
            onAddEngagement={() => setShowAddEngagement(true)}
          />
        )}

        {currentView === 'engagements' && selectedEngagement && selectedEngagementData && (
          <EngagementDetail
            engagement={selectedEngagementData}
            data={data}
            onUpdate={handleUpdate}
            onBack={() => setSelectedEngagement(null)}
          />
        )}

        {currentView === 'people' && (
          <PeopleManagement data={data} onUpdate={handleUpdate} />
        )}
      </div>

      {showAddEngagement && (
        <AddEngagementModal
          onClose={() => setShowAddEngagement(false)}
          onAdd={addEngagement}
          contractors={data.contractors}
          organizations={data.organizations}
        />
      )}

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600 font-medium">
            ZZP Compliance MVP • <span className="font-bold text-blue-600">{data.tenant.name}</span> • Multi-tenant architectuur
          </p>
        </div>
      </footer>
    </div>
  );
}
