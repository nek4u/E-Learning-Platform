import { Component } from 'react';

export default class ErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-[400px] flex-col items-center justify-center p-8 text-center">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Something went wrong</h2>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Please refresh the page or try again later.</p>
          <button onClick={() => window.location.reload()} className="btn-primary mt-6">
            Refresh Page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
