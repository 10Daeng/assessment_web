'use client';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin', label: 'Dashboard', icon: '📊' },
  { href: '/admin/users', label: 'Data Klien / Identitas', icon: '👤' },
  { href: '/admin/disc', label: 'Hasil DISC', icon: '🎯' },
  { href: '/admin/hexaco', label: 'Hasil HEXACO', icon: '🧬' },
  { href: '/admin/reports', label: 'Laporan Lengkap', icon: '📄' },
  { href: '/admin/duplicates', label: 'Data Ganda', icon: '⚠️' },
];

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Don't apply admin layout to login page
  if (pathname === '/admin/login') {
    return children;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-40">
        <div className="p-5 border-b border-slate-800">
          <Link href="/admin" className="flex items-center gap-3">
            <Image src="/logo.png" alt="Lentera Batin" width={130} height={36} className="h-8 w-auto brightness-110" />
          </Link>
          <p className="text-[10px] text-slate-600 mt-1.5 uppercase tracking-widest pl-1">Admin Dashboard</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                  ${isActive 
                    ? 'bg-blue-600/20 text-blue-400 shadow-sm' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }
                `}
              >
                <span className="text-lg">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-800 space-y-1">
          <Link href="/" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-slate-500 hover:text-white hover:bg-slate-800 transition-all">
            <span>←</span> Kembali ke Asesmen
          </Link>
          <button
            onClick={async () => {
              await fetch('/api/admin/auth/logout', { method: 'POST' });
              window.location.href = '/admin/login';
            }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-400/70 hover:text-red-400 hover:bg-red-500/10 transition-all w-full text-left"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <header className="sticky top-0 z-30 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-white">
              {navItems.find(n => n.href === pathname)?.label || 'Admin Panel'}
            </h1>
            <div className="text-xs text-slate-500">
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </header>
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
