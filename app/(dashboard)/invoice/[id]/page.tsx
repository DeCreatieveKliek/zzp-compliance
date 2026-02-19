import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Download, Shield, FileText } from 'lucide-react';
import PrintInvoiceButton from './print-invoice-button';

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect('/login');

  const { id } = await params;

  const invoice = await prisma.invoice.findFirst({
    where: { id, userId: session.user.id },
    include: { assessment: true },
  });

  if (!invoice) notFound();

  const formatCents = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="p-6 max-w-3xl">
      {/* Back + actions */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Terug naar dashboard
        </Link>
        <div className="flex items-center gap-3">
          <PrintInvoiceButton />
        </div>
      </div>

      {/* Invoice card */}
      <div
        id="invoice-content"
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-8 py-6 text-white print:bg-blue-700">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-black text-lg leading-tight">ZZP Compliance</p>
                <p className="text-blue-200 text-xs">zzpcompliance.nl</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-blue-200 text-xs uppercase tracking-wider font-semibold">Factuur</p>
              <p className="font-black text-xl mt-0.5">{invoice.invoiceNumber}</p>
            </div>
          </div>
        </div>

        <div className="px-8 py-6">
          {/* Meta row */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            {/* Factuurgegevens */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Factuurgegevens</p>
              <div className="space-y-1 text-sm text-gray-700">
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 flex-shrink-0">Factuurdatum</span>
                  <span className="font-medium">{formatDate(invoice.issuedAt)}</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 flex-shrink-0">Status</span>
                  <span className="font-semibold text-emerald-600">Betaald</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-400 w-24 flex-shrink-0">Valuta</span>
                  <span className="font-medium">{invoice.currency}</span>
                </div>
              </div>
            </div>

            {/* Klantgegevens */}
            <div>
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Klantgegevens</p>
              <div className="space-y-1 text-sm text-gray-700">
                <p className="font-semibold text-gray-900">{invoice.customerName}</p>
                {invoice.companyName && (
                  <p className="text-gray-600">{invoice.companyName}</p>
                )}
                <p className="text-gray-600">{invoice.customerEmail}</p>
              </div>
            </div>
          </div>

          {/* Line items */}
          <div className="mb-8">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Omschrijving</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Aantal</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Prijs</th>
                  <th className="text-right py-3 text-xs font-semibold text-gray-400 uppercase tracking-wider">Bedrag</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="py-4">
                    <p className="font-semibold text-gray-900">{invoice.description}</p>
                    <p className="text-gray-500 text-xs mt-0.5">Beoordeling: {invoice.assessment.title}</p>
                    <p className="text-gray-400 text-xs">Referentie: {invoice.assessment.id.slice(0, 8).toUpperCase()}</p>
                  </td>
                  <td className="py-4 text-right text-gray-700">1</td>
                  <td className="py-4 text-right text-gray-700">{formatCents(invoice.amount)}</td>
                  <td className="py-4 text-right font-medium text-gray-900">{formatCents(invoice.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end mb-8">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotaal (excl. BTW)</span>
                <span>{formatCents(invoice.amount)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>BTW (21%)</span>
                <span>{formatCents(invoice.vatAmount)}</span>
              </div>
              <div className="flex justify-between font-bold text-gray-900 text-base pt-2 border-t-2 border-gray-900">
                <span>Totaal</span>
                <span>{formatCents(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-6">
            <div className="flex items-start gap-3 p-4 bg-emerald-50 rounded-xl">
              <FileText className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-emerald-800">Betaling ontvangen</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Deze factuur is voldaan via Mollie. Bewaar dit document voor uw administratie.
                </p>
              </div>
            </div>
            <p className="text-xs text-gray-400 text-center mt-6">
              ZZP Compliance · KvK: 12345678 · BTW: NL123456789B01 · zzpcompliance.nl
            </p>
          </div>
        </div>
      </div>

      {/* Download hint */}
      <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 print:hidden">
        <Download className="w-4 h-4" />
        <span>Gebruik de printknop hierboven om de factuur op te slaan als PDF.</span>
      </div>
    </div>
  );
}
