'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, MapPin, Briefcase, Settings, Menu, X } from 'lucide-react';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Photos', href: '/photos', icon: Image },
  { name: 'Sites', href: '/sites', icon: MapPin },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Mobile menu button */}
      <button
        type="button"
        className="lg:hidden fixed top-4 left-4 z-50 p-2 glass rounded-xl transition-smooth hover:glass-medium"
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      >
        {isMobileMenuOpen ? (
          <X className="h-6 w-6 text-gray-200" />
        ) : (
          <Menu className="h-6 w-6 text-gray-200" />
        )}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 z-40 h-screen w-64 glass-medium border-r border-white/10
          transition-all duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        <div className="flex flex-col h-full relative">
          {/* Logo/Brand */}
          <div className="flex items-center h-16 px-6 border-b border-white/10">
            <h1 className="text-xl font-semibold text-gray-100 tracking-tight">Picxie</h1>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium
                    transition-smooth relative overflow-hidden group
                    ${
                      isActive
                        ? 'active-state text-gray-100'
                        : 'text-gray-400 hover:text-gray-100 hover:glass'
                    }
                  `}
                >
                  <Icon className={`h-5 w-5 transition-smooth ${isActive ? 'text-[#06b6d4]' : 'group-hover:text-[#06b6d4]'}`} />
                  <span>{item.name}</span>
                  {isActive && (
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#06b6d4] rounded-r-full accent-glow-sm" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-white/10">
            <p className="text-xs text-gray-500 text-center font-medium">
              Picxie Web v0.3.0
            </p>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-30 bg-black/80 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </>
  );
}
