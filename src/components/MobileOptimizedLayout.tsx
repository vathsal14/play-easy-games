
import { ReactNode } from 'react';

interface MobileOptimizedLayoutProps {
  children: ReactNode;
  className?: string;
}

const MobileOptimizedLayout = ({ children, className = '' }: MobileOptimizedLayoutProps) => {
  return (
    <div className={`
      min-h-screen 
      overflow-x-hidden 
      scroll-smooth
      ${className}
    `}>
      <div className="
        w-full 
        max-w-full 
        px-4 sm:px-6 lg:px-8
        mx-auto
        space-y-8 md:space-y-16
      ">
        {children}
      </div>
    </div>
  );
};

export default MobileOptimizedLayout;
