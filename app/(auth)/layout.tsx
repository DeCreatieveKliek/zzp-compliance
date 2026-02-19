import { Shield } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <Link href="/" className="inline-flex items-center gap-3 group">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-all duration-300">
            <Shield className="w-8 h-8 text-white" />
          </div>
          <span className="text-3xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            ZZP Compliance
          </span>
        </Link>
        <p className="text-gray-500 text-sm mt-2">Uw compliance partner</p>
      </div>
      {children}
    </div>
  );
}
