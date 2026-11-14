import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Automatically purge broken/incompatible custom storage keys to prevent recovery loops
    try {
      localStorage.removeItem('bridal_portfolio_custom_content_v2');
      localStorage.removeItem('bridal_portfolio_custom_content_v1');
    } catch (_) {}
    console.error('Editorial Portfolio Error Boundary caught an error:', error, errorInfo);
  }

  private handleReset = () => {
    try {
      localStorage.removeItem('bridal_portfolio_custom_content_v2');
      localStorage.removeItem('bridal_portfolio_custom_content_v1');
      if (typeof window !== 'undefined') {
        Object.keys(localStorage).forEach((key) => {
          if (key.includes('bridal_portfolio') || key.includes('custom_content')) {
            localStorage.removeItem(key);
          }
        });
      }
    } catch (_) {}
    window.location.href = window.location.origin + window.location.pathname;
  };

  private handleRecoverNow = () => {
    try {
      localStorage.removeItem('bridal_portfolio_custom_content_v2');
      localStorage.removeItem('bridal_portfolio_custom_content_v1');
    } catch (_) {}
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0B090C] text-[#FAF7F2] flex flex-col items-center justify-center p-8 text-center select-none">
          <div className="max-w-xl mx-auto space-y-6">
            <span className="font-anton text-4xl text-[#DEC596] tracking-wider block">
              ✦ EDITORIAL RECOVERY MODE
            </span>
            <h1 className="font-anton text-2xl uppercase tracking-tight text-white/90">
              The portfolio encountered an unexpected display state.
            </h1>
            <p className="text-xs font-sans text-white/60 leading-relaxed max-w-md mx-auto">
              {(import.meta as any).env?.DEV
                ? (this.state.error?.message || 'An unhandled rendering exception occurred.')
                : 'The portfolio encountered an unexpected display state. Your display has been automatically recovered.'}
            </p>
            <div className="pt-4 flex flex-wrap justify-center gap-4">
              <button
                onClick={this.handleRecoverNow}
                className="px-6 py-2.5 bg-[#DEC596] text-[#0B090C] text-xs uppercase tracking-widest font-semibold hover:bg-[#F5EEDC] transition-colors rounded-full shadow-md cursor-pointer"
              >
                Recover Portfolio Now ✦
              </button>
              <button
                onClick={this.handleReset}
                className="px-6 py-2.5 bg-[#6E1426] text-white text-xs uppercase tracking-widest font-semibold hover:bg-[#4E0A17] transition-colors rounded-full shadow-md cursor-pointer"
              >
                Reset Custom Data & Reload ↺
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
