import { auth } from '@/auth';
import { prisma } from '@/lib/db';
import Link from 'next/link';
import { FileText, Download, Receipt } from 'lucide-react';

export default async function InvoicesPage() {
  const session = await auth();

  const invoices = await prisma.invoice.findMany({
    where: { userId: session!.user.id },
    include: { assessment: true },
    orderBy: { issuedAt: 'desc' },
  });

  const formatCents = (cents: number) =>
    new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' }).format(cents / 100);

  const formatDate = (date: Date) =>
    new Date(date).toLocaleDateString('nl-NL', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Facturen</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Overzicht van al uw betalingen en facturen
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <Receipt className="w-4 h-4 text-blue-600" />
          <h2 className="font-semibold text-gray-900">Mijn facturen</h2>
        </div>

        {invoices.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-blue-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Nog geen facturen</h3>
            <p className="text-gray-500 text-sm">
              Facturen worden automatisch aangemaakt na een succesvolle betaling.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {invoices.map((invoice) => (
              <div
                key={invoice.id}
                className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <FileText className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">{invoice.invoiceNumber}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{invoice.assessment.title}</p>
                    <p className="text-xs text-gray-400">{formatDate(invoice.issuedAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="font-bold text-gray-900 text-sm">{formatCents(invoice.totalAmount)}</p>
                    <p className="text-xs text-gray-400">incl. 21% BTW</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700">
                    Betaald
                  </span>
                  <Link
                    href={`/invoice/${invoice.id}`}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Bekijken
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {invoices.length > 0 && (
        <p className="text-xs text-gray-400 mt-4 text-center">
          Open een factuur en gebruik Afdrukken / Opslaan als PDF om deze te downloaden.
        </p>
      )}
    </div>
  );
}
