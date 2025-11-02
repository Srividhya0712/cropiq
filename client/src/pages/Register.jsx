import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Agriculture-themed SVG Icons
const EmailIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
  </svg>
);

const UserIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const LockIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
  </svg>
);

const EyeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
  </svg>
);

const EyeOffIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
  </svg>
);

const ArrowLeftIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
  </svg>
);

// Agriculture-specific icons
const LeafIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
  </svg>
);

const SeedIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2C8.13 2 5 5.13 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1s1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.87-3.13-7-7-7zm0 2c2.76 0 5 2.24 5 5s-2.24 5-5 5-5-2.24-5-5 2.24-5 5-5z"/>
  </svg>
);

const TractorIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SunIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const WheatIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M4.5 3L6 4.5L4.5 6L3 4.5L4.5 3M8.5 3L10 4.5L8.5 6L7 4.5L8.5 3M12.5 3L14 4.5L12.5 6L11 4.5L12.5 3M16.5 3L18 4.5L16.5 6L15 4.5L16.5 3M20.5 3L22 4.5L20.5 6L19 4.5L20.5 3M2 9L3.5 10.5L2 12L0.5 10.5L2 9M6 9L7.5 10.5L6 12L4.5 10.5L6 9M10 9L11.5 10.5L10 12L8.5 10.5L10 9M14 9L15.5 10.5L14 12L12.5 10.5L14 9M18 9L19.5 10.5L18 12L16.5 10.5L18 9M22 9L23.5 10.5L22 12L20.5 10.5L22 9M4 15L5.5 16.5L4 18L2.5 16.5L4 15M8 15L9.5 16.5L8 18L6.5 16.5L8 15M12 15L13.5 16.5L12 18L10.5 16.5L12 15M16 15L17.5 16.5L16 18L14.5 16.5L16 15M20 15L21.5 16.5L20 18L18.5 16.5L20 15"/>
  </svg>
);

const TreeIcon = ({ className }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
  </svg>
);

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
  </svg>
);

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMessage('');

    if (password !== confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: email,
          password,
          name,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setSuccessMessage('Registration successful! Redirecting to login...');
        console.log('Registration successful!', data);
        
        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate('/');
        }, 2000);
        
      } else {
        setError(data.error || 'Registration failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="relative w-24 h-24 mx-auto mb-6">
              {/* Farm Logo Container */}
              <div className="absolute inset-0 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl shadow-lg"></div>
              <div className="absolute inset-1 bg-gradient-to-r from-green-600 to-blue-700 rounded-xl flex items-center justify-center">
                <SeedIcon className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-amber-400 to-yellow-400 rounded-full flex items-center justify-center">
                <StarIcon className="w-4 h-4 text-white" />
              </div>
              <div className="absolute -bottom-1 -left-1 w-6 h-6 bg-gradient-to-r from-lime-400 to-green-400 rounded-full flex items-center justify-center">
                <LeafIcon className="w-3 h-3 text-white" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-2 text-gray-800">
              Join CropIQ
            </h1>
            <p className="text-gray-600 text-lg flex items-center justify-center gap-2">
              <SeedIcon className="w-5 h-5 text-green-500" />
              Start your agricultural journey
              <WheatIcon className="w-5 h-5 text-amber-500" />
            </p>
          </div>

          {/* Main Card */}
          <div className="relative">
            {/* Main Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 relative overflow-hidden">
              {/* Card Background Pattern */}
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 left-4"><LeafIcon className="w-8 h-8 text-green-400" /></div>
                <div className="absolute top-8 right-6"><WheatIcon className="w-6 h-6 text-amber-400" /></div>
                <div className="absolute bottom-6 left-8"><SeedIcon className="w-7 h-7 text-lime-400" /></div>
                <div className="absolute bottom-4 right-4"><TreeIcon className="w-5 h-5 text-emerald-400" /></div>
              </div>

              <div className="space-y-6 relative z-10">
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <p className="text-red-600 text-sm flex items-center gap-2">
                      <span className="w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs">!</span>
                      {error}
                    </p>
                  </div>
                )}

                {successMessage && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <p className="text-green-600 text-sm flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">✓</span>
                      {successMessage}
                    </p>
                  </div>
                )}

                {/* Welcome Message */}
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2 flex items-center justify-center gap-2">
                    <SeedIcon className="w-6 h-6 text-green-500" />
                    Create Farm Account
                  </h2>
                  <p className="text-gray-600">Join our agricultural community</p>
                </div>

                {/* Name Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <UserIcon className="w-4 h-4 text-blue-500" />
                    Farmer Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-6 py-4 pl-14 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:bg-white"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-blue-100 rounded-lg">
                      <UserIcon className="w-5 h-5 text-blue-500" />
                    </div>
                  </div>
                </div>

                {/* Email Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <EmailIcon className="w-4 h-4 text-green-500" />
                    Farm Email Address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      className="w-full px-6 py-4 pl-14 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:bg-white"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="farmer@example.com"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-green-100 rounded-lg">
                      <EmailIcon className="w-5 h-5 text-green-500" />
                    </div>
                  </div>
                </div>

                {/* Password Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <LockIcon className="w-4 h-4 text-green-500" />
                    Create Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      className="w-full px-6 py-4 pl-14 pr-14 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 group-hover:bg-white"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a secure password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-green-100 rounded-lg">
                      <LockIcon className="w-5 h-5 text-green-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {showPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field */}
                <div className="group">
                  <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-3">
                    <LockIcon className="w-4 h-4 text-blue-500" />
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      className="w-full px-6 py-4 pl-14 pr-14 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 group-hover:bg-white"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required
                    />
                    <div className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-blue-100 rounded-lg">
                      <LockIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 text-gray-500 hover:text-gray-700 transition-colors duration-200 bg-gray-100 rounded-lg hover:bg-gray-200"
                    >
                      {showConfirmPassword ? <EyeOffIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Register Button */}
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-600 text-white font-bold py-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 shadow-lg hover:shadow-xl"
                >
                  {isLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Creating Farm Account...
                    </>
                  ) : (
                    <>
                      <SeedIcon className="w-5 h-5" />
                      Join Agriculture Community
                      <StarIcon className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              {/* Divider */}
              <div className="flex items-center my-8">
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                <div className="px-4 flex items-center gap-2">
                  <WheatIcon className="w-4 h-4 text-amber-500" />
                  <span className="text-gray-500 text-sm font-medium">Farm Benefits</span>
                  <LeafIcon className="w-4 h-4 text-green-500" />
                </div>
                <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
              </div>

              {/* Benefits Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="flex items-center justify-center gap-2 py-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700">
                  <WheatIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Crop Tracking</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  <SunIcon className="w-4 h-4 text-yellow-500" />
                  <span className="text-xs font-medium">Weather Data</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 bg-blue-50 border border-blue-200 rounded-xl text-blue-700">
                  <TractorIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Equipment</span>
                </div>
                <div className="flex items-center justify-center gap-2 py-3 bg-green-50 border border-green-200 rounded-xl text-green-700">
                  <TreeIcon className="w-4 h-4" />
                  <span className="text-xs font-medium">Analytics</span>
                </div>
              </div>

              {/* Login Link */}
              <div className="text-center">
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                  <p className="text-gray-600 text-sm mb-2 flex items-center justify-center gap-1">
                    <TractorIcon className="w-4 h-4 text-green-500" />
                    Already part of our farm?
                  </p>
                  <button 
                    onClick={() => navigate('/')}
                    className="text-green-600 font-bold hover:text-green-700 transition-all duration-200 flex items-center justify-center gap-1 mx-auto"
                  >
                    <ArrowLeftIcon className="w-3 h-3 text-green-500" />
                    Sign in to Farm Portal
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <p className="text-gray-500 text-sm flex items-center justify-center gap-2">
                <TreeIcon className="w-4 h-4 text-green-500" />
                © 2024 CropIQ. Growing together 🌱
                <WheatIcon className="w-4 h-4 text-amber-500" />
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;