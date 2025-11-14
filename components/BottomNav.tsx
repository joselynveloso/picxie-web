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
        className="px-3 py-2 flex items-center gap-1 rounded-full transition-slow"
        style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          boxShadow: '0 4px 60px rgba(0, 0, 0, 0.7)',
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
                isActive ? 'text-[#e9d5ff]' : 'text-white/30 group-hover:text-white/60'
              }`} />
              {isActive && (
                <div
                  className="absolute inset-0 rounded-full opacity-50"
                  style={{ boxShadow: '0 0 30px rgba(233, 213, 255, 0.15)' }}
                />
              )}
              <span className={`
                absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap
                opacity-0 group-hover:opacity-100 transition-slow pointer-events-none
                ${isActive ? 'text-[#e9d5ff]' : 'text-white/80'}
              `}
              style={{
                background: 'rgba(255, 255, 255, 0.03)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.05)',
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
