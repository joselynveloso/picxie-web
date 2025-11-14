import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  subtitle?: string;
}

export default function StatCard({ title, value, icon: Icon, subtitle }: StatCardProps) {
  return (
    <div className="glass-card rounded-2xl p-6 group">
      <div className="flex items-center justify-between mb-5">
        <div className="glass-medium rounded-xl p-3 transition-smooth group-hover:bg-[#06b6d4]/10 group-hover:border-[#06b6d4]/30">
          <Icon className="h-6 w-6 text-[#06b6d4] transition-smooth group-hover:scale-110" />
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">{title}</p>
        <p className="text-4xl font-bold text-gray-100 transition-smooth">{value}</p>
        {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
