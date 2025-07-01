import pwcLogoPath from "@assets/New-PwC-logo_1751352899720.webp";

interface PwCLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PwCLogo({ className = "", size = 'md' }: PwCLogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  return (
    <img 
      src={pwcLogoPath}
      alt="PwC Logo"
      className={`${sizeClasses[size]} w-auto ${className}`}
    />
  );
}