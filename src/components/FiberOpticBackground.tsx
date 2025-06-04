
import React from 'react';

const FiberOpticBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {/* Fibras ópticas principais */}
      <div className="absolute inset-0 opacity-40">
        {/* Fibra 1 - Diagonal */}
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="relative w-full h-full">
            <div className="absolute top-10 left-10 w-96 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent transform rotate-12 animate-pulse"></div>
            <div className="absolute top-12 left-12 w-96 h-0.5 bg-gradient-to-r from-transparent via-blue-400 to-transparent transform rotate-12 opacity-60" style={{animationDelay: '0.5s'}}></div>
          </div>
        </div>

        {/* Fibra 2 - Horizontal */}
        <div className="absolute top-1/3 left-0 w-full h-1 bg-gradient-to-r from-transparent via-purple-400 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/3 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-50" style={{animationDelay: '1.5s'}}></div>

        {/* Fibra 3 - Diagonal inversa */}
        <div className="absolute bottom-20 right-10 w-80 h-1 bg-gradient-to-r from-transparent via-teal-400 to-transparent transform -rotate-12 animate-pulse" style={{animationDelay: '2s'}}></div>

        {/* Fibra 4 - Vertical */}
        <div className="absolute top-0 right-1/4 w-1 h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent animate-pulse" style={{animationDelay: '2.5s'}}></div>

        {/* Pontos de conexão animados - maiores e mais visíveis */}
        <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-ping shadow-lg shadow-cyan-400/50" style={{animationDelay: '0.5s'}}></div>
        <div className="absolute top-2/3 right-1/3 w-4 h-4 bg-blue-400 rounded-full animate-ping shadow-lg shadow-blue-400/50" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/4 left-2/3 w-4 h-4 bg-purple-400 rounded-full animate-ping shadow-lg shadow-purple-400/50" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-1/2 right-1/4 w-4 h-4 bg-indigo-400 rounded-full animate-ping shadow-lg shadow-indigo-400/50" style={{animationDelay: '2s'}}></div>

        {/* Fibras secundárias mais visíveis */}
        <div className="absolute top-1/2 left-1/6 w-64 h-0.5 bg-gradient-to-r from-transparent via-cyan-300 to-transparent transform rotate-45 animate-pulse opacity-60" style={{animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 right-1/6 w-48 h-0.5 bg-gradient-to-r from-transparent via-blue-300 to-transparent transform -rotate-45 animate-pulse opacity-60" style={{animationDelay: '3.5s'}}></div>

        {/* Partículas fluindo - maiores */}
        <div className="absolute top-10 left-20">
          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-ping opacity-80" style={{animationDelay: '0.2s'}}></div>
        </div>
        <div className="absolute top-32 left-40">
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-80" style={{animationDelay: '0.8s'}}></div>
        </div>
        <div className="absolute top-48 left-60">
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-ping opacity-80" style={{animationDelay: '1.4s'}}></div>
        </div>
        <div className="absolute bottom-32 right-40">
          <div className="w-2 h-2 bg-indigo-400 rounded-full animate-ping opacity-80" style={{animationDelay: '2.2s'}}></div>
        </div>
        <div className="absolute bottom-16 right-20">
          <div className="w-2 h-2 bg-teal-400 rounded-full animate-ping opacity-80" style={{animationDelay: '2.8s'}}></div>
        </div>

        {/* Linhas de conexão curvas mais visíveis */}
        <svg className="absolute inset-0 w-full h-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="fiber1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor="#06b6d4"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
            <linearGradient id="fiber2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor="#3b82f6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
            <linearGradient id="fiber3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="transparent"/>
              <stop offset="50%" stopColor="#8b5cf6"/>
              <stop offset="100%" stopColor="transparent"/>
            </linearGradient>
          </defs>
          
          <path 
            d="M50,50 Q200,100 400,50 T700,50" 
            stroke="url(#fiber1)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
            style={{animationDelay: '1s'}}
          />
          
          <path 
            d="M100,200 Q300,150 500,200 T800,200" 
            stroke="url(#fiber2)" 
            strokeWidth="2" 
            fill="none"
            className="animate-pulse"
            style={{animationDelay: '2s'}}
          />

          <path 
            d="M0,300 Q200,250 400,300 T800,300" 
            stroke="url(#fiber3)" 
            strokeWidth="1.5" 
            fill="none"
            className="animate-pulse"
            style={{animationDelay: '3s'}}
          />
        </svg>

        {/* Efeito de brilho adicional */}
        <div className="absolute top-1/4 left-1/2 w-32 h-32 bg-gradient-radial from-cyan-400/20 via-blue-400/10 to-transparent rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-radial from-purple-400/20 via-indigo-400/10 to-transparent rounded-full animate-pulse" style={{animationDelay: '2.5s'}}></div>
      </div>
    </div>
  );
};

export default FiberOpticBackground;
