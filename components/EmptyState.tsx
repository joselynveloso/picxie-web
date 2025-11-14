import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export default function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Icon className="h-12 w-12 text-white/20 mb-8" />
      <h3 className="text-3xl font-semibold text-white mb-4">{title}</h3>
      <p className="text-white/40 max-w-md mb-10 leading-relaxed">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-8 py-4 glass-card text-white font-medium hover:text-[#e9d5ff] transition-slow"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
