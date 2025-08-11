import React, { ButtonHTMLAttributes } from "react";
import classNames from "classnames"; // Si tu veux styliser selon le variant

// On étend les props natives des boutons HTML + on ajoute notre prop 'variant'
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"; // types autorisés
}

const Button: React.FC<ButtonProps> = ({ variant = "default", className, children, ...props }) => {
  const variantClass =
    variant === "outline"
      ? "border border-gray-500 text-gray-700 bg-white"
      : "bg-blue-600 text-white";

  return (
    <button
      className={classNames("px-4 py-2 rounded", variantClass, className)}
      {...props}
    >
      {children}
    </button>
  );
};

export { Button };
