'use client';

import { Download } from 'lucide-react';

export default function PrintAssessmentButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Download className="w-4 h-4" />
      Download PDF
    </button>
  );
}
