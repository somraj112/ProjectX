import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon: Icon,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-xl';
  
  const variants = {
    primary: 'bg-[#FF4D4D] text-white hover:bg-[#E63E3E] hover:shadow-lg hover:shadow-red-200 focus:ring-[#FF4D4D]',
    secondary: 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 focus:ring-gray-200',
    ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 focus:ring-gray-200',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-base',
    lg: 'px-6 py-3.5 text-lg',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
      ) : Icon ? (
        <Icon className="-ml-1 mr-2 h-4 w-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
