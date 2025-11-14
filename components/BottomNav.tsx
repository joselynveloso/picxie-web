'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Image, MapPin, Briefcase, Settings } from 'lucide-react';

const navigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Photos', href: '/photos', icon: Image },
  { name: 'Sites', href: '/sites', icon: MapPin },
  { name: 'Projects', href: '/projects', icon: Briefcase },
  { name: 'Admin', href: '/admin', icon: Settings },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50">
      <div
        className="px-10 py-3 flex items-center gap-2 transition-slow"
        style={{
          background: 'rgba(20, 20, 20, 0.85)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '30px',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.5)',
          width: 'fit-content',
        }}
      >
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative px-4 py-2 rounded-full transition-slow group"
              title={item.name}
            >
              <Icon className={`h-4 w-4 transition-slow ${
                isActive ? 'text-white' : 'text-white/50 group-hover:text-white/75'
              }`} />
              {isActive && (
                <>
                  {/* Subtle glow for active icon */}
                  <div
                    className="absolute inset-0 rounded-full opacity-60"
                    style={{ boxShadow: '0 0 20px rgba(233, 213, 255, 0.3)' }}
                  />
                  {/* Small dot under active item */}
                  <div
                    className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full"
                    style={{ background: '#e9d5ff' }}
                  />
                </>
              )}
              <span className={`
                absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-slow pointer-events-none
                ${isActive ? 'text-white' : 'text-white/80'}
              `}
              style={{
                background: 'rgba(20, 20, 20, 0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
              >
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
