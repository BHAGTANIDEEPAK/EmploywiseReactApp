import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api.ts';
import { ClipLoader } from 'react-spinners';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // For loader
  const [success, setSuccess] = useState(false); // For success message
  const navigate = useNavigate();

  // Redirect to /users if token already exists
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/users');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); // Start loader
    setError('');
    setSuccess(false);

    try {
      const response = await loginUser(email, password);
      localStorage.setItem('token', response.data.token);
      setSuccess(true); // Show success message
      setTimeout(() => {
        navigate('/users'); // Redirect to UserList page after success
      }, 1500);
    } catch (err) {
      setError('Invalid credentials');
    } finally {
      setLoading(false); // Stop loader
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-100 via-blue-300 to-blue-500">
      {loading || success ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-opacity-80 bg-white">
          {loading && (
            <div className="flex flex-col items-center">
              <ClipLoader color="#2563eb" size={50} />
              <div className="text-blue-700 text-xl mt-4 font-semibold">Logging in...</div>
            </div>
          )}
          {success && (
            <div className="flex flex-col items-center animate-fade-in">
              <div className="text-green-600 text-xl font-bold">Login successful!</div>
              <div className="text-gray-600 text-lg mt-2">Redirecting...</div>
            </div>
          )}
        </div>
      ) : (
        <form className="bg-white p-8 rounded-lg shadow-2xl w-96 animate-slide-in" onSubmit={handleLogin}>
                    <h2 className="text-3xl font-extrabold text-center text-blue-600 mb-6">Welcome Back!</h2>
                    <p className="text-center text-gray-500 mb-8">Please login to continue</p>
          <div>
            <label htmlFor="email" className="block mb-2 text-gray-700 font-medium">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block mb-2 text-gray-700 font-medium">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>
          {error && <div className="text-red-500 mb-4 font-medium">{error}</div>} {/* Error Message */}
          <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold p-3 rounded-lg transition-all duration-300" disabled={loading}>
            {loading ? 'Please Wait...' : 'Login'}
          </button>
        </form>
      )}
    </div>
  );
};

export default LoginPage;
