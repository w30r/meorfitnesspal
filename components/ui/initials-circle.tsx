import React from "react";
import { cn } from "@/lib/utils";

interface InitialsCircleProps {
  initials: string;
  className?: string;
}

const InitialsCircle: React.FC<InitialsCircleProps> = ({
  initials,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full w-8 h-8 bg-primary text-black font-bold",
        className,
      )}
    >
      {initials}
    </div>
  );
};

export default InitialsCircle;
