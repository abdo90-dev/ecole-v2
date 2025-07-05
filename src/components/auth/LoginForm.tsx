import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { LogIn, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn: login } = useAuth();
  const navigate = useNavigate();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);

  try {
    await login(email, password);
    toast.success('Connexion réussie!');
    navigate('/dashboard');
  } catch (error: any) {
    console.error('Login error:', error);

    // ... your existing error handling code
    toast.error("Erreur de Connexion");
  } finally {
    setLoading(false);
  }
};


  // Quick login function for demo accounts
  const handleDemoLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);
    
    try {
      await login(demoEmail, demoPassword);
      toast.success('Connexion réussie!');
    } catch (error) {
      toast.error('Compte de démonstration non disponible.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <GraduationCap className="w-12 h-12 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">StudyFlow</CardTitle>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="votre@email.com"
            />
            
            <Input
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Votre mot de passe"
            />
            
            <Button
              type="submit"
              className="w-full"
              loading={loading}
              icon={LogIn}
            >
              Se connecter
            </Button>
          </form>

        </CardContent>
      </Card>
    </div>
  );
};