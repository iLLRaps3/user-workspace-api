
import { cn } from "@/lib/utils";

interface EnhancedSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "evil" | "matrix";
  className?: string;
}

export function EnhancedSpinner({ 
  size = "md", 
  variant = "default", 
  className 
}: EnhancedSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8", 
    lg: "w-12 h-12",
    xl: "w-16 h-16"
  };

  if (variant === "evil") {
    return (
      <div className={cn("relative", sizeClasses[size], className)}>
        <div className="absolute inset-0 rounded-full border-2 border-primary/30"></div>
        <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary animate-spin"></div>
        <div className="absolute inset-1 rounded-full border border-secondary/50 animate-pulse"></div>
        <div className="absolute inset-2 rounded-full bg-gradient-to-r from-primary to-secondary opacity-20 animate-ping"></div>
      </div>
    );
  }

  if (variant === "matrix") {
    return (
      <div className={cn("flex space-x-1", className)}>
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "bg-accent rounded-full animate-pulse",
              size === "sm" ? "w-1 h-4" : size === "md" ? "w-2 h-6" : "w-3 h-8"
            )}
            style={{
              animationDelay: `${i * 0.2}s`,
              animationDuration: "1s"
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className={cn(
      "animate-spin rounded-full border-4 border-primary border-t-transparent evil-pulse",
      sizeClasses[size],
      className
    )} />
  );
}
