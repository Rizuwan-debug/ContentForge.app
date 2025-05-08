
"use client";

import { useState } from 'react';
import { SignInForm } from './SignInForm';
import { SignUpForm } from './SignUpForm';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function AuthFormWrapper() {
  const [isSigningUp, setIsSigningUp] = useState(false);

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{isSigningUp ? 'Create an Account' : 'Welcome Back!'}</CardTitle>
        <CardDescription>
          {isSigningUp ? 'Enter your details to get started.' : 'Sign in to continue to ContentForge.'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isSigningUp ? <SignUpForm /> : <SignInForm />}
        <div className="mt-6 text-center">
          <Button variant="link" onClick={() => setIsSigningUp(!isSigningUp)}>
            {isSigningUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
