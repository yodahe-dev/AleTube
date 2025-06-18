"use client";
import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { FaPlay, FaFire, FaClock, FaThumbsUp, FaHistory, FaSearch } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import Link from "next/link";

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  publishedAt: string;
  rawPublishedAt: string; // For accurate sorting
  viewCount: string;
  rawViewCount: number; // For accurate sorting
  likeCount: string;
  rawLikeCount: number; // For accurate sorting
  duration: string;
}

export const VideoGallery = () => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [filteredVideos, setFilteredVideos] = useState<Video[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
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
        setFilteredVideos(formattedVideos);
      } catch (error) {
        console.error("Failed to fetch videos:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVideos();
  }, []);

  // Filter videos based on debounced query
  useEffect(() => {
    if (debouncedQuery) {
      const filtered = videos.filter(video => 
        video.title.toLowerCase().includes(debouncedQuery.toLowerCase()) ||
        video.description.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
      setFilteredVideos(filtered);
    } else {
      setFilteredVideos(videos);
    }
  }, [debouncedQuery, videos]);

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

  // Get videos by category with accurate sorting
  const getVideosByCategory = useCallback((category: string) => {
    if (!videos.length) return [];
    
    // Create a copy to avoid mutating original array
    const sortedVideos = [...videos];
    
    switch (category) {
      case "latest":
        // Already in latest order from API
        return sortedVideos;
      
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
  }, [videos]);

  // Handle video selection
  const handleVideoSelect = (video: Video) => {
    setSelectedVideo(video);
    // Scroll to video player
    document.getElementById("video-player")?.scrollIntoView({ behavior: "smooth" });
  };



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
            ) : filteredVideos.length > 0 ? (
              getVideosByCategory(activeTab).slice(0, 6).map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ y: -5 }}
                >
                  <Card 
                    className="bg-slate-800 border-slate-700 overflow-hidden cursor-pointer transition-all hover:border-red-500/50"
                    onClick={() => handleVideoSelect(video)}
                  >
                    <CardContent className="p-0 relative">
                      {/* Thumbnail */}
                      <div className="relative">
                        <img 
                          src={video.thumbnail} 
                          alt={video.title} 
                          className="w-full h-48 object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                            <FaPlay className="text-white text-xl" />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/80 text-white px-2 py-1 rounded text-sm">
                          {video.duration}
                        </div>
                      </div>
                      
                      {/* Video Info */}
                      <div className="p-4">
                        <h3 className="font-bold text-white mb-2 line-clamp-2">{video.title}</h3>
                        <div className="flex flex-wrap gap-3 text-gray-400 text-sm">
                          <div className="flex items-center">
                            <FaPlay className="mr-1" />
                            <span>{video.viewCount}</span>
                          </div>
                          <div className="flex items-center">
                            <FaThumbsUp className="mr-1" />
                            <span>{video.likeCount}</span>
                          </div>
                          <div className="flex items-center">
                            <FaClock className="mr-1" />
                            <span>{video.publishedAt}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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