'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Menu, X, Dumbbell, ChevronDown, User, LogOut, Settings, LayoutDashboard } from 'lucide-react';
import toast from 'react-hot-toast';

const LANGUAGES = [
  { code: 'en', label: 'EN', flag: '🇺🇸', name: 'English' },
  { code: 'ur', label: 'UR', flag: '🇵🇰', name: 'اردو' },
  { code: 'ja', label: 'JA', flag: '🇯🇵', name: '日本語' },
];

export default function Navbar() {
  const { user, userData, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [activeLang, setActiveLang] = useState('en');

  const isActive = (path: string) => pathname === path;

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out successfully');
    router.push('/');
  };

  const navLinks = [
    { href: '/exercises', label: 'Exercises' },
    { href: '/plans', label: 'Plans' },
    { href: '/pricing', label: 'Pricing' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gym-border bg-gym-black/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative">
              <Dumbbell className="w-7 h-7 text-neon-green group-hover:drop-shadow-[0_0_8px_#39FF14] transition-all" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Gym<span className="text-neon-green">Buddy</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.href)
                    ? 'text-neon-green bg-neon-green/10'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => { setLangOpen(!langOpen); setUserOpen(false); }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gym-border bg-gym-card hover:border-neon-green/40 transition-all text-sm"
              >
                <span>{LANGUAGES.find(l => l.code === activeLang)?.flag}</span>
                <span className="text-gray-300">{LANGUAGES.find(l => l.code === activeLang)?.label}</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
              </button>
              {langOpen && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-gym-border bg-gym-card shadow-xl overflow-hidden">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => { setActiveLang(lang.code); setLangOpen(false); }}
                      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-white/5 transition-all ${
                        activeLang === lang.code ? 'text-neon-green' : 'text-gray-300'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.name}</span>
                      {activeLang === lang.code && <span className="ml-auto text-neon-green">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Auth */}
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-all"
                >
                  <LayoutDashboard className="w-4 h-4" />
                  Dashboard
                </Link>
                <div className="relative">
                  <button
                    onClick={() => { setUserOpen(!userOpen); setLangOpen(false); }}
                    className="flex items-center gap-2 p-1 rounded-lg hover:bg-white/5 transition-all"
                  >
                    {user.photoURL ? (
                      <img src={user.photoURL} alt="Avatar" className="w-8 h-8 rounded-full border border-gym-border" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-neon-green/20 flex items-center justify-center border border-neon-green/30">
                        <User className="w-4 h-4 text-neon-green" />
                      </div>
                    )}
                  </button>
                  {userOpen && (
                    <div className="absolute right-0 mt-2 w-48 rounded-xl border border-gym-border bg-gym-card shadow-xl overflow-hidden">
                      <div className="px-4 py-3 border-b border-gym-border">
                        <p className="text-sm font-medium truncate">{user.displayName || 'User'}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email}</p>
                      </div>
                      <Link href="/profile" onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-all">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      {userData?.isAdmin && (
                        <Link href="/admin" onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:bg-white/5 transition-all">
                          <Settings className="w-4 h-4" /> Admin Panel
                        </Link>
                      )}
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-400/10 transition-all">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors px-3 py-1.5">
                  Login
                </Link>
                <Link href="/signup"
                  className="btn-neon px-4 py-2 rounded-lg text-sm font-semibold">
                  Get Started
                </Link>
              </>
            )}

            {/* Mobile menu button */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 text-gray-400 hover:text-white">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-gym-border bg-gym-dark">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                {link.label}
              </Link>
            ))}
            {user && (
              <Link href="/dashboard" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                Dashboard
              </Link>
            )}
            {!user && (
              <Link href="/login" onClick={() => setMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-sm text-gray-300 hover:bg-white/5">
                Login
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
