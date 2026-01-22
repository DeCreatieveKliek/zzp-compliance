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
      rateHourly: parseFloat(formData.rateHourly) || 0
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg transform animate-in slide-in-from-bottom-4 duration-300">
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
                <option value="">Selecteer...</option>
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
                <option value="">Selecteer...</option>
                {organizations.map((o: any) => (
                  <option key={o.id} value={o.id}>{o.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Functie/Rol *</label>
            <input
              type="text"
              value={formData.roleTitle}
              onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
              placeholder="bijv. Frontend Developer"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
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
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Uurtarief</label>
              <input
                type="number"
                value={formData.rateHourly}
                onChange={(e) => setFormData({ ...formData, rateHourly: e.target.value })}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200"
                placeholder="85"
              />
            </div>
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

const EngagementDetail = ({ engagement, data, onBack, onUpdate }: any) => {
  const contractor = data.contractors.find((c: any) => c.id === engagement.contractorId);
  const organization = data.organizations.find((o: any) => o.id === engagement.organizationId);
  const questions = data.questions.filter((q: any) => q.questionnaireId === '1');

  const existingAnswers = data.answers.filter((a: any) => a.engagementId === engagement.id);
  const answersByKey: any = {};
  existingAnswers.forEach((a: any) => {
    const question = data.questions.find((q: any) => q.id === a.questionId);
    if (question) {
      answersByKey[question.key] = a.value;
    }
  });

  const [answers, setAnswers] = useState<any>(answersByKey);
  const [scoreResult, setScoreResult] = useState<any>(
    data.scoreResults.find((s: any) => s.engagementId === engagement.id) || null
  );

  const handleAnswerChange = (questionKey: string, value: any) => {
    setAnswers({ ...answers, [questionKey]: value });
  };

  const handleSubmitAssessment = () => {
    const result = computeScore(answers);

    const newAnswers = questions.map((q: any) => ({
      id: `ans_${Date.now()}_${q.id}`,
      engagementId: engagement.id,
      questionId: q.id,
      value: answers[q.key]
    })).filter((a: any) => a.value !== undefined);

    const newScoreResult = {
      id: `score_${Date.now()}`,
      engagementId: engagement.id,
      totalScore: result.totalScore,
      status: result.status,
      triggeredRules: result.triggeredRules,
      rulesetVersion: result.rulesetVersion,
      createdAt: new Date().toISOString()
    };

    const updatedData = {
      ...data,
      answers: [
        ...data.answers.filter((a: any) => a.engagementId !== engagement.id),
        ...newAnswers
      ],
      scoreResults: [
        ...data.scoreResults.filter((s: any) => s.engagementId !== engagement.id),
        newScoreResult
      ]
    };

    onUpdate(updatedData);
    setScoreResult(newScoreResult);
  };

  return (
    <div className="space-y-6">
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold transition-colors"
      >
        <span>&larr;</span> Terug naar overzicht
      </button>

      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">{engagement.roleTitle}</h2>
            <p className="text-gray-600 mt-2">
              <span className="font-semibold">{contractor?.displayName}</span> bij <span className="font-semibold">{organization?.name}</span>
            </p>
            <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {engagement.startDate} - {engagement.endDate || 'Doorlopend'}
              </span>
              {engagement.rateHourly > 0 && (
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  €{engagement.rateHourly}/uur
                </span>
              )}
            </div>
          </div>
          {scoreResult && <StatusBadge status={scoreResult.status} />}
        </div>

        <div className="border-t border-gray-200 pt-8 mt-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            Risicobeoordeling
          </h3>

          <div className="space-y-6">
            {questions.filter((q: any) => q.type === 'BOOLEAN').map((question: any) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-5">
                <p className="font-medium text-gray-900 mb-3">{question.prompt}</p>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleAnswerChange(question.key, true)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      answers[question.key] === true
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    Ja
                  </button>
                  <button
                    onClick={() => handleAnswerChange(question.key, false)}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${
                      answers[question.key] === false
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white border-2 border-gray-300 text-gray-700 hover:border-blue-400'
                    }`}
                  >
                    Nee
                  </button>
                </div>
              </div>
            ))}

            {questions.filter((q: any) => q.type === 'TEXT').map((question: any) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-5">
                <p className="font-medium text-gray-900 mb-3">{question.prompt}</p>
                <textarea
                  value={answers[question.key] || ''}
                  onChange={(e) => handleAnswerChange(question.key, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows={3}
                  placeholder="Typ hier je opmerkingen..."
                />
              </div>
            ))}

            <button
              onClick={handleSubmitAssessment}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/50 hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 hover:scale-[1.02]"
            >
              Beoordeling Uitvoeren
            </button>
          </div>
        </div>

        {scoreResult && (
          <div className="border-t border-gray-200 pt-8 mt-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Resultaat</h3>
            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-600">Totale risicoscore:</span>
                <span className="text-3xl font-bold text-gray-900">{scoreResult.totalScore}</span>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-gray-600">Status:</span>
                <StatusBadge status={scoreResult.status} />
              </div>

              {scoreResult.triggeredRules && scoreResult.triggeredRules.length > 0 && (
                <div className="space-y-3 mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900">Getriggerde regels:</h4>
                  {scoreResult.triggeredRules.map((rule: any, idx: number) => (
                    <div key={idx} className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{rule.label}</span>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          rule.weight > 0 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                        }`}>
                          {rule.weight > 0 ? '+' : ''}{rule.weight}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{rule.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const EngagementList = ({ data, onSelect, onUpdate, onShowAddModal }: any) => {
  const getEngagementStatus = (engagementId: string) => {
    const score = data.scoreResults.find((s: any) => s.engagementId === engagementId);
    return score?.status || 'PLANNED';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Opdrachten</h2>
        <button
          onClick={onShowAddModal}
          className="flex items-center gap-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-3 rounded-xl font-semibold shadow-lg shadow-green-500/50 hover:from-green-700 hover:to-emerald-700 transition-all duration-200 hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Nieuwe Opdracht
        </button>
      </div>

      {data.engagements.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Geen opdrachten</h3>
          <p className="text-gray-600">Voeg een nieuwe opdracht toe om te beginnen met compliance monitoring.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {data.engagements.map((engagement: any) => {
            const contractor = data.contractors.find((c: any) => c.id === engagement.contractorId);
            const organization = data.organizations.find((o: any) => o.id === engagement.organizationId);
            const status = getEngagementStatus(engagement.id);

            return (
              <div
                key={engagement.id}
                onClick={() => onSelect(engagement.id)}
                className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl hover:border-blue-200 transition-all duration-200 hover:scale-[1.01]"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{engagement.roleTitle}</h3>
                    <p className="text-gray-600 mt-1">
                      <span className="font-medium">{contractor?.displayName}</span> bij <span className="font-medium">{organization?.name}</span>
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                      <span>{engagement.startDate} - {engagement.endDate || 'Doorlopend'}</span>
                      {engagement.rateHourly > 0 && <span>€{engagement.rateHourly}/uur</span>}
                    </div>
                  </div>
                  <StatusBadge status={status} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const PeopleManagement = ({ data, onUpdate }: any) => {
  const [showAddContractor, setShowAddContractor] = useState(false);
  const [showAddOrganization, setShowAddOrganization] = useState(false);

  const handleAddContractor = (formData: any) => {
    const newContractor = {
      id: `contractor_${Date.now()}`,
      tenantId: data.tenant.id,
      ...formData
    };
    onUpdate({
      ...data,
      contractors: [...data.contractors, newContractor]
    });
  };

  const handleAddOrganization = (formData: any) => {
    const newOrganization = {
      id: `org_${Date.now()}`,
      tenantId: data.tenant.id,
      ...formData
    };
    onUpdate({
      ...data,
      organizations: [...data.organizations, newOrganization]
    });
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
            ZZP&apos;ers
          </h2>
          <button
            onClick={() => setShowAddContractor(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-blue-500/50 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:scale-105"
          >
            <UserPlus className="w-4 h-4" />
            Toevoegen
          </button>
        </div>
        <div className="grid gap-3">
          {data.contractors.map((contractor: any) => (
            <div key={contractor.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {contractor.displayName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{contractor.displayName}</h3>
                  <p className="text-sm text-gray-500">{contractor.email}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="w-6 h-6 text-purple-600" />
            Organisaties
          </h2>
          <button
            onClick={() => setShowAddOrganization(true)}
            className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-semibold shadow-lg shadow-purple-500/50 hover:from-purple-700 hover:to-pink-700 transition-all duration-200 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Toevoegen
          </button>
        </div>
        <div className="grid gap-3">
          {data.organizations.map((org: any) => (
            <div key={org.id} className="bg-white rounded-xl shadow-md p-5 border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                  {org.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{org.name}</h3>
                  <p className="text-sm text-gray-500">{org.type === 'CLIENT' ? 'Opdrachtgever' : 'Leverancier'}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showAddContractor && (
        <AddContractorModal
          onClose={() => setShowAddContractor(false)}
          onAdd={handleAddContractor}
        />
      )}
      {showAddOrganization && (
        <AddOrganizationModal
          onClose={() => setShowAddOrganization(false)}
          onAdd={handleAddOrganization}
        />
      )}
    </div>
  );
};

export default function ZZPComplianceApp() {
  const [data, setData] = useState<any>(null);
  const [selectedEngagement, setSelectedEngagement] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState('engagements');
  const [showAddEngagement, setShowAddEngagement] = useState(false);
  const [isClient, setIsClient] = useState(false);

  React.useEffect(() => {
    setIsClient(true);
    setData(initializeData());
  }, []);

  const handleUpdate = (newData: any) => {
    setData(newData);
    if (typeof window !== 'undefined') {
      localStorage.setItem('zzp_compliance_data', JSON.stringify(newData));
      localStorage.setItem('zzp_compliance_version', DATA_VERSION);
    }
  };

  const handleAddEngagement = (formData: any) => {
    const newEngagement = {
      id: `eng_${Date.now()}`,
      tenantId: data.tenant.id,
      ...formData,
      metadata: {}
    };
    handleUpdate({
      ...data,
      engagements: [...data.engagements, newEngagement]
    });
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

  if (!isClient || !data) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Laden...</p>
        </div>
      </div>
    );
  }

  const selectedEngagementData = data.engagements.find((e: any) => e.id === selectedEngagement);

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
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => { setCurrentView('engagements'); setSelectedEngagement(null); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'engagements'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/50'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Opdrachten
            </span>
          </button>
          <button
            onClick={() => { setCurrentView('people'); setSelectedEngagement(null); }}
            className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
              currentView === 'people'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/50'
                : 'bg-white text-gray-700 hover:bg-gray-50 border-2 border-gray-200'
            }`}
          >
            <span className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Mensen & Organisaties
            </span>
          </button>
        </div>

        {currentView === 'engagements' && !selectedEngagement && (
          <EngagementList
            data={data}
            onSelect={setSelectedEngagement}
            onUpdate={handleUpdate}
            onShowAddModal={() => setShowAddEngagement(true)}
          />
        )}

        {currentView === 'engagements' && selectedEngagement && selectedEngagementData && (
          <EngagementDetail
            engagement={selectedEngagementData}
            data={data}
            onBack={() => setSelectedEngagement(null)}
            onUpdate={handleUpdate}
          />
        )}

        {currentView === 'people' && (
          <PeopleManagement data={data} onUpdate={handleUpdate} />
        )}
      </div>

      {showAddEngagement && (
        <AddEngagementModal
          onClose={() => setShowAddEngagement(false)}
          onAdd={handleAddEngagement}
          contractors={data.contractors}
          organizations={data.organizations}
        />
      )}

      <footer className="bg-white/80 backdrop-blur-lg border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-sm text-gray-600 font-medium">
            ZZP Compliance MVP &bull; <span className="font-bold text-blue-600">{data.tenant.name}</span> &bull; Multi-tenant architectuur
          </p>
        </div>
      </footer>
    </div>
  );
}
