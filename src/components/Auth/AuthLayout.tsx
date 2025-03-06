import React, { ReactNode } from 'react';
import AuthBackground from './AuthBackground';
import Star from '../../assets/bigStar.svg';
import './auth.css';

interface AuthLayoutProps {
  children: ReactNode;
  title?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title = 'Games FM' }) => {
  const bigStars = [
    <img src={Star} key={1} alt="Star" className="w-8 h-8" />,
    <img src={Star} key={2} alt="Star" className="w-8 h-8" />,
    <img src={Star} key={3} alt="Star" className="w-8 h-8" />,
  ];

  return (
    <div className="auth-page">
      <AuthBackground />
      
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">{title}</h1>
          <div className="flex justify-center gap-2">{bigStars}</div>
        </div>
        
        {children}
      </div>
    </div>
  );
};

export default AuthLayout; 