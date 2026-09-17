import React, { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  containerClassName = '',
  id,
  ...props
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`flex flex-col space-y-1.5 ${containerClassName}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-primary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary pointer-events-none">
            <Icon size={16} />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={inputType}
          className={`flex h-11 w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-primary placeholder:text-secondary/50 focus:outline-none focus:ring-1 focus:ring-accent focus:border-accent disabled:cursor-not-allowed disabled:opacity-50 transition-colors ${
            Icon ? 'pl-10' : ''
          } ${isPassword ? 'pr-10' : ''} ${error ? 'border-danger focus:ring-danger focus:border-danger' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary focus:outline-none focus:text-primary transition-colors"
            onClick={() => setShowPassword(!showPassword)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error && (
        <span id={`${inputId}-error`} className="text-xs text-danger mt-1 font-medium">{error}</span>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
