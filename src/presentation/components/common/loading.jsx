import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from "@/lib/utils";

// Size presets
const SIZES = {
  xs: "h-3 w-3",
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
  xl: "h-10 w-10",
  "2xl": "h-12 w-12"
};

// Color variants
const COLORS = {
  primary: "text-primary-500", 
  violet: "text-violet-500",
  purple: "text-purple-500",
  white: "text-white",
  gray: "text-neutral-400"
};

// Container styles
const CONTAINERS = {
  fullscreen: "fixed inset-0 bg-[#0D0D0D]/80 backdrop-blur-sm z-50",
  page: "min-h-screen bg-[#0D0D0D] flex items-center justify-center",
  contained: "w-full h-full bg-neutral-900/50 backdrop-blur-sm rounded-lg",
  inline: "",
};

/**
 * Base loader component with customizable size, color, and animation
 */
export const Loader = React.memo(({ 
  size = "md", 
  variant = "violet", 
  container = "inline",
  animation = "spin", 
  text,
  textSize = "text-sm",
  center = false,
  className
}) => {
  // Handle custom size string (like "h-4 w-4")
  const sizeClass = size in SIZES ? SIZES[size] : size;
  
  const loaderClasses = cn(
    animation === "spin" ? "animate-spin" : "animate-pulse",
    sizeClass,
    COLORS[variant] || COLORS.violet
  );

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    CONTAINERS[container] || CONTAINERS.inline,
    center && "m-auto",
    className
  );

  return (
    <div className={containerClasses}>
      <Loader2 className={loaderClasses} />
      {text && (
        <p className={cn("text-center", textSize, COLORS[variant])}>
          {text}
        </p>
      )}
    </div>
  );
});

Loader.displayName = 'Loader';

/**
 * Animated bouncing dots loader
 */
export const PulseLoader = React.memo(({ 
  variant = "violet", 
  container = "inline",
  size = "md",
  text,
  className
}) => {
  const dotSize = {
    xs: "h-1 w-1",
    sm: "h-2 w-2",
    md: "h-3 w-3",
    lg: "h-4 w-4",
  };
  
  const dotClass = cn(
    "rounded-full",
    dotSize[size] || dotSize.md,
    COLORS[variant] || COLORS.violet
  );

  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    CONTAINERS[container] || CONTAINERS.inline,
    className
  );

  return (
    <div className={containerClasses}>
      <div className="flex space-x-2">
        <div className={cn(dotClass, "animate-bounce")} style={{ animationDelay: "0ms" }}></div>
        <div className={cn(dotClass, "animate-bounce")} style={{ animationDelay: "150ms" }}></div>
        <div className={cn(dotClass, "animate-bounce")} style={{ animationDelay: "300ms" }}></div>
      </div>
      {text && <p className={cn("text-center text-sm", COLORS[variant])}>{text}</p>}
    </div>
  );
});

PulseLoader.displayName = 'PulseLoader';

/**
 * Fancy loader with multiple animated elements and gradient effects
 */
export const GlowingLoader = React.memo(({
  container = "inline",
  size = "lg",
  text,
  className
}) => {
  const containerClasses = cn(
    "flex flex-col items-center justify-center gap-3",
    CONTAINERS[container] || CONTAINERS.inline,
    className
  );
  
  const sizeMap = {
    sm: { outer: "h-8 w-8", inner: "h-4 w-4" },
    md: { outer: "h-12 w-12", inner: "h-6 w-6" },
    lg: { outer: "h-16 w-16", inner: "h-8 w-8" },
    xl: { outer: "h-24 w-24", inner: "h-12 w-12" },
  };
  
  const { outer, inner } = sizeMap[size] || sizeMap.lg;
  
  return (
    <div className={containerClasses}>
      <div className={cn("relative flex items-center justify-center", outer)}>
        {/* Outer spinning ring */}
        <div className="absolute inset-0 rounded-full border-t-2 border-b-2 border-violet-500/30 animate-spin"></div>
        
        {/* Inner spinning ring (opposite direction) */}
        <div className="absolute inset-0 rounded-full border-r-2 border-l-2 border-purple-500/40 animate-spin" 
             style={{ animationDirection: "reverse", animationDuration: "1s" }}></div>
        
        {/* Glowing center */}
        <div className={cn("rounded-full bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse", inner)}></div>
      </div>
      
      {text && (
        <p className="text-center text-sm bg-gradient-to-r from-violet-400 to-purple-500 text-transparent bg-clip-text font-medium">
          {text}
        </p>
      )}
    </div>
  );
});

GlowingLoader.displayName = 'GlowingLoader';

/**
 * Full-page loader for initial page loading
 */
export const PageLoader = ({ text = "Loading...", ...props }) => (
  <Loader 
    container="page" 
    size="lg" 
    text={text} 
    variant="violet"
    {...props} 
  />
);

/**
 * Overlay loader that blocks the entire UI
 */
export const FullscreenLoader = ({ text = "Loading...", ...props }) => (
  <Loader 
    container="fullscreen" 
    size="lg" 
    text={text} 
    variant="violet"
    {...props} 
  />
);

/**
 * Small loader for use inside buttons
 */
export const ButtonLoader = ({ className, ...props }) => (
  <Loader 
    size="sm" 
    variant="white" 
    className={cn("mr-2", className)} 
    {...props} 
  />
);

/**
 * Inline loader for use within text or other content
 */
export const InlineLoader = ({ size = "sm", className, ...props }) => (
  <Loader 
    size={size} 
    variant="violet"
    className={cn("inline-flex", className)} 
    {...props} 
  />
);