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
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50">
      <div className="glass-card px-4 py-3 flex items-center gap-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`
                relative px-6 py-3 rounded-2xl transition-slow group
                ${isActive ? 'active-state' : 'hover:bg-white/5'}
              `}
            >
              <div className="flex flex-col items-center gap-1.5">
                <Icon className={`h-5 w-5 transition-slow ${
                  isActive ? 'text-[#e9d5ff]' : 'text-gray-400 group-hover:text-white'
                }`} />
                <span className={`text-xs font-medium transition-slow ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-300'
                }`}>
                  {item.name}
                </span>
              </div>
              {isActive && (
                <div className="absolute inset-0 rounded-2xl accent-glow opacity-50" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
