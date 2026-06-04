import React from 'react';

const Input = React.forwardRef(({ label, error, className = '', ...props }, ref) => {
  return (
    <div className="flex flex-col w-full">
      {label && (
        <label className="mb-1.5 text-sm font-mono text-gray-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        className={`bg-gray-900 border ${error ? 'border-red-500' : 'border-gray-700'} text-gray-100 font-mono text-sm px-4 py-2.5 outline-none focus:border-blue-500 focus:shadow-[0_0_8px_rgba(59,130,246,0.3)] transition-all duration-200 ${className}`}
        {...props}
      />
      {error && (
        <span className="mt-1 text-xs font-mono text-red-400">
          {error}
        </span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
