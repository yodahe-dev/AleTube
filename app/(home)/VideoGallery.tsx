"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaFire, FaClock, FaThumbsUp, FaHistory, FaSearch, FaEye, FaStar } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  rawPublishedAt: string;
  viewCount: string;
  rawViewCount: number;
  likeCount: string;
  rawLikeCount: number;
  duration: string;
}

// Format numbers like YouTube (1K, 1M, etc.)
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return num.toString();
};

// Format date to relative time
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  let interval = Math.floor(seconds / 31536000);
  if (interval > 1) return `${interval} years ago`;
  if (interval === 1) return '1 year ago';
  
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) return `${interval} months ago`;
  if (interval === 1) return '1 month ago';
  
  interval = Math.floor(seconds / 86400);
  if (interval > 1) return `${interval} days ago`;
  if (interval === 1) return '1 day ago';
  
  interval = Math.floor(seconds / 3600);
  if (interval > 1) return `${interval} hours ago`;
  if (interval === 1) return '1 hour ago';
  
  interval = Math.floor(seconds / 60);
  if (interval > 1) return `${interval} minutes ago`;
  
  return 'Just now';
};

export const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("latest");

  // Debounce search input (500ms delay)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  // Fetch videos from YouTube API
  useEffect(() => {
    const fetchVideos = async () => {
      if (!API_KEY || !CHANNEL_ID) return;
      
      try {
        setIsLoading(true);
        
        // Get uploads playlist ID
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        );
        const channelData = await channelRes.json();
        const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
        
        // Get videos from uploads playlist
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${uploadsPlaylistId}&maxResults=50&key=${API_KEY}`
        );
        const videosData = await videosRes.json();
        
        // Extract video IDs
        const videoIds = videosData.items.map((item: any) => item.snippet.resourceId.videoId).join(",");
        
        // Get video details
        const detailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
        );
        const detailsData = await detailsRes.json();
        
        // Format video data
        const formattedVideos = detailsData.items.map((video: any) => {
          const rawViewCount = parseInt(video.statistics.viewCount);
          const rawLikeCount = parseInt(video.statistics.likeCount);
          
          return {
            id: video.id,
            title: video.snippet.title,
            description: video.snippet.description,
            thumbnail: video.snippet.thumbnails.high.url,
            publishedAt: new Date(video.snippet.publishedAt).toLocaleDateString(),
            rawPublishedAt: video.snippet.publishedAt,
            viewCount: rawViewCount.toLocaleString(),
            rawViewCount: rawViewCount,
            likeCount: rawLikeCount.toLocaleString(),
            rawLikeCount: rawLikeCount,
            duration: formatDuration(video.contentDetails.duration)
          }
        });
        
        setVideos(formattedVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];
    
    // Apply search filter
    if (debouncedQuery) {
      result = result.filter(video => 
        video.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    return result;
  }, [videos, debouncedQuery]);

  // Get videos by category with accurate sorting
  const getVideosByCategory = useCallback((category: string, videoList: Video[]) => {
    if (!videoList.length) return [];
    
    // Create a copy to avoid mutating original array
    const sortedVideos = [...videoList];
    
    switch (category) {
      case "latest":
        // Sort by latest (descending by published date)
        return sortedVideos.sort((a, b) => 
          new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime()
        );
      
      case "popular":
        // Sort by highest view count
        return sortedVideos.sort((a, b) => b.rawViewCount - a.rawViewCount);
      
      case "oldest":
        // Sort by oldest published date
        return sortedVideos.sort((a, b) => 
          new Date(a.rawPublishedAt).getTime() - new Date(b.rawPublishedAt).getTime()
        );
      
      case "topLiked":
        // Sort by highest like count
        return sortedVideos.sort((a, b) => b.rawLikeCount - a.rawLikeCount);
        
      default:
        return sortedVideos;
    }
  }, []);

  // Format YouTube duration (PT15M33S -> 15:33)
  const formatDuration = (duration: string) => {
    const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
    if (!match) return "0:00";
    
    const hours = parseInt(match[1]) || 0;
    const minutes = parseInt(match[2]) || 0;
    const seconds = parseInt(match[3]) || 0;
    
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
      : `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Handle play video
  const handlePlayVideo = (videoId: string) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null);
    } else {
      setPlayingVideoId(videoId);
      
      // Scroll to video when playing
      setTimeout(() => {
        const element = document.getElementById(`video-${videoId}`);
        if (element) {
          element.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
      }, 100);
    }
  };

  // Get sorted videos for current tab
  const sortedVideos = useMemo(() => {
    return getVideosByCategory(activeTab, filteredVideos);
  }, [activeTab, filteredVideos, getVideosByCategory]);

  return (
    <section className="py-16 bg-gradient-to-b from-slate-900 to-slate-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-white mb-4"
          >
            Explore Our Videos
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto"
          >
            Discover our latest reactions, popular content, and fan favorites all in one place
          </motion.p>
        </div>



        {/* Video Categories */}
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 w-full bg-slate-800 rounded-xl p-2 mb-8">
            <TabsTrigger 
              value="latest" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaHistory /> Latest
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="popular" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaFire /> Popular
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="oldest" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaClock /> Oldest
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="topLiked" 
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white rounded-lg"
            >
              <div className="flex items-center gap-2">
                <FaThumbsUp /> Top Liked
              </div>
            </TabsTrigger>
          </TabsList>

          {/* Video Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, idx) => (
                <Card key={idx} className="bg-slate-800 border-slate-700 overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48 rounded-t-xl" />
                    <div className="p-4">
                      <Skeleton className="h-6 w-4/5 mb-2" />
                      <Skeleton className="h-4 w-1/4 mb-2" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : sortedVideos.length > 0 ? (
              sortedVideos.slice(0, 6).map((video) => (
                <motion.div
                  key={video.id}
                  id={`video-${video.id}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-slate-800/50 backdrop-blur-sm rounded-xl overflow-hidden border border-slate-700 hover:border-red-500 transition-all duration-300 hover:shadow-lg hover:shadow-red-500/20"
                >
                  {/* Video Thumbnail/Player */}
                  <div className="relative aspect-video">
                    {playingVideoId === video.id ? (
                      <div className="w-full h-full">
                        <iframe
                          src={`https://www.youtube.com/embed/${video.id}?autoplay=1`}
                          title={video.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    ) : (
                      <div 
                        className="relative w-full h-full cursor-pointer" 
                        onClick={() => handlePlayVideo(video.id)}
                      >
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                          <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-md text-sm">
                            {video.duration}
                          </div>
                          <div className="w-14 h-14 rounded-full bg-red-500 flex items-center justify-center hover:scale-105 transition-transform">
                            <FaPlay className="text-white ml-1" size={20} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
                    <div className="flex flex-wrap gap-3 text-gray-400 text-sm">
                      <div className="flex items-center">
                        <FaPlay className="mr-1" />
                        <span>{video.viewCount} views</span>
                      </div>
                      <div className="flex items-center">
                        <FaThumbsUp className="mr-1" />
                        <span>{video.likeCount} likes</span>
                      </div>
                      <div className="flex items-center">
                        <FaClock className="mr-1" />
                        <span>{formatDate(video.rawPublishedAt)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayVideo(video.id)}
                        className={`flex-1 text-center py-2 rounded-lg ${
                          playingVideoId === video.id
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-slate-700 hover:bg-slate-600'
                        }`}
                      >
                        {playingVideoId === video.id ? 'Stop' : 'Play'}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <h3 className="text-xl text-white mb-2">No videos found</h3>
                <p className="text-gray-400">Try adjusting your search query</p>
              </div>
            )}
          </div>
        </Tabs>

        {/* View All Reactions Button */}
        <div className="text-center mt-12">
          <Link href="/reaction" passHref>
            <Button 
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10 px-8 py-6 text-lg"
            >
              View All Reactions
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};