interface PwCLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PwCLogo({ className = "", size = 'md' }: PwCLogoProps) {
  const sizeClasses = {
    sm: 'h-8 w-20',
    md: 'h-10 w-24',
    lg: 'h-12 w-28'
  };

  return (
    <svg 
      className={`${sizeClasses[size]} ${className}`}
      viewBox="0 0 120 48" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* PwC Text */}
      <text 
        x="0" 
        y="32" 
        fontFamily="Arial, sans-serif" 
        fontSize="24" 
        fontWeight="bold" 
        fill="#000000"
      >
        PwC
      </text>
      
      {/* Orange Momentum Mark */}
      <g transform="translate(80, 8)">
        <path 
          d="M0 16 L16 0 L32 8 L24 24 L8 32 Z" 
          fill="#E88D14"
        />
        <path 
          d="M4 20 L20 4 L28 12 L20 28 Z" 
          fill="#D85604"
        />
      </g>
    </svg>
  );
}