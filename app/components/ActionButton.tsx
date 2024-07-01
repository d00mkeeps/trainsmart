import Link from "next/link";
import { ReactNode, MouseEvent } from "react";

interface ActionButtonProps {
  href: string;
  label: string;
  icon?: ReactNode;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({
  href,
  label,
  icon,
  variant = "primary",
  className = "",
  onClick,
}) => {
  const baseClasses =
    "inline-flex items-center px-3 py-2 text-sm font-medium text-white rounded transition-colors";
  const variantClasses = {
    primary: "bg-blue-500 hover:bg-blue-600",
    secondary: "bg-gray-500 hover:bg-gray-600",
    danger: "bg-red-500 hover:bg-red-600",
  };
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (onClick) {
      e.preventDefault();
      onClick(e);
    }
  };

  return (
    <Link
      href={href}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={handleClick}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {label}
    </Link>
  );
};
export default ActionButton;
