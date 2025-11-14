import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="transition-smooth group">
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <Icon className="h-4 w-4 text-white/40" />
          <p className="text-sm font-medium text-white/60 uppercase tracking-[0.2em]">{title}</p>
        </div>
        <p className="text-7xl font-bold text-white tracking-tight group-hover:text-[#e9d5ff] transition-slow">{value}</p>
        {subtitle && <p className="text-sm text-white/40">{subtitle}</p>}
      </div>
    </div>
  );
}
