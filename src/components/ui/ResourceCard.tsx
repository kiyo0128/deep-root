import type { LucideIcon } from 'lucide-react';

interface ResourceCardProps {
  label: string;
  value: number;
  max?: number;
  icon: LucideIcon;
  color: string; // e.g., "text-primary"
  subLabel?: string;
  trend?: number; // positive or negative for checking rate
}

export function ResourceCard({ label, value, max, icon: Icon, color, subLabel }: ResourceCardProps) {


  return (
    <div className="card-glossy p-4 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors">
      {/* Background glow effect */}
      <div className={`absolute -right-4 -top-4 w-20 h-20 bg-current opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity ${color}`} />

      <div className="flex justify-between items-start relative z-10">
        <div className="flex flex-col">
          <span className="text-[10px] font-black tracking-widest text-text-muted uppercase mb-1">{label}</span>
          <div className="flex items-baseline gap-1">
            <span className={`text-2xl font-black tabular-nums tracking-tight ${color} drop-shadow-sm`}>
              {Math.floor(value).toLocaleString()}
            </span>
            {max && (
              <span className="text-xs text-text-dim font-bold">
                / {max.toLocaleString()}
              </span>
            )}
          </div>
          {subLabel && (
            <span className="text-[10px] text-text-dim mt-1 font-mono">{subLabel}</span>
          )}
        </div>

        <div className={`p-2.5 rounded-xl bg-surface-active/50 border border-white/5 ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {max && (
        <div className="mt-3 h-1.5 w-full bg-surface-active rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${color.replace('text-', 'bg-')}`}
            style={{ width: `${(value / max) * 100}%` }}
          />
        </div>
      )}
    </div>
  );
}
