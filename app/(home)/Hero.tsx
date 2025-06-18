// src/components/Hero.tsx
"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaYoutube, FaPlay, FaCalendarAlt, FaUsers, FaExclamationTriangle } from "react-icons/fa";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;

export const Hero = () => {
  const { 
    channelTitle, 
    channelThumbnail, 
    subCount, 
    videoCount, 
    publishedAt, 
    isLoading,
    error
  } = useYouTubeData();

  return (
    <section className="relative bg-gradient-to-br from-slate-900 to-slate-950 py-20 md:py-28 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-red-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            {error ? (
              <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-6 mb-6">
                <div className="flex items-center gap-3 text-red-300 mb-3">
                  <FaExclamationTriangle className="text-xl" />
                  <h3 className="text-xl font-bold">Data Load Error</h3>
                </div>
                <p className="text-gray-300">
                  Failed to load channel data. Please check your API configuration.
                </p>
              </div>
            ) : null}
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              <span className="bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">
                {isLoading ? <Skeleton className="h-16 w-80 mx-auto lg:mx-0" /> : channelTitle}
              </span>
            </h1>
            
            {/* Changed from p to div to avoid hydration errors */}
            <div className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto lg:mx-0">
              {isLoading ? (
                <div>
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-5 w-4/5" />
                </div>
              ) : (
                "Welcome to the official home of the best reaction content on YouTube. Join our community for exclusive content, behind-the-scenes, and more!"
              )}
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Button
                asChild
                className="bg-gradient-to-r from-red-600 to-orange-500 hover:from-red-700 hover:to-orange-600 text-white py-6 px-8 rounded-full text-lg font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/30 transition-all"
              >
                <a 
                  href={`https://youtube.com/channel/${CHANNEL_ID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaYoutube className="mr-2" /> Subscribe Now
                </a>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 py-6 px-8 rounded-full text-lg font-bold"
              >
                <a href="#featured">
                  <FaPlay className="mr-2" /> Watch Videos
                </a>
              </Button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-xl">
              <div className="bg-slate-800/50 backdrop-blur-sm border border-red-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-500/10 rounded-lg">
                    <FaUsers className="text-red-500 text-xl" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Subscribers</div>
                    {isLoading ? (
                      <Skeleton className="h-6 w-24 mt-1" />
                    ) : error ? (
                      <div className="text-red-300 text-sm">Unavailable</div>
                    ) : (
                      <div className="text-white font-bold text-xl">{subCount}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-500/10 rounded-lg">
                    <FaPlay className="text-purple-500 text-xl" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Videos</div>
                    {isLoading ? (
                      <Skeleton className="h-6 w-16 mt-1" />
                    ) : error ? (
                      <div className="text-red-300 text-sm">Unavailable</div>
                    ) : (
                      <div className="text-white font-bold text-xl">{videoCount}</div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="bg-slate-800/50 backdrop-blur-sm border border-blue-500/20 rounded-xl p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <FaCalendarAlt className="text-blue-500 text-xl" />
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Since</div>
                    {isLoading ? (
                      <Skeleton className="h-6 w-20 mt-1" />
                    ) : error ? (
                      <div className="text-red-300 text-sm">Unavailable</div>
                    ) : (
                      <div className="text-white font-bold text-xl">{publishedAt}</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          {/* Right: Channel image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              {isLoading ? (
                <Skeleton className="w-80 h-80 rounded-full" />
              ) : error ? (
                <div className="w-80 h-80 rounded-full bg-slate-800 border border-red-500/30 flex items-center justify-center">
                  <div className="text-center p-6">
                    <FaExclamationTriangle className="text-red-500 text-4xl mx-auto mb-4" />
                    <p className="text-gray-300">Channel image unavailable</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="relative w-80 h-80 rounded-full overflow-hidden border-4 border-white/10 shadow-2xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-red-500/20 to-transparent z-10"></div>
                    <img 
                      src={channelThumbnail} 
                      alt={channelTitle} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Floating elements */}
                  <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-xl">
                    <div className="text-white font-bold text-2xl">#1</div>
                  </div>
                  
                  <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center shadow-xl">
                    <FaPlay className="text-white text-xl" />
                  </div>
                  
                  <motion.div
                    animate={{ 
                      scale: [1, 1.05, 1],
                      rotate: [0, 5, -5, 0]
                    }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                    className="absolute bottom-10 -right-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-3 shadow-lg"
                  >
                    <div className="text-white font-bold flex items-center">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse mr-2"></span>
                      Ale Tube
                    </div>
                  </motion.div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

import { useState, useEffect } from "react";


export const useYouTubeData = () => {
  const [channelTitle, setChannelTitle] = useState("");
  const [channelThumbnail, setChannelThumbnail] = useState("");
  const [subCount, setSubCount] = useState("");
  const [videoCount, setVideoCount] = useState("");
  const [publishedAt, setPublishedAt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!API_KEY || !CHANNEL_ID) {
        setError("Missing API configuration");
        setIsLoading(false);
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch channel statistics
        const statsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        
        if (!statsRes.ok) {
          throw new Error(`API request failed with status ${statsRes.status}`);
        }
        
        const statsData = await statsRes.json();
        
        if (!statsData.items || statsData.items.length === 0) {
          throw new Error("No channel data found");
        }
        
        const channel = statsData.items[0];
        setChannelTitle(channel.snippet.title);
        setChannelThumbnail(channel.snippet.thumbnails.high.url);
        
        // Format subscriber count
        const subs = parseInt(channel.statistics.subscriberCount);
        setSubCount(
          subs >= 1e6 
            ? `${(subs / 1e6).toFixed(1)}M` 
            : subs >= 1e3 
              ? `${(subs / 1e3).toFixed(1)}K` 
              : subs.toString()
        );
        
        // Set video count
        setVideoCount(parseInt(channel.statistics.videoCount).toLocaleString());
        
        // Set published year
        const publishedDate = new Date(channel.snippet.publishedAt);
        setPublishedAt(publishedDate.getFullYear().toString());
        
      } catch (err) {
        console.error("Failed to fetch YouTube data:", err);
        setError("Failed to load channel data");
        // Reset all values to empty instead of fake data
        setChannelTitle("AleTube");
        setChannelThumbnail("");
        setSubCount("");
        setVideoCount("");
        setPublishedAt("");
      } finally {
        setIsLoading(false);
      }
    };

    fetchChannelData();
    
    // Set up automatic refresh every 5 minutes
    const interval = setInterval(fetchChannelData, 300000);
    return () => clearInterval(interval);
  }, []);

  return { 
    channelTitle, 
    channelThumbnail, 
    subCount, 
    videoCount, 
    publishedAt, 
    isLoading,
    error
  };
};