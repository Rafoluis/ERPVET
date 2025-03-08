import { cn } from "@/lib/classNames";
import { Loader2 } from "lucide-react";

interface ButtonProps {
  children: React.ReactNode;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
  onClick?: () => void;
}

interface ButtonIconProps {
  children: React.ReactNode;
}

const Button = ({ children, loading, disabled, type = "button", className, onClick }: ButtonProps) => {
  return (
    <button
      className={cn(
        "w-full relative flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 text-white rounded-lg font-semibold shadow-md transition-all hover:bg-red-600 focus:ring-red-500 disabled:opacity-50 text-sm md:text-base lg:text-md",
        { "opacity-75": loading },
        className
      )}
      onClick={onClick}
      disabled={disabled || loading}
      type={type}
    >
      {loading && (
        <Loader2 className="animate-spin w-5 h-5 md:w-6 md:h-6" />
      )}
      <span className="flex items-center justify-center">
        {children}
      </span>
    </button>
  );
};

const ButtonIcon = ({ children }: ButtonIconProps) => {
  return <span className="flex items-center justify-center">{children}</span>;
};

Button.Icon = ButtonIcon;

export default Button;