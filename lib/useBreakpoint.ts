import { useEffect, useState } from "react";

export function useBreakpoint(): "mobile" | "tablet" | "desktop" {
  const [breakpoint, setBreakpoint] = useState<"mobile" | "tablet" | "desktop">("mobile");

  useEffect(() => {
    const checkWidth = () => {
      const width = window.innerWidth;
      if (width < 640) setBreakpoint("mobile");
      else if (width < 1024) setBreakpoint("tablet");
      else setBreakpoint("desktop");
    };

    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);

  return breakpoint;
}
