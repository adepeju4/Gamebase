import React, { useEffect, useState } from 'react';
import ShootingStars from './ShootingStars';
import './auth.css';

const AuthBackground: React.FC = () => {
  const [stars, setStars] = useState<React.ReactNode[]>([]);

  useEffect(() => {
    // Generate random stars
    const generatedStars = Array.from({ length: 100 }).map((_, i) => {
      const size = Math.random() * 3 + 1;
      return (
        <div
          key={i}
          className="star"
          style={{
            width: `${size}px`,
            height: `${size}px`,
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            opacity: Math.random() * 0.8 + 0.2,
            animationDelay: `${Math.random() * 5}s`,
            animationDuration: `${Math.random() * 5 + 3}s`,
          }}
        />
      );
    });

    setStars(generatedStars);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-blue-900"></div>

      {/* Glowing orbs */}
      <div className="bg-glow bg-glow-1"></div>
      <div className="bg-glow bg-glow-2"></div>

      {/* Floating shapes with enhanced visibility */}
      <div
        className="absolute z-0"
        style={{
          width: '8rem',
          height: '8rem',
          backgroundColor: '#3b82f6',
          borderRadius: '0.75rem',
          top: '25%',
          left: '25%',
          opacity: 0.6,
          boxShadow: '0 0 30px rgba(59, 130, 246, 0.5)',
          animation: 'float-slow 8s ease-in-out infinite',
        }}
      ></div>

      <div
        className="absolute z-0"
        style={{
          width: '6rem',
          height: '6rem',
          backgroundColor: '#8b5cf6',
          borderRadius: '9999px',
          top: '66%',
          right: '25%',
          opacity: 0.6,
          boxShadow: '0 0 30px rgba(139, 92, 246, 0.5)',
          animation: 'float-medium 6s ease-in-out infinite',
        }}
      ></div>

      <div
        className="absolute z-0"
        style={{
          width: '5rem',
          height: '5rem',
          backgroundColor: '#6366f1',
          borderRadius: '0.75rem',
          bottom: '25%',
          left: '33%',
          opacity: 0.6,
          boxShadow: '0 0 30px rgba(99, 102, 241, 0.5)',
          animation: 'float-fast 4s ease-in-out infinite',
        }}
      ></div>

      <div
        className="absolute z-0"
        style={{
          width: '4rem',
          height: '4rem',
          backgroundColor: '#a855f7',
          borderRadius: '0.75rem',
          top: '33%',
          right: '33%',
          opacity: 0.6,
          boxShadow: '0 0 30px rgba(168, 85, 247, 0.5)',
          animation: 'float-medium 6s ease-in-out infinite',
        }}
      ></div>

      <div
        className="absolute z-0"
        style={{
          width: '7rem',
          height: '7rem',
          backgroundColor: '#2563eb',
          borderRadius: '9999px',
          bottom: '33%',
          right: '25%',
          opacity: 0.6,
          boxShadow: '0 0 30px rgba(37, 99, 235, 0.5)',
          animation: 'float-slow 8s ease-in-out infinite',
        }}
      ></div>

      {/* Triangle shape */}
      <div
        className="absolute z-0"
        style={{
          width: 0,
          height: 0,
          borderLeft: '40px solid transparent',
          borderRight: '40px solid transparent',
          borderBottom: '80px solid rgba(244, 114, 182, 0.6)',
          top: '15%',
          right: '15%',
          filter: 'drop-shadow(0 0 20px rgba(244, 114, 182, 0.5))',
          animation: 'float-medium 7s ease-in-out infinite',
        }}
      ></div>

      {/* Stars */}
      {stars}

      {/* Shooting stars */}
      <ShootingStars />
    </div>
  );
};

export default AuthBackground;
