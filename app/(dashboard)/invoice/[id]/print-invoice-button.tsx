'use client';

import { Printer } from 'lucide-react';

export default function PrintInvoiceButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-sm"
    >
      <Printer className="w-4 h-4" />
      Afdrukken / Opslaan als PDF
    </button>
  );
}
