'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when pathname changes
  useEffect(() => {
    if (isOpen) {
      setIsOpen(false);
    }
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Tentang', href: '/tentang' },
    { name: 'Layanan', href: '/layanan' },
    { name: 'Asesmen', href: '/asesmen' },
    { name: 'Grafologi', href: '/grafologi' },
    { name: 'Artikel', href: '/artikel' },
    { name: 'Kontak', href: '/kontak' },
  ];

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md border-b border-slate-800 py-3 shadow-lg'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-red-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
              <span className="text-white font-bold text-2xl">L</span>
              <span className="text-white font-bold text-xl bg-gradient-to-r from-white to-slate-900 bg-clip-text text-transparent">Lentera Batin</span>
            </div>
          </Link>
        </div>

        {/* Desktop NavLinks */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                pathname === link.href
                  ? 'text-orange-400'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 bg-slate-900/50 backdrop-blur-sm rounded-lg transition-all hover:bg-slate-900/80"
            aria-label="Toggle menu navigasi"
            aria-expanded={isOpen}
          >
            {isOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6L18" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 6h16" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6l16 4" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 12h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu overlay */}
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <div
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50"
              onClick={() => setIsOpen(false)}
              aria-label="Tutup menu navigasi"
            />

            {/* Mobile menu panel */}
            <div className="fixed inset-x-0 bottom-0 w-full bg-white rounded-t-3xl shadow-2xl z-[60] transform transition-transform duration-300">
              <div className="max-w-md mx-auto">
                {/* Menu header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
                  <div className="text-lg font-bold text-slate-800">
                    Menu Navigasi
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-slate-500 hover:text-slate-700 p-2 transition-colors"
                    aria-label="Tutup menu"
                  >
                    ✕
                  </button>
                </div>

                {/* Menu items */}
                <div className="py-4">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block px-6 py-4 rounded-xl text-base font-medium transition-colors ${
                        pathname === link.href
                          ? 'text-orange-400 bg-orange-50'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
}
