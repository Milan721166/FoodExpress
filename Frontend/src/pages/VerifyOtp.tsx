import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import axios from 'axios';

interface OtpFormData {
  otp: string;
}

interface LocationState {
  email: string;
  userId?: string;
}

const VerifyOtp: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(30);
  const { register, handleSubmit, formState: { errors } } = useForm<OtpFormData>();

  // Type-safe state access
  const { email, userId } = (location.state as LocationState) || {};

  // Handle resend OTP countdown
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (resendDisabled && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0) {
      setResendDisabled(false);
    }
    return () => clearTimeout(timer);
  }, [resendDisabled, countdown]);

  const onSubmit = async (data: OtpFormData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post('http://localhost:3001/api/auth/verify-otp', {
        otp: data.otp,
        email,         // or phone, or userId, if required by backend
      });
      
      // If successful verification, navigate based on user status
      if (response.data.token) {
        // Store token and redirect to dashboard/home
        localStorage.setItem('authToken', response.data.token);
        navigate('/dashboard');
      } else {
        // If no token returned, go to login
        navigate('/login', { state: { verified: true } });
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'OTP verification failed. Please try again.');
      console.error('OTP verification error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setResendDisabled(true);
    setCountdown(30);
    setError(null);
    
    try {
      await axios.post('/api/auth/resend-otp', { email, userId });
      // You might want to show a success message here
    } catch (err) {
      setError('Failed to resend OTP. Please try again later.');
    }
  };

  if (!email) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center p-6 max-w-md bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-red-500 mb-4">
            Verification Error
          </h2>
          <p className="text-gray-600 mb-4">
            No email provided for OTP verification.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="btn-primary py-2 px-4"
          >
            Go to Registration
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
          <p className="mt-2 text-gray-600">
            Enter the 6-digit OTP sent to <span className="font-medium text-blue-600">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
              OTP Code
            </label>
            <input
              id="otp"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              autoComplete="one-time-code"
              maxLength={6}
              {...register('otp', { 
                required: 'OTP is required',
                minLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                maxLength: {
                  value: 6,
                  message: 'OTP must be 6 digits'
                },
                pattern: {
                  value: /^[0-9]+$/,
                  message: 'OTP must contain only numbers'
                }
              })}
              className={`input-field ${errors.otp ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter 6-digit OTP"
              disabled={loading}
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-600">{errors.otp.message}</p>
            )}
          </div>

          {error && (
            <div className="rounded-md bg-red-50 p-3">
              <p className="text-sm text-red-600 text-center">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn-primary py-3 px-4 text-lg font-medium rounded-md shadow-sm ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Verify'}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-500">
            Didn't receive the code?{' '}
            <button
              onClick={handleResendOtp}
              disabled={resendDisabled}
              className={`font-medium text-blue-600 hover:text-blue-500 ${
                resendDisabled ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {resendDisabled ? `Resend in ${countdown}s` : 'Resend OTP'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;