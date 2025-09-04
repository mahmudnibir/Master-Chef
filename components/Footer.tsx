
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="py-6 text-center">
      <p className="text-sm text-stone-500">
        &copy; {new Date().getFullYear()} Pantry Chef AI. All recipes are AI-generated.
      </p>
    </footer>
  );
};

export default Footer;
