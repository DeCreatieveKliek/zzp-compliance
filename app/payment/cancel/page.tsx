import Link from 'next/link';
import { XCircle, ArrowLeft, Shield } from 'lucide-react';

export default function PaymentCancelPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex flex-col items-center justify-center p-6">
      <div className="mb-8 flex items-center gap-3">
        <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl">
          <Shield className="w-6 h-6 text-white" />
        </div>
        <span className="font-black text-xl text-gray-900">ZZP Compliance</span>
      </div>

      <div className="bg-white rounded-3xl shadow-xl shadow-blue-500/10 border border-gray-200 p-10 w-full max-w-md text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-8 h-8 text-gray-400" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Betaling geannuleerd</h2>
        <p className="text-gray-500 text-sm mb-8 leading-relaxed">
          Uw betaling is geannuleerd. Uw beoordeling is opgeslagen als concept en u kunt deze
          later alsnog indienen.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg shadow-blue-500/30 hover:scale-[1.02] transition-all"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
      </div>
    </div>
  );
}
