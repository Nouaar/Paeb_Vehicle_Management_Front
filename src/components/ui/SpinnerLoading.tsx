"use client" ;

interface SpinnerLoadingProps {
    size ?: "sm" | "md" | "lg" ; 
    className ?: string ;
}


export const SpinnerLoading: React.FC<SpinnerLoadingProps> = ({ size = "md", className = "" }) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-6 w-6",
    lg: "h-8 w-8",
  };

  return (
    <span className="loader"></span>
  );
}