import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Mail, Lock, User, MapPin, Briefcase, Eye, EyeOff, Check, AlertCircle, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface EmailSignupProps {
  onSwitchToSignin: () => void;
  onSwitchToOAuth: () => void;
}

const COUNTRY_OPTIONS = [
  'United States', 'Canada', 'United Kingdom', 'Germany', 'France', 'Japan', 'Australia', 'Singapore', 'Netherlands', 'Switzerland'
];

const ROLE_OPTIONS = [
  'Developer', 'Investor', 'Data Provider', 'Regulator', 'Trader', 'Analyst', 'Student', 'Other'
];

export default function EmailSignup({ onSwitchToSignin, onSwitchToOAuth }: EmailSignupProps) {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    password: '',
    confirmPassword: '',
    country: '',
    role: ''
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Email verification states
  const [emailVerificationStep, setEmailVerificationStep] = useState<'none' | 'checking' | 'verified' | 'sending' | 'sent' | 'verifying'>('none');
  const [verificationCode, setVerificationCode] = useState('');
  const [isEmailAvailable, setIsEmailAvailable] = useState(false);
  
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkEmailAvailability = async (email: string) => {
    if (!validateEmail(email)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return;
    }

    setEmailVerificationStep('checking');
    setErrors(prev => ({ ...prev, email: '' }));

    try {
      const response = await fetch('/api/auth/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      
      if (data.exists) {
        setErrors(prev => ({ ...prev, email: 'This email is already registered. Please use a different email or sign in.' }));
        setEmailVerificationStep('none');
        setIsEmailAvailable(false);
      } else {
        setEmailVerificationStep('verified');
        setIsEmailAvailable(true);
        setErrors(prev => ({ ...prev, email: '' }));
      }
    } catch (error) {
      console.error('Email check error:', error);
      setErrors(prev => ({ ...prev, email: 'Unable to verify email availability. Please try again.' }));
      setEmailVerificationStep('none');
    }
  };

  const sendVerificationCode = async () => {
    setEmailVerificationStep('sending');
    
    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        setEmailVerificationStep('sent');
        toast({
          title: "Verification Code Sent",
          description: `We've sent a 6-digit code to ${formData.email}. For demo: ${data.verificationCode}`,
        });
      } else {
        setErrors(prev => ({ ...prev, general: 'Failed to send verification email. Please try again.' }));
        setEmailVerificationStep('verified');
      }
    } catch (error) {
      console.error('Verification send error:', error);
      setErrors(prev => ({ ...prev, general: 'Failed to send verification email. Please try again.' }));
      setEmailVerificationStep('verified');
    }
  };

  const verifyEmailCode = async (code: string) => {
    if (code.length !== 6) {
      setErrors(prev => ({ ...prev, verification: 'Please enter a valid 6-digit code' }));
      return false;
    }

    setEmailVerificationStep('verifying');
    
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          code: code
        }),
      });

      if (response.ok) {
        setErrors(prev => ({ ...prev, verification: '' }));
        return true;
      } else {
        const data = await response.json();
        setErrors(prev => ({ ...prev, verification: data.message }));
        setEmailVerificationStep('sent');
        return false;
      }
    } catch (error) {
      console.error('Verification error:', error);
      setErrors(prev => ({ ...prev, verification: 'Verification failed. Please try again.' }));
      setEmailVerificationStep('sent');
      return false;
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    } else if (!isEmailAvailable) {
      newErrors.email = 'Please verify email availability first';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = 'First name must be at least 2 characters';
    } else if (formData.firstName.includes('@')) {
      newErrors.firstName = 'Please enter a valid first name (no email addresses)';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.firstName.trim())) {
      newErrors.firstName = 'First name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = 'Last name must be at least 2 characters';
    } else if (formData.lastName.includes('@')) {
      newErrors.lastName = 'Please enter a valid last name (no email addresses)';
    } else if (!/^[a-zA-Z\s\-']+$/.test(formData.lastName.trim())) {
      newErrors.lastName = 'Last name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (!formData.country) {
      newErrors.country = 'Please select your country';
    }

    if (!formData.role) {
      newErrors.role = 'Please select your role';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    // Send verification code if not sent yet
    if (emailVerificationStep === 'verified') {
      await sendVerificationCode();
      return;
    }

    // Verify code if entered
    if (emailVerificationStep === 'sent' && verificationCode) {
      const isVerified = await verifyEmailCode(verificationCode);
      if (!isVerified) return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await apiRequest('POST', '/api/auth/email/signup', {
        email: formData.email.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        password: formData.password,
        country: formData.country,
        role: formData.role
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Account Created Successfully!",
          description: "Welcome to GeFi! You're now signed in.",
        });
        
        // Redirect to dashboard
        window.location.href = '/';
      } else {
        const errorData = await response.json();
        setErrors({ general: errorData.message || 'Account creation failed. Please try again.' });
      }
    } catch (error) {
      console.error('Signup error:', error);
      setErrors({ general: 'An unexpected error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Create Your GeFi Account
            </CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-300">
              Join the future of AI-powered finance
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Field with Verification */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => updateFormData('email', e.target.value)}
                    onBlur={() => formData.email && checkEmailAvailability(formData.email)}
                    className={`pl-10 pr-10 ${
                      errors.email ? 'border-red-500' : 
                      emailVerificationStep === 'verified' ? 'border-green-500' : ''
                    }`}
                    disabled={emailVerificationStep === 'checking'}
                  />
                  {emailVerificationStep === 'checking' && (
                    <div className="absolute right-3 top-3 h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  )}
                  {emailVerificationStep === 'verified' && (
                    <Check className="absolute right-3 top-3 h-4 w-4 text-green-500" />
                  )}
                  {errors.email && (
                    <AlertCircle className="absolute right-3 top-3 h-4 w-4 text-red-500" />
                  )}
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-gray-700 dark:text-gray-200">First Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="firstName"
                      type="text"
                      placeholder="First name"
                      value={formData.firstName}
                      onChange={(e) => updateFormData('firstName', e.target.value)}
                      className={`pl-10 ${errors.firstName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-sm text-red-500">{errors.firstName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-gray-700 dark:text-gray-200">Last Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Last name"
                      value={formData.lastName}
                      onChange={(e) => updateFormData('lastName', e.target.value)}
                      className={`pl-10 ${errors.lastName ? 'border-red-500' : ''}`}
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-sm text-red-500">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Password Fields */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={(e) => updateFormData('password', e.target.value)}
                    className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-gray-700 dark:text-gray-200">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={(e) => updateFormData('confirmPassword', e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </Button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-500">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Country and Role Fields */}
              <div className="space-y-2">
                <Label htmlFor="country" className="text-gray-700 dark:text-gray-200">Country</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select onValueChange={(value) => updateFormData('country', value)}>
                    <SelectTrigger className={`pl-10 ${errors.country ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your country" />
                    </SelectTrigger>
                    <SelectContent>
                      {COUNTRY_OPTIONS.map((country) => (
                        <SelectItem key={country} value={country}>
                          {country}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.country && (
                  <p className="text-sm text-red-500">{errors.country}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role" className="text-gray-700 dark:text-gray-200">Role</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400 z-10" />
                  <Select onValueChange={(value) => updateFormData('role', value)}>
                    <SelectTrigger className={`pl-10 ${errors.role ? 'border-red-500' : ''}`}>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      {ROLE_OPTIONS.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {errors.role && (
                  <p className="text-sm text-red-500">{errors.role}</p>
                )}
              </div>

              {/* Email Verification Code */}
              {emailVerificationStep === 'sent' && (
                <div className="space-y-2">
                  <Label htmlFor="verificationCode" className="text-gray-700 dark:text-gray-200">
                    Verification Code
                  </Label>
                  <div className="flex space-x-2">
                    <Input
                      id="verificationCode"
                      type="text"
                      placeholder="000000"
                      value={verificationCode}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationCode(value);
                        if (errors.verification) {
                          setErrors(prev => ({ ...prev, verification: '' }));
                        }
                      }}
                      className={`text-center text-lg font-mono tracking-widest ${errors.verification ? 'border-red-500' : ''}`}
                      maxLength={6}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={sendVerificationCode}
                      disabled={emailVerificationStep === 'sending'}
                      className="whitespace-nowrap"
                    >
                      Resend
                    </Button>
                  </div>
                  {errors.verification && (
                    <p className="text-sm text-red-500">{errors.verification}</p>
                  )}
                  <p className="text-sm text-gray-500">
                    Enter the 6-digit code sent to your email
                  </p>
                </div>
              )}

              {/* General Error */}
              {errors.general && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    {errors.general}
                  </p>
                </div>
              )}

              <Button
                type="submit"
                disabled={isLoading || emailVerificationStep === 'checking' || emailVerificationStep === 'sending' || emailVerificationStep === 'verifying'}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-3"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Creating Account...
                  </div>
                ) : emailVerificationStep === 'verified' ? (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Send Verification Code
                  </div>
                ) : emailVerificationStep === 'sent' ? (
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4" />
                    Verify & Create Account
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4" />
                    Create Account
                  </div>
                )}
              </Button>
            </form>

            <div className="text-center space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white dark:bg-gray-800 px-2 text-gray-500">Or continue with</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                onClick={onSwitchToOAuth}
                className="w-full border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Social Media Sign Up
              </Button>

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={onSwitchToSignin}
                  className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
                >
                  Sign in here
                </button>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}