import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  readonly?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function StarRating({ 
  rating, 
  onRatingChange, 
  readonly = false, 
  size = "sm",
  className 
}: StarRatingProps) {
  const [hoveredRating, setHoveredRating] = useState(0);

  const handleStarClick = (star: number) => {
    if (!readonly && onRatingChange) {
      onRatingChange(star);
    }
  };

  const handleStarHover = (star: number) => {
    if (!readonly) {
      setHoveredRating(star);
    }
  };

  const handleMouseLeave = () => {
    if (!readonly) {
      setHoveredRating(0);
    }
  };

  const sizeClasses = {
    sm: "h-3 w-3",
    md: "h-4 w-4", 
    lg: "h-5 w-5"
  };

  return (
    <div 
      className={cn("flex items-center gap-0.5", className)}
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((star) => {
        const isActive = star <= (hoveredRating || rating);
        return (
          <button
            key={star}
            type="button"
            onClick={() => handleStarClick(star)}
            onMouseEnter={() => handleStarHover(star)}
            disabled={readonly}
            className={cn(
              "transition-colors duration-150",
              !readonly && "hover:scale-110 cursor-pointer",
              readonly && "cursor-default"
            )}
          >
            <Star
              className={cn(
                sizeClasses[size],
                isActive 
                  ? "fill-yellow-400 text-yellow-400" 
                  : "fill-gray-200 text-gray-300"
              )}
            />
          </button>
        );
      })}
      {!readonly && (
        <span className="ml-1 text-xs text-gray-500">
          {hoveredRating || rating}/5
        </span>
      )}
    </div>
  );
}