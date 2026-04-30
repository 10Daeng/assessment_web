'use client';

import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log error to error reporting service
    console.error('Error caught by boundary:', error, errorInfo);

    this.setState({
      error,
      errorInfo
    });

    // Log to your error tracking service (e.g., Sentry, LogRocket)
    if (typeof window !== 'undefined' && window.Sentry) {
      window.Sentry.captureException(error, {
        contexts: {
          react: {
            componentStack: errorInfo.componentStack
          }
        }
      });
    }
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

// Functional wrapper for easier use in Next.js
export function withErrorBoundary(Component, fallback = <ErrorFallback />) {
  return function WrappedComponent(props) {
    return (
      <ErrorBoundary fallback={fallback}>
        <Component {...props} />
      </ErrorBoundary>
    );
  };
}

// Default fallback component
function ErrorFallback({ error, resetError }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-10 h-10 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 2.502-3.215V8.007c0-1.548-1.963-2.502-3.215-2.502H4.832c-1.54 0-2.502 1.667-2.502 3.215v6.778c0 1.54 1.963 2.502 3.215 2.502h13.856c1.54 0 2.502-1.667 2.502-3.215V8.007c0-1.548-1.963-2.502-3.215-2.502H4.832c-1.54 0-2.502 1.667-2.502 3.215v6.778c0 1.54 1.963 2.502 3.215 2.502h13.856c1.54 0 2.502-1.667 2.502-3.215V8.007c0-1.548-1.963-2.502-3.215-2.502H4.832z"
            />
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-slate-800 mb-3">
          Terjadi Kesalahan
        </h2>

        <p className="text-slate-600 mb-6 leading-relaxed">
          Maaf, terjadi kesalahan tak terduga. Silakan refresh halaman atau coba lagi nanti.
          Jika masalah berlanjut, hubungi tim kami.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => window.location.reload()}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg"
          >
            Refresh Halaman
          </button>

          <a
            href="/"
            className="block w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Kembali ke Beranda
          </a>

          <a
            href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '6285117778798'}?text=${encodeURIComponent('Halo, saya mengalami kesalahan saat menggunakan website Lentera Batin. Mohon bantuannya.')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200"
          >
            Hubungi Support
          </a>
        </div>

        {process.env.NODE_ENV === 'development' && error && (
          <details className="mt-6 text-left">
            <summary className="cursor-pointer text-sm font-medium text-slate-500 hover:text-slate-700">
              Error Details (Development Only)
            </summary>
            <pre className="mt-3 p-4 bg-red-50 text-red-800 rounded-lg text-xs overflow-auto">
              {error.toString()}
              {this.state.errorInfo && this.state.errorInfo.componentStack && (
                <>
                  {'\n'}
                  {this.state.errorInfo.componentStack}
                </>
              )}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
