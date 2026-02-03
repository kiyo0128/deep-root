import { type ReactNode } from 'react';
import { TreeDeciduous } from 'lucide-react';

interface GameLayoutProps {
    header: ReactNode;
    leftPanel: ReactNode;  // Resources
    centerPanel: ReactNode; // Battle / visuals
    rightPanel: ReactNode; // Actions / logs
    footer?: ReactNode; // Status bar or version
}

export function GameLayout({ header, leftPanel, centerPanel, rightPanel, footer }: GameLayoutProps) {
    return (
        <div className="min-h-screen bg-bg text-text p-4 md:p-6 lg:p-8 flex flex-col gap-6 max-w-[1600px] mx-auto">
            {/* Header */}
            <header className="flex justify-between items-center py-2 px-1">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
                        <TreeDeciduous className="text-primary w-6 h-6 animate-pulse-slow" />
                    </div>
                    <div className="flex flex-col">
                        <h1 className="text-2xl font-black tracking-tighter text-white leading-none">DEEP ROOT</h1>
                        <span className="text-[10px] text-primary/60 tracking-[0.3em] font-bold uppercase">Abyss Simulator</span>
                    </div>
                </div>
                <div>
                    {header}
                </div>
            </header>

            {/* Main Grid: Mobile (Stack) -> Desktop (3 Col) */}
            <main className="flex-1 grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                {/* Left: Resources (3 cols) */}
                <section className="md:col-span-4 lg:col-span-3 flex flex-col gap-4 sticky top-6">
                    {leftPanel}
                </section>

                {/* Center: Visuals/Battle (5 cols) */}
                <section className="md:col-span-8 lg:col-span-5 flex flex-col gap-6 min-h-[400px]">
                    {centerPanel}
                </section>

                {/* Right: Actions/Log (4 cols) */}
                <section className="md:col-span-12 lg:col-span-4 flex flex-col gap-4 h-[600px] lg:h-auto lg:sticky lg:top-6">
                    {rightPanel}
                </section>
            </main>

            {/* Footer */}
            <footer className="py-4 text-center">
                {footer}
            </footer>
        </div>
    );
}
