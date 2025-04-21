// components/Loader.tsx
"use client";

import { Loader2 } from "lucide-react";

interface LoaderProps {
  size?: number;
  className?: string;
  message?: string;
}

const Loader: React.FC<LoaderProps> = ({ size = 24, className, message }) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <Loader2 className={`h-${size} w-${size} animate-spin text-green-700`} />
      {message && <p className="mt-2 text-sm text-muted-foreground">{message}</p>}
    </div>
  );
};

export default Loader;