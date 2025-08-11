import React, { InputHTMLAttributes } from "react";

// On étend toutes les props HTML d'un input standard (y compris readOnly, disabled, etc.)
type InputProps = InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`border p-2 rounded w-full ${className}`}
        {...props}
      />
    );
  }
);

export { Input };
