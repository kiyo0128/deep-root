import { type ReactNode } from 'react';

interface ActionButtonProps {
    label: string;
    subLabel?: string;
    icon?: ReactNode;
    onClick: () => void;
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'default';
    cost?: string;
    isActive?: boolean; // For togglable skills
}

export function ActionButton({
    label,
    subLabel,
    icon,
    onClick,
    disabled,
    variant = 'default',
    cost,
    isActive
}: ActionButtonProps) {

    const baseClasses = "relative flex items-center gap-4 p-4 w-full rounded-xl border-2 transition-all duration-200 group overflow-hidden";

    const variants = {
        default: "bg-surface border-border text-text-muted hover:border-border-glow hover:bg-surface-hover",
        primary: "bg-primary/5 border-primary/20 text-primary hover:bg-primary/10 hover:border-primary/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.1)]",
        secondary: "bg-secondary/5 border-secondary/20 text-secondary hover:bg-secondary/10 hover:border-secondary/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.1)]",
        accent: "bg-accent/5 border-accent/20 text-accent hover:bg-accent/10 hover:border-accent/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.1)]",
        danger: "bg-danger/5 border-danger/20 text-danger hover:bg-danger/10 hover:border-danger/50"
    };

    const activeClasses = isActive ? "ring-2 ring-offset-2 ring-offset-bg ring-current animate-pulse" : "";
    const disabledClasses = disabled ? "opacity-40 cursor-not-allowed grayscale decoration-slice" : "active:scale-[0.98]";

    return (
        <button
            onClick={onClick}
            disabled={disabled}
            className={`${baseClasses} ${variants[variant]} ${activeClasses} ${disabledClasses}`}
        >
            {/* Icon Container */}
            <div className={`p-3 rounded-lg bg-black/20 border border-white/5 shadow-inner ${isActive ? 'animate-bounce' : ''}`}>
                {icon}
            </div>

            {/* Text Content */}
            <div className="flex-1 text-left flex flex-col">
                <span className="font-black text-sm uppercase tracking-tight leading-none mb-1">{label}</span>
                <div className="flex justify-between items-center w-full">
                    <span className="text-[10px] font-bold opacity-70 uppercase tracking-widest">{subLabel}</span>
                    {cost && (
                        <span className="text-xs font-mono font-bold tabular-nums opacity-90 bg-black/30 px-2 py-0.5 rounded-md">
                            {cost}
                        </span>
                    )}
                </div>
            </div>

            {/* Hover visual */}
            {!disabled && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000" />
            )}
        </button>
    );
}
