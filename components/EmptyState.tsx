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
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="glass-medium rounded-full p-6 mb-6 transition-smooth hover:glass">
        <Icon className="h-16 w-16 text-gray-500" />
      </div>
      <h3 className="text-xl font-semibold text-gray-200 mb-3">{title}</h3>
      <p className="text-sm text-gray-400 max-w-sm mb-8">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="px-6 py-3 glass-medium text-gray-100 text-sm font-semibold rounded-xl hover:active-state transition-smooth"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
