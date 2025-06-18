"use client";
import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  motion, 
  AnimatePresence, 
  useScroll, 
  useMotionValueEvent,
  useTransform 
} from "framer-motion";
import { 
  FaBars, 
  FaTimes, 
  FaYoutube,
  FaHome,
  FaFire,
  FaHandshake,
  FaShoppingBag,
  FaEnvelope,
  FaUserFriends,
  FaRocket,
  FaTwitter,
  FaInstagram,
  FaDiscord,
  FaHeart,
  FaCrown
} from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

// YouTube API Constants
const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;

// Custom hook for YouTube data
const useYouTubeData = () => {
  const [isLive, setIsLive] = useState(false);
  const [subCount, setSubCount] = useState<string | null>(null);
  const [channelTitle, setChannelTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!API_KEY || !CHANNEL_ID) return;
      
      try {
        setIsLoading(true);
        
        // Fetch channel statistics
        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const statsData = await statsRes.json();
        
        if (statsData.items?.length > 0) {
          const channel = statsData.items[0];
          setChannelTitle(channel.snippet.title);
          
          // Format subscriber count
          const subs = parseInt(channel.statistics.subscriberCount);
          setSubCount(
            subs >= 1e6 
              ? `${(subs / 1e6).toFixed(1)}M` 
              : subs >= 1e3 
                ? `${(subs / 1e3).toFixed(1)}K` 
                : subs.toString()
          );
        }
        
        // Check for live streams
        const liveRes = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`
        );
        const liveData = await liveRes.json();
        setIsLive(liveData.items?.length > 0);
        
      } catch (error) {
        console.error("Failed to fetch YouTube data:", error);
        setSubCount("1.2M"); // Fallback value
        setIsLive(true); // Fallback state
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelData();
  }, []);

  return { isLive, subCount, channelTitle, isLoading };
};

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showHoverCard, setShowHoverCard] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const hoverCardRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { scrollY } = useScroll();
  const { isLive, subCount, channelTitle, isLoading } = useYouTubeData();
  
  // Navigation links with creative icons
  const navLinks = [
    { 
      name: "Home", 
      href: "/", 
      icon: <FaHome className="text-lg" />,
    },
    { 
      name: "Reactions", 
      href: "/reactions", 
      icon: <FaFire className="text-lg text-orange-500" />,
    },
    { 
      name: "Community", 
      href: "/community", 
      icon: <FaUserFriends className="text-lg text-blue-400" />,
    },
    { 
      name: "Store", 
      href: "/store", 
      icon: <FaShoppingBag className="text-lg text-purple-500" />,
    },
    { 
      name: "Contact", 
      href: "/contact", 
      icon: <FaEnvelope className="text-lg text-cyan-400" />,
    },
  ];

  // Scroll direction detection
  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() || 0;
    setScrolled(latest > 20);
  });

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Calculate background based on scroll
  const backgroundColor = useTransform(
    scrollY,
    [0, 50],
    ["rgba(15, 23, 42, 0)", "rgba(15, 23, 42, 0.98)"]
  );
  
  const blurAmount = useTransform(
    scrollY,
    [0, 50],
    ["blur(0px)", "blur(12px)"]
  );

  const isActive = (href: string) => pathname === href;

  return (
    <>
      <motion.nav
        ref={menuRef}
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ backgroundColor, backdropFilter: blurAmount }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="fixed top-0 left-0 w-full z-50 border-b border-red-500/20"
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo with animation */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="relative"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                  <FaYoutube className="text-white text-xl" />
                </div>
                {isLive && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse"
                  />
                )}
              </motion.div>
              <motion.span 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-white hidden md:block font-sans tracking-tighter"
              >
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  AleTube
                </span>
              </motion.span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1 ml-10">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative px-4 py-2.5 rounded-lg font-medium transition-all text-base flex items-center gap-2 group",
                    isActive(link.href)
                      ? "text-white bg-gradient-to-r from-red-500/20 to-transparent"
                      : "text-gray-300 hover:text-white"
                  )}
                >
                  <span className="transition-transform group-hover:scale-110">
                    {link.icon}
                  </span>
                  <span>{link.name}</span>
                  
                  {isActive(link.href) && (
                    <motion.div
                      className="absolute bottom-0 left-1/2 w-4/5 h-0.5 bg-gradient-to-r from-red-500 to-orange-500"
                      layoutId="navIndicator"
                      initial={{ width: 0, x: "-50%" }}
                      animate={{ width: "80%", x: "-50%" }}
                      transition={{ type: "spring", stiffness: 300 }}
                    />
                  )}
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* YouTube Subscriber Badge */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="relative"
                onMouseEnter={() => setShowHoverCard(true)}
                onMouseLeave={() => setShowHoverCard(false)}
              >
                <Button
                  variant="ghost"
                  className={cn(
                    "flex items-center gap-2 bg-slate-900 backdrop-blur-sm px-3 py-1.5 rounded-full text-sm text-white border transition-all",
                    isLive 
                      ? "border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)] hover:shadow-[0_0_15px_rgba(239,68,68,0.7)]" 
                      : "border-red-500/30 hover:border-red-500/50"
                  )}
                  onFocus={() => setShowHoverCard(true)}
                  aria-haspopup="true"
                  aria-expanded={showHoverCard}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-4 w-4 rounded-full bg-slate-700" />
                      <Skeleton className="h-4 w-16 bg-slate-700" />
                    </div>
                  ) : (
                    <>
                      <FaYoutube className="text-red-500 text-lg" />
                      <span>{subCount}</span>
                      {isLive && (
                        <span className="flex items-center gap-1 ml-1">
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                          <span className="text-xs font-medium">LIVE</span>
                        </span>
                      )}
                    </>
                  )}
                </Button>
                
                {/* Hover Card */}
                <AnimatePresence>
                  {showHoverCard && !isLoading && (
                    <motion.div
                      ref={hoverCardRef}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      className="absolute top-full right-0 mt-2 w-64 bg-slate-900/90 backdrop-blur-lg border border-red-500/30 rounded-xl shadow-xl p-4 z-50"
                      style={{
                        boxShadow: "0 10px 30px -10px rgba(239, 68, 68, 0.2)"
                      }}
                      tabIndex={0}
                    >
                      <div className="flex items-center mb-2">
                        <div className="relative mr-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                            <FaYoutube className="text-white text-lg" />
                          </div>
                          {isLive && (
                            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-bold text-white truncate max-w-[160px]">
                            {channelTitle || "AleTube"}
                          </h3>
                          <p className="text-gray-300 text-sm">
                            {subCount} subscribers
                          </p>
                        </div>
                      </div>
                      
                      {isLive && (
                        <div className="mb-4">
                          <div className="flex items-center text-red-400 mb-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                            <span className="text-sm font-medium">Live Now</span>
                          </div>
                          <div className="relative h-24 rounded-lg overflow-hidden bg-gradient-to-r from-red-500/20 to-orange-500/20">
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center">
                              <div className="bg-red-500 px-3 py-1 rounded-full text-xs font-bold flex items-center">
                                <span className="animate-pulse mr-2">●</span>
                                LIVE STREAM
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                      
                      <a
                        href={`https://youtube.com/channel/${CHANNEL_ID}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 w-full bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all h-9 px-4 py-2 shadow-lg shadow-red-500/20 hover:shadow-red-500/30"
                      >
                        <FaRocket className="mr-2 animate-bounce" />
                        {isLive ? "Watch Live" : "Visit Channel"}
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
                className="md:hidden text-red-500 hover:text-white focus:ring-2 focus:ring-red-500/50"
              >
                {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="bg-slate-900 border-t border-red-500/20 shadow-xl md:hidden overflow-hidden"
              style={{
                background: "linear-gradient(to bottom, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98))",
                backdropFilter: "blur(10px)"
              }}
            >
              <ul className="px-4 py-5 space-y-3">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={`flex items-center gap-3 w-full py-3 px-4 rounded-lg text-lg transition-colors ${
                        isActive(link.href)
                          ? "bg-gradient-to-r from-red-500/20 to-transparent text-white"
                          : "text-gray-300 hover:bg-slate-800"
                      }`}
                      role="menuitem"
                    >
                      <span className="text-xl">
                        {link.icon}
                      </span>
                      <span>{link.name}</span>
                    </Link>
                  </li>
                ))}
                
                {/* Subscriber count in mobile menu */}
                <li>
                  <div className="flex items-center gap-3 w-full py-3 px-4 rounded-lg text-lg bg-slate-800/50">
                    <FaYoutube className="text-red-500 text-xl" />
                    <div>
                      <div className="text-gray-300 text-sm">Subscribers</div>
                      {isLoading ? (
                        <Skeleton className="h-5 w-20 bg-slate-700 mt-1" />
                      ) : (
                        <div className="text-white font-medium flex items-center gap-2">
                          <span>{subCount}</span>
                          {isLive && (
                            <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full flex items-center">
                              <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                              LIVE
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              </ul>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </>
  );
}

function Footer() {
  const { isLive, subCount, channelTitle, isLoading } = useYouTubeData();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-slate-950 border-t border-red-500/20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center shadow-lg shadow-red-500/30">
                <FaYoutube className="text-white text-xl" />
              </div>
              <div className="text-2xl font-bold text-white font-sans">
                <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                  AleTube
                </span>
              </div>
            </div>
            <p className="text-gray-400 max-w-xs">
              Creating the best reaction content on YouTube. Join our community of passionate viewers!
            </p>
            
            {/* Subscriber Count */}
            <div className="pt-4">
              <div className="flex items-center gap-3 bg-slate-800/50 border border-red-500/30 rounded-full px-4 py-2 w-fit">
                <FaYoutube className="text-red-500 text-xl" />
                <div>
                  <div className="text-gray-300 text-sm">Subscribers</div>
                  {isLoading ? (
                    <Skeleton className="h-5 w-20 bg-slate-700 mt-1" />
                  ) : (
                    <div className="text-white font-medium flex items-center gap-2">
                      <span>{subCount}</span>
                      {isLive && (
                        <span className="text-xs bg-red-500 px-2 py-0.5 rounded-full flex items-center">
                          <span className="w-2 h-2 bg-white rounded-full animate-pulse mr-1"></span>
                          LIVE
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaRocket className="text-orange-500" /> Navigation
            </h3>
            <ul className="space-y-3">
              {[
                { name: "Home", href: "/" },
                { name: "Reactions", href: "/reactions" },
                { name: "Community", href: "/community" },
                { name: "Store", href: "/store" },
                { name: "Contact", href: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-red-500 transition-colors flex items-center gap-2 group"
                  >
                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></span>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Premium Features */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaCrown className="text-yellow-400" /> Premium
            </h3>
            <ul className="space-y-3">
              {[
                "Exclusive Reactions",
                "Early Access Videos",
                "Members-only Streams",
                "Custom Emojis",
                "Creator Support"
              ].map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-red-500 mt-1">•</span>
                  <span className="text-gray-400">{item}</span>
                </li>
              ))}
            </ul>
            <Button className="mt-4 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
              Become Member
            </Button>
          </div>

          {/* Connect Section */}
          <div>
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <FaUserFriends className="text-blue-400" /> Connect
            </h3>
            <p className="text-gray-400 mb-4">
              Join our community across platforms
            </p>
            
            <div className="flex gap-4 mb-6">
              {[
                { icon: <FaYoutube className="text-xl" />, color: "bg-red-500", href: "#" },
                { icon: <FaTwitter className="text-xl" />, color: "bg-blue-400", href: "#" },
                { icon: <FaInstagram className="text-xl" />, color: "bg-gradient-to-br from-purple-500 to-pink-500", href: "#" },
                { icon: <FaDiscord className="text-xl" />, color: "bg-indigo-500", href: "#" },
              ].map((social, idx) => (
                <a
                  key={idx}
                  href={social.href}
                  className={`w-10 h-10 rounded-full ${social.color} flex items-center justify-center text-white transition-transform hover:scale-110 shadow-lg`}
                  aria-label={`${social.color} social media`}
                >
                  {social.icon}
                </a>
              ))}
            </div>
            
            <div className="bg-slate-800/50 border border-cyan-500/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <FaHeart className="text-pink-500 animate-pulse" />
                <span className="font-bold">Support Our Work</span>
              </div>
              <p className="text-gray-300 text-sm">
                Help us create more amazing content by becoming a patron
              </p>
              <Button className="mt-3 w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600">
                Donate Now
              </Button>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-500 text-sm">
            © {currentYear} {channelTitle || "AleTube"}. All rights reserved.
          </p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="text-gray-500 hover:text-red-500 text-sm">Privacy Policy</a>
            <a href="#" className="text-gray-500 hover:text-red-500 text-sm">Terms of Service</a>
            <a href="#" className="text-gray-500 hover:text-red-500 text-sm">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
export default Navbar;
export { Footer }; // Export Footer for use in layout