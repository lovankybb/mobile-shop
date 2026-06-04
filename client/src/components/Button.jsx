import React from 'react';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-mono transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.3)] hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]",
    secondary: "bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600",
    outline: "bg-transparent hover:bg-gray-800 text-blue-400 border border-blue-500 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)]",
    danger: "bg-red-900/50 hover:bg-red-800/80 text-red-200 border border-red-700 hover:shadow-[0_0_10px_rgba(220,38,38,0.4)]"
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
