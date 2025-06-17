"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  motion, 
  AnimatePresence, 
  useAnimation, 
  useScroll, 
  useMotionValueEvent,
  useTransform 
} from "framer-motion";
import { 
  FaPodcast, 
  FaBars, 
  FaTimes, 
  FaYoutube,
  FaCircle 
} from "react-icons/fa";
import { BsSunFill, BsMoonFill } from "react-icons/bs";
import { ThemeProvider, useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { 
  Popover, 
  PopoverContent, 
  PopoverTrigger 
} from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// YouTube API Constants
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = 'UCJD-UtyBgYWqvmp_lknn7Lg';

// Custom hooks
function useWindowSize() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    function updateSize() {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    }
    
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  
  return size;
}

function useHoverIntent<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T>, 
  delay = 300
) {
  const [isHovering, setIsHovering] = useState(false);
  let timeoutId: NodeJS.Timeout;

  const handleMouseEnter = () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => setIsHovering(true), delay);
  };

  const handleMouseLeave = () => {
    clearTimeout(timeoutId);
    setIsHovering(false);
  };

  useEffect(() => {
    const element = ref.current;
    if (element) {
      element.addEventListener("mouseenter", handleMouseEnter);
      element.addEventListener("mouseleave", handleMouseLeave);
      return () => {
        element.removeEventListener("mouseenter", handleMouseEnter);
        element.removeEventListener("mouseleave", handleMouseLeave);
      };
    }
  }, [ref]);

  return isHovering;
}

// Custom components
const ThemeToggle = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted) return (
    <Skeleton className="w-9 h-9 rounded-full bg-[#192937] dark:bg-[#EAA632]/20" />
  );

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="p-2 rounded-full bg-[#192937] dark:bg-[#EAA632]/10 text-[#EAA632] dark:text-[#EAA632] focus:outline-none focus:ring-2 focus:ring-[#385666] transition-all"
      aria-label="Toggle theme"
      onKeyDown={(e) => e.key === " " && e.preventDefault()}
    >
      {theme === "dark" ? <BsSunFill size={18} /> : <BsMoonFill size={18} />}
    </motion.button>
  );
};

const LoadingBar = () => {
  // Since App Router's useRouter does not provide route events,
  // we can use usePathname to detect route changes and show a loading bar.
  const [progress, setProgress] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    setProgress(30);
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setProgress(0), 200);
    }, 300);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return (
    <motion.div 
      className="absolute top-0 left-0 h-0.5 bg-[#EAA632] z-[60]"
      style={{ width: `${progress}%` }}
      initial={{ width: "0%" }}
      animate={{ width: `${progress}%` }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    />
  );
};

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<"up" | "down">("up");
  const [isLive, setIsLive] = useState(false); // Live state
  const [subCount, setSubCount] = useState<string | null>(null); // Subscriber count
  const [showHoverCard, setShowHoverCard] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverCardRef = useRef<HTMLDivElement>(null);
  const { width } = useWindowSize();
  const pathname = usePathname();
  const controls = useAnimation();
  const { scrollY } = useScroll();
  const router = useRouter();

  // Fetch YouTube channel data
  useEffect(() => {
    if (!API_KEY) {
      setError("YouTube API key is missing");
      setIsLoading(false);
      return;
    }

    const fetchChannelData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        
        if (!response.ok) {
          throw new Error(`YouTube API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.items && data.items.length > 0) {
          const channel = data.items[0];
          // Format subscriber count
          const subs = parseInt(channel.statistics.subscriberCount);
          setSubCount(subs > 1000 ? `${(subs / 1000).toFixed(1)}K` : subs.toString());
          
          // Check live status from channel description (mock)
          setIsLive(channel.snippet.description.toLowerCase().includes("live now"));
        } else {
          setError("Channel not found");
        }
      } catch (err) {
        setError("Failed to fetch channel data");
        console.error("YouTube API error:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelData();
  }, []);

  // Scroll direction detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setScrollDirection(latest > previous ? "down" : "up");
    setScrolled(latest > 20);
  });

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
      if (e.key === "/") {
        e.preventDefault();
        document.getElementById("search-input")?.focus();
      }
      // Navigate menu with arrow keys
      if (isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
        e.preventDefault();
        const menuItems = Array.from(
          menuRef.current?.querySelectorAll('[role="menuitem"]') || []
        ) as HTMLElement[];
        
        if (menuItems.length > 0) {
          const currentIndex = menuItems.findIndex(el => el === document.activeElement);
          let nextIndex = 0;
          
          if (e.key === "ArrowDown") {
            nextIndex = currentIndex < menuItems.length - 1 ? currentIndex + 1 : 0;
          } else {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : menuItems.length - 1;
          }
          
          menuItems[nextIndex]?.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Staggered entrance animation
  useEffect(() => {
    controls.start("visible");
  }, [controls]);

  // Handle hover card focus
  useEffect(() => {
    const handleFocusOut = (e: FocusEvent) => {
      if (
        hoverCardRef.current && 
        !hoverCardRef.current.contains(e.relatedTarget as Node)
      ) {
        setShowHoverCard(false);
      }
    };

    const card = hoverCardRef.current;
    if (card) {
      card.addEventListener('focusout', handleFocusOut);
      return () => card.removeEventListener('focusout', handleFocusOut);
    }
  }, []);

  type NavLink = {
    href: string;
    label: string;
  };

  // Updated navigation links with Guests
  const navLinks: NavLink[] = [
    { href: "/", label: "Home" },
    { href: "/episodes", label: "Episodes" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { 
        delay: i * 0.1,
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    })
  };

  const isActive = (href: string) => {
    if (href === "/") return pathname === href;
    return pathname.startsWith(href);
  };

  // Calculate background based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(25, 41, 55, 0)", "rgba(25, 41, 55, 0.95)"]
  );
  
  const blurAmount = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(10px)"]
  );

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <motion.nav
        ref={menuRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
        }}
        style={{
          backgroundColor,
          backdropFilter: blurAmount,
        }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="fixed top-0 left-0 w-full z-50 transition-all duration-300 border-b border-[#385666]/30"
        aria-label="Primary Navigation"
      >
        <LoadingBar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <Link 
              href="/" 
              aria-label="ወቸው Good home" 
              className="flex-shrink-0 flex items-center gap-3"
            >
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#EAA632] to-[#d18a1a] flex items-center justify-center shadow-lg shadow-[#EAA632]/30">
                  <FaPodcast className="text-[#192937] text-xl" />
                </div>
                {isLive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-[#192937] animate-pulse"
                  />
                )}
              </motion.div>
              <motion.span 
                className="text-2xl font-bold text-white hidden md:block font-['Ubuntu']"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                ወቸው <span className="text-[#EAA632]">GOOD</span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1 ml-10">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.href}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate={controls}
                  className="relative"
                >
                  <Link
                    href={link.href}
                    className={cn(
                      "relative px-4 py-2 rounded-lg font-medium transition-colors text-base",
                      isActive(link.href)
                        ? "text-[#EAA632] bg-[#EAA632]/10"
                        : "text-gray-300 hover:text-white hover:bg-[#385666]/30"
                    )}
                  >
                    {link.label}
                    {isActive(link.href) && (
                      <motion.div
                        className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-[#EAA632]"
                        layoutId="navIndicator"
                        initial={{ width: 0, x: "-50%" }}
                        animate={{ width: "80%", x: "-50%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                      />
                    )}
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {/* YouTube Subscriber Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="relative"
                onMouseEnter={() => setShowHoverCard(true)}
                onMouseLeave={() => setShowHoverCard(false)}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2 bg-[#192937] backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border border-[#385666] hover:bg-[#385666]/50"
                  onFocus={() => setShowHoverCard(true)}
                  aria-haspopup="true"
                  aria-expanded={showHoverCard}
                >
                  <FaYoutube className="text-[#EAA632] text-lg" />
                  
                  {isLoading ? (
                    <Skeleton className="w-10 h-4 bg-[#385666]" />
                  ) : error ? (
                    <span className="text-xs">Error</span>
                  ) : subCount ? (
                    <span>{subCount}</span>
                  ) : null}
                  
                  {isLive && (
                    <span className="flex items-center gap-1 ml-1">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      <span className="text-xs font-medium">LIVE</span>
                    </span>
                  )}
                </Button>
                
                {/* Hover Card */}
                <AnimatePresence>
                  {showHoverCard && (
                    <motion.div
                      ref={hoverCardRef}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-[#192937] border border-[#385666] rounded-lg shadow-xl p-4 z-50"
                      tabIndex={0}
                    >
                      <div className="flex items-center mb-2">
                        <FaYoutube className="text-[#EAA632] mr-2 text-xl" />
                        <h3 className="font-bold text-white">ወቸው Good</h3>
                      </div>
                      
                      {isLoading ? (
                        <Skeleton className="w-24 h-4 mb-2 bg-[#385666]" />
                      ) : error ? (
                        <p className="text-gray-300 text-sm mb-2">Data unavailable</p>
                      ) : subCount ? (
                        <p className="text-gray-300 text-sm mb-2">{subCount} subscribers</p>
                      ) : null}
                      
                      {isLive ? (
                        <div className="flex items-center text-red-400">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                          <span className="text-sm">Streaming now</span>
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm">Offline - Check back soon</p>
                      )}
                      
                      <a
                        href={`https://youtube.com/channel/${CHANNEL_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cn(
                          "mt-3 w-full bg-[#EAA632] hover:bg-[#d18a1a] text-[#192937]",
                          "inline-flex items-center justify-center rounded-md text-sm font-medium",
                          "transition-colors focus:outline-none focus:ring-2 focus:ring-[#385666] focus:ring-offset-2",
                          "h-9 px-4 py-2"
                        )}
                      >
                        Watch Now
                      </a>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>


              {/* Mobile Menu Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(!isOpen)}
                aria-expanded={isOpen}
                aria-label="Toggle menu"
                className="md:hidden text-[#EAA632] hover:text-white focus:ring-2 focus:ring-[#385666]"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && width < 768 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-gradient-to-b from-[#192937] to-[#0d1a25] border-t border-[#385666]/30 shadow-xl md:hidden overflow-hidden"
            >
              <motion.ul
                className="px-6 py-8 space-y-4"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: { transition: { staggerChildren: 0.07 } }
                }}
              >
                {navLinks.map((link, i) => (
                  <motion.li 
                    key={link.href}
                    variants={{
                      hidden: { opacity: 0, y: -10 },
                      visible: { 
                        opacity: 1, 
                        y: 0,
                        transition: { delay: i * 0.1 }
                      }
                    }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`block w-full py-3 px-4 rounded-lg text-lg transition-colors ${
                        isActive(link.href)
                          ? "bg-[#385666] text-[#EAA632]"
                          : "text-gray-300 hover:bg-[#385666]/50"
                      }`}
                      role="menuitem"
                      tabIndex={0}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </ThemeProvider>
  );
}