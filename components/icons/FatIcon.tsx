import React from 'react';

export const FatIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m12 2-3.1 3.1c-.9.9-1.2 2.2-.9 3.4l2.4 7.4c.3 1 1.2 1.6 2.3 1.6s2-.6 2.3-1.6l2.4-7.4c.3-1.2 0-2.5-.9-3.4L12 2Z" />
    <path d="m12 14 3.4 3.4c.9.9.9 2.4 0 3.3l-2.1 2.1c-.9.9-2.4.9-3.3 0L8 20.8" />
  </svg>
);