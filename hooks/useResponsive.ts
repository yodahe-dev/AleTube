import { useState, useEffect } from "react";

export function useResponsive() {
  const [width, setWidth] = useState<number>(typeof window !== "undefined" ? window.innerWidth : 0);
  const [isMobile, setIsMobile] = useState<boolean>(width < 768);
  const [isTablet, setIsTablet] = useState<boolean>(width >= 768 && width < 1024);
  const [isDesktop, setIsDesktop] = useState<boolean>(width >= 1024);

  useEffect(() => {
    function onResize() {
      setWidth(window.innerWidth);
      setIsMobile(window.innerWidth < 768);
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
      setIsDesktop(window.innerWidth >= 1024);
    }

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return { width, isMobile, isTablet, isDesktop };
}
