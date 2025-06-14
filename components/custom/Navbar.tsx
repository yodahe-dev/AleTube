"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { FaPodcast, FaBars, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

// Custom hook for responsive breakpoints
function useWindowSize() {
  const [width, setWidth] = useState<number>(0);

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const width = useWindowSize();

  // Scroll listener
  const handleScroll = useCallback(() => {
    setScrolled(window.scrollY > 20);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

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

  // Close on larger screens
  useEffect(() => {
    if (width >= 768) setIsOpen(false);
  }, [width]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/episodes", label: "Episodes" },
    { href: "/team", label: "Team" },
    { href: "/contact", label: "Contact" },
  ];

  const itemVariants = {
    open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
    closed: { opacity: 0, y: 20 },
  };

  return (
    <motion.nav
      ref={menuRef}
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 backdrop-blur-md ${
        scrolled
          ? "bg-gradient-to-b from-gray-800 to-gray-900 shadow-lg"
          : ""
      }`}
      aria-label="Primary Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" aria-label="ወቸው Good home">
                      <motion.div 
            className="flex items-center gap-2"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-full bg-[#EAA632] flex items-center justify-center">
              <span className="text-white font-bold text-xl">G</span>
            </div>
            <span className="text-2xl font-bold text-[#192937] dark:text-white">
              ወቸው <span className="text-[#EAA632]">GOOD</span>
            </span>
          </motion.div>
          </Link>

          {/* Desktop Menu */}
          {width >= 768 ? (
            <div className="ml-10 flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="px-3 py-2 rounded-md text-yellow-300 font-medium hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ) : (
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Toggle menu"
              className="text-yellow-400 hover:text-white p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
            >
              {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
          )}
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
            className="bg-gradient-to-b from-yellow-600 via-orange-500 to-red-600 shadow-xl"
          >
            <motion.ul
              className="px-6 py-8 space-y-6 text-white font-semibold text-lg"
              initial="closed"
              animate="open"
              exit="closed"
              variants={{ open: { transition: { staggerChildren: 0.07, delayChildren: 0.2 } }, closed: { transition: { staggerChildren: 0.05, staggerDirection: -1 } } }}
            >
              {navLinks.map((link) => (
                <motion.li key={link.href} variants={itemVariants}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className="block w-full py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-400 px-4 transition-colors duration-200"
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
  );
}
