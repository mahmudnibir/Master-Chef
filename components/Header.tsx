
import React from 'react';
import { ChefHatIcon } from './icons/ChefHatIcon';

const Header: React.FC = () => {
  return (
    <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-10 border-b border-stone-200">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center space-x-3">
          <ChefHatIcon className="h-8 w-8 text-emerald-600" />
          <h1 className="text-3xl font-bold tracking-tight text-stone-800">
            Pantry Chef <span className="text-emerald-600">AI</span>
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
