import '../App.css';

import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  onClick?: () => void;
  icon?: LucideIcon;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'secondary',
  onClick,
  icon: Icon,
  className = ''
}) => {
  // Common styles applied to all buttons (flexbox layout, padding, rounded corners, etc.)
  const baseClasses = 'flex items-center gap-2 px-4 py-2 font-medium rounded-lg transition-colors';

  // Different color schemes based on the variant prop
  const variantClasses = {
    primary: 'bg-blue-600 text-white',
    secondary: 'text-gray-600 hover:text-blue-600 hover:bg-blue-50 cursor-pointer'
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {Icon && <Icon size={16} />} {/* Conditional rendering: only shows the icon if one is provided */}
      {children} {/* The children content inside the button */}
    </button>
  );
};

export default Button;