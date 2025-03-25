
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import supabaseAuth from '@/services/supabaseAuth';

const Callback = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');
        const state = searchParams.get('state');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setStatus('error');
          setErrorMessage(errorDescription || 'Authorization failed');
          return;
        }

        if (!code || !state) {
          console.error('Missing code or state');
          setStatus('error');
          setErrorMessage('Missing authorization parameters');
          return;
        }

        // Exchange the code for tokens
        await supabaseAuth.handleCallback(code, state);
        setStatus('success');
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } catch (error) {
        console.error('Error handling callback:', error);
        setStatus('error');
        setErrorMessage((error as Error).message || 'An unknown error occurred');
      }
    };

    handleCallback();
  }, [location.search, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="glass-panel max-w-md w-full p-8 text-center space-y-6">
        {status === 'loading' && (
          <>
            <div className="w-16 h-16 border-4 border-supabase/30 border-t-supabase rounded-full animate-spin mx-auto"></div>
            <h2 className="text-2xl font-medium">Connecting to Supabase</h2>
            <p className="text-gray-500">Please wait while we complete the authorization process...</p>
          </>
        )}
        
        {status === 'success' && (
          <>
            <div className="w-16 h-16 rounded-full bg-supabase flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium">Successfully Connected!</h2>
            <p className="text-gray-500">You've successfully connected your Supabase account. Redirecting you to the dashboard...</p>
          </>
        )}
        
        {status === 'error' && (
          <>
            <div className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h2 className="text-2xl font-medium">Connection Failed</h2>
            <p className="text-red-500">{errorMessage || 'An unknown error occurred'}</p>
            <button 
              onClick={() => navigate('/')}
              className="py-2 px-4 mt-4 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
            >
              Return to Home
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Callback;
