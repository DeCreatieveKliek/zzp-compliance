import { auth } from '@/auth';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { Shield, LayoutDashboard, PlusCircle, ClipboardList, Receipt, LogOut } from 'lucide-react';
import { signOut } from '@/auth';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  const userLabel =
    (session.user as { type?: string; companyName?: string }).type === 'BEDRIJF'
      ? (session.user as { companyName?: string }).companyName || session.user.name
      : session.user.name;

  const userType =
    (session.user as { type?: string }).type === 'BEDRIJF' ? 'Bedrijf' : "ZZP'er";

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm print:hidden">
        <div className="p-6 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center gap-3 group">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl shadow-lg shadow-blue-500/30">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 leading-tight">ZZP Compliance</p>
              <p className="text-xs text-gray-500">Dashboard</p>
            </div>
          </Link>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {(userLabel || 'U').charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="font-semibold text-sm text-gray-900 truncate">{userLabel}</p>
              <p className="text-xs text-gray-500">{userType}</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200 group"
          >
            <LayoutDashboard className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Overzicht</span>
          </Link>
          <Link
            href="/assessment/new"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200 group"
          >
            <PlusCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Nieuwe beoordeling</span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200 group"
          >
            <ClipboardList className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Mijn beoordelingen</span>
          </Link>
          <Link
            href="/invoices"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-700 hover:bg-blue-50 hover:text-blue-700 font-medium transition-all duration-200 group"
          >
            <Receipt className="w-5 h-5 group-hover:scale-110 transition-transform" />
            <span className="text-sm">Facturen</span>
          </Link>
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-100">
          <form
            action={async () => {
              'use server';
              await signOut({ redirectTo: '/' });
            }}
          >
            <button
              type="submit"
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 font-medium transition-all duration-200 group"
            >
              <LogOut className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="text-sm">Uitloggen</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
}
