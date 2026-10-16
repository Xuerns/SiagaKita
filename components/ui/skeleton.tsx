import React from "react";
import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-[10px] bg-[#E6EBE8]/80", className)}
      {...props}
    />
  );
}

export { Skeleton };
