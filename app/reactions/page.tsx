"use client";
import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FaPlay, FaPause, FaSearch, FaFilter, FaTimes, 
  FaFire, FaClock, FaThumbsUp, FaHistory, FaHeart,
  FaEye, FaStar, FaCalendarAlt, FaRandom, FaBookmark,
  FaDownload, FaShareAlt, FaRegBookmark, FaRegHeart
} from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
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
  comments?: string;
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

export default function ReactionsPage() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "popular" | "topLiked" | "random">("newest");
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [bookmarkedVideos, setBookmarkedVideos] = useState<string[]>([]);
  const [likedVideos, setLikedVideos] = useState<string[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  const [showVideoModal, setShowVideoModal] = useState(false);
  const [playlists, setPlaylists] = useState<Record<string, string[]>>({});
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedForPlaylist, setSelectedForPlaylist] = useState<string | null>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const videosPerPage = 20;

  // Initialize from localStorage
  useEffect(() => {
    const savedBookmarks = localStorage.getItem("bookmarkedVideos");
    const savedLikes = localStorage.getItem("likedVideos");
    const savedPlaylists = localStorage.getItem("playlists");
    
    if (savedBookmarks) setBookmarkedVideos(JSON.parse(savedBookmarks));
    if (savedLikes) setLikedVideos(JSON.parse(savedLikes));
    if (savedPlaylists) setPlaylists(JSON.parse(savedPlaylists));
  }, []);

  // Save to localStorage when changes occur
  useEffect(() => {
    localStorage.setItem("bookmarkedVideos", JSON.stringify(bookmarkedVideos));
    localStorage.setItem("likedVideos", JSON.stringify(likedVideos));
    localStorage.setItem("playlists", JSON.stringify(playlists));
  }, [bookmarkedVideos, likedVideos, playlists]);

  // Fetch videos from YouTube API
  const fetchVideos = useCallback(async (pageToken = "") => {
    if (!API_KEY || !CHANNEL_ID) {
      setError("API key or channel ID is missing");
      setLoading(false);
      return;
    }
    
    try {
      // Get uploads playlist ID
      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
      );
      const channelData = await channelRes.json();
      const uploadsPlaylistId = channelData.items[0].contentDetails.relatedPlaylists.uploads;
      
      // Get videos from uploads playlist
      const params = new URLSearchParams({
        part: "snippet",
        playlistId: uploadsPlaylistId,
        maxResults: "50",
        key: API_KEY,
        ...(pageToken ? { pageToken } : {})
      });
      
      const videosRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?${params}`
      );
      const videosData = await videosRes.json();
      
      const videoIds = videosData.items
        .map((item: any) => item.snippet.resourceId.videoId)
        .filter((id: string) => id)
        .join(",");
      
      // Get video details
      const detailsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
      );
      const detailsData = await detailsRes.json();
      
      // Format videos data
      const formattedVideos = detailsData.items.map((item: any) => {
        const rawViewCount = item.statistics?.viewCount ? 
          parseInt(item.statistics.viewCount) : 
          0;
        const rawLikeCount = item.statistics?.likeCount ? 
          parseInt(item.statistics.likeCount) : 
          0;
        
        return {
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          thumbnail: item.snippet.thumbnails?.high?.url || 
                   item.snippet.thumbnails?.medium?.url || 
                   item.snippet.thumbnails?.default?.url,
          publishedAt: item.snippet.publishedAt,
          rawPublishedAt: item.snippet.publishedAt,
          viewCount: formatNumber(rawViewCount),
          rawViewCount,
          likeCount: formatNumber(rawLikeCount),
          rawLikeCount,
          duration: formatDuration(item.contentDetails?.duration || "PT0M0S"),
          comments: item.statistics?.commentCount || "0"
        };
      });
      
      return {
        videos: formattedVideos,
        nextPageToken: videosData.nextPageToken || null
      };
    } catch (err) {
      throw new Error("Failed to fetch videos");
    }
  }, []);

  // Initial load of all videos
  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch first page
        const result = await fetchVideos();
        if (result) {
          const { videos: firstVideos, nextPageToken } = result;
          setVideos(firstVideos);

          // If there are more pages, fetch them in background
          if (nextPageToken) {
            fetchRemainingVideos(nextPageToken);
          } else {
            setHasMore(false);
          }
        } else {
          setHasMore(false);
        }
      } catch (err) {
        setError("Failed to fetch videos. Please check your network connection and try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    loadVideos();
  }, [fetchVideos]);

  // Fetch remaining videos in background
  const fetchRemainingVideos = async (pageToken: string) => {
    try {
      const result = await fetchVideos(pageToken);
      if (!result) return;
      const { videos: newVideos, nextPageToken } = result;
      setVideos(prev => [...prev, ...newVideos]);
      
      if (nextPageToken) {
        fetchRemainingVideos(nextPageToken);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      console.error("Error fetching additional videos:", err);
    }
  };

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...videos];
    
    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(video => 
        video.title.toLowerCase().includes(query) ||
        video.description.toLowerCase().includes(query)
      );
    }
    
    // Apply sorting
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => 
          new Date(b.rawPublishedAt).getTime() - new Date(a.rawPublishedAt).getTime()
        );
        break;
        
      case "oldest":
        result.sort((a, b) => 
          new Date(a.rawPublishedAt).getTime() - new Date(b.rawPublishedAt).getTime()
        );
        break;
        
      case "popular":
        result.sort((a, b) => b.rawViewCount - a.rawViewCount);
        break;
        
      case "topLiked":
        result.sort((a, b) => b.rawLikeCount - a.rawLikeCount);
        break;
        
      case "random":
        result = [...result].sort(() => Math.random() - 0.5);
        break;
    }
    
    return result;
  }, [videos, searchQuery, sortBy]);

  // Paginated videos
  const paginatedVideos = useMemo(() => {
    return filteredVideos.slice(0, page * videosPerPage);
  }, [filteredVideos, page]);

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

  // Handle infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage(prev => prev + 1);
      }
    }, { threshold: 0.1 });
    
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    
    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, loading]);

  // Toggle bookmark
  const toggleBookmark = (videoId: string) => {
    setBookmarkedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  // Toggle like
  const toggleLike = (videoId: string) => {
    setLikedVideos(prev => 
      prev.includes(videoId) 
        ? prev.filter(id => id !== videoId)
        : [...prev, videoId]
    );
  };

  // Open video in modal
  const openVideoModal = (video: Video) => {
    setSelectedVideo(video);
    setShowVideoModal(true);
  };

  // Create new playlist
  const createPlaylist = () => {
    if (newPlaylistName.trim() && selectedForPlaylist) {
      setPlaylists(prev => ({
        ...prev,
        [newPlaylistName]: [...(prev[newPlaylistName] || []), selectedForPlaylist]
      }));
      setNewPlaylistName("");
      setSelectedForPlaylist(null);
      setShowPlaylistModal(false);
    }
  };

  // Add to existing playlist
  const addToPlaylist = (playlistName: string, videoId: string) => {
    setPlaylists(prev => ({
      ...prev,
      [playlistName]: [...(prev[playlistName] || []), videoId]
    }));
    setSelectedForPlaylist(null);
  };

  // Share video
  const shareVideo = (videoId: string) => {
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    if (navigator.share) {
      navigator.share({
        title: 'Check out this video!',
        url
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(url);
      alert('Link copied to clipboard!');
    }
  };

  // Download video placeholder
  const downloadVideo = () => {
    alert('Download feature would be implemented with a proper backend service');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-slate-900/90 backdrop-blur-md border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center">
              <FaPlay size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              All Reactions
            </h1>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-full hover:bg-slate-700 transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <FaFilter size={18} />
            <span>Filters</span>
          </motion.button>
        </div>
      </header>
      
      {/* Filter Menu */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="bg-slate-800 border-b border-slate-700 overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaSearch className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'newest' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <FaHistory size={16} />
                  <span>Newest</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('oldest')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'oldest' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <FaClock size={16} />
                  <span>Oldest</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'popular' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <FaFire size={16} />
                  <span>Popular</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('topLiked')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'topLiked' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <FaThumbsUp size={16} />
                  <span>Top Liked</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('random')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'random' 
                      ? 'bg-red-500 text-white' 
                      : 'bg-slate-700 hover:bg-slate-600'
                  }`}
                >
                  <FaRandom size={16} />
                  <span>Random</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('')
                    setSortBy('newest')
                  }}
                  className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
                >
                  <FaTimes size={16} />
                  <span>Reset</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{videos.length}</div>
            <div className="text-gray-400">Total Videos</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {formatNumber(videos.reduce((sum, video) => sum + video.rawViewCount, 0))}
            </div>
            <div className="text-gray-400">Total Views</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">
              {formatNumber(videos.reduce((sum, video) => sum + video.rawLikeCount, 0))}
            </div>
            <div className="text-gray-400">Total Likes</div>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold">{bookmarkedVideos.length}</div>
            <div className="text-gray-400">Bookmarked</div>
          </div>
        </div>
        
        {/* Video Grid */}
        {loading && !videos.length ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500"></div>
            <span className="sr-only">Loading all videos...</span>
            <p className="ml-4">Loading videos library...</p>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-red-500/20 p-6 rounded-xl inline-block">
              <h2 className="text-xl font-bold mb-2">Error Loading Videos</h2>
              <p className="mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : paginatedVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-slate-800/50 p-6 rounded-xl inline-block">
              <h2 className="text-xl font-bold mb-2">No Videos Found</h2>
              <p className="mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSortBy('newest')
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-600"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {paginatedVideos.map((video) => (
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
                      <div className="relative w-full h-full cursor-pointer" onClick={() => handlePlayVideo(video.id)}>
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
                            <FaPlay className="text-white ml-1" size={24} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4">
                    <h3 
                      className="font-bold text-lg mb-2 line-clamp-2 cursor-pointer hover:text-red-400"
                      onClick={() => openVideoModal(video)}
                    >
                      {video.title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-300 mb-3">
                      <div className="flex items-center gap-1">
                        <FaEye size={14} />
                        <span>{video.viewCount}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <FaThumbsUp size={14} />
                        <span>{video.likeCount}</span>
                      </div>
                      <span>
                        {formatDate(video.rawPublishedAt)}
                      </span>
                    </div>
                    
                    <div className="flex justify-between gap-2">
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleLike(video.id);
                          }}
                          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600"
                        >
                          {likedVideos.includes(video.id) ? (
                            <FaHeart className="text-red-500" size={18} />
                          ) : (
                            <FaRegHeart size={18} />
                          )}
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleBookmark(video.id);
                          }}
                          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600"
                        >
                          {bookmarkedVideos.includes(video.id) ? (
                            <FaBookmark className="text-yellow-500" size={18} />
                          ) : (
                            <FaRegBookmark size={18} />
                          )}
                        </motion.button>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedForPlaylist(video.id);
                            setShowPlaylistModal(true);
                          }}
                          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600"
                        >
                          <FaStar size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            shareVideo(video.id);
                          }}
                          className="p-2 rounded-full bg-slate-700 hover:bg-slate-600"
                        >
                          <FaShareAlt size={16} />
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Load More */}
            <div ref={loaderRef} className="py-8 flex justify-center">
              {hasMore || filteredVideos.length > paginatedVideos.length ? (
                <Button
                  onClick={() => setPage(prev => prev + 1)}
                  className="bg-red-500 hover:bg-red-600 px-6 py-3"
                >
                  Load More
                </Button>
              ) : (
                <p className="text-gray-400 py-4">All videos loaded ({videos.length} total)</p>
              )}
            </div>
          </>
        )}
      </main>
      
      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowVideoModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              className="bg-slate-800 rounded-xl overflow-hidden w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative pb-[56.25%]">
                <iframe
                  src={`https://www.youtube.com/embed/${selectedVideo.id}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute top-0 left-0 w-full h-full"
                ></iframe>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold">{selectedVideo.title}</h2>
                  <button 
                    onClick={() => setShowVideoModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="flex items-center">
                    <FaEye className="mr-2" />
                    <span>{selectedVideo.viewCount} views</span>
                  </div>
                  <div className="flex items-center">
                    <FaThumbsUp className="mr-2" />
                    <span>{selectedVideo.likeCount} likes</span>
                  </div>
                  <div className="flex items-center">
                    <FaCalendarAlt className="mr-2" />
                    <span>{formatDate(selectedVideo.rawPublishedAt)}</span>
                  </div>
                  <div className="flex items-center">
                    <FaClock className="mr-2" />
                    <span>{selectedVideo.duration}</span>
                  </div>
                </div>
                
                <p className="text-gray-300 mb-6">{selectedVideo.description.slice(0, 300)}...</p>
                
                <div className="flex gap-4">
                  <Button
                    onClick={() => toggleLike(selectedVideo.id)}
                    className={`flex items-center gap-2 ${
                      likedVideos.includes(selectedVideo.id)
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {likedVideos.includes(selectedVideo.id) ? (
                      <>
                        <FaHeart /> Liked
                      </>
                    ) : (
                      <>
                        <FaRegHeart /> Like
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => toggleBookmark(selectedVideo.id)}
                    className={`flex items-center gap-2 ${
                      bookmarkedVideos.includes(selectedVideo.id)
                        ? 'bg-yellow-600 hover:bg-yellow-700'
                        : 'bg-slate-700 hover:bg-slate-600'
                    }`}
                  >
                    {bookmarkedVideos.includes(selectedVideo.id) ? (
                      <>
                        <FaBookmark /> Bookmarked
                      </>
                    ) : (
                      <>
                        <FaRegBookmark /> Bookmark
                      </>
                    )}
                  </Button>
                  
                  <Button
                    onClick={() => downloadVideo()}
                    className="bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
                  >
                    <FaDownload /> Download
                  </Button>
                  
                  <Button
                    onClick={() => shareVideo(selectedVideo.id)}
                    className="bg-slate-700 hover:bg-slate-600 flex items-center gap-2"
                  >
                    <FaShareAlt /> Share
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Playlist Modal */}
      <AnimatePresence>
        {showPlaylistModal && selectedForPlaylist && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setShowPlaylistModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-slate-800 rounded-xl overflow-hidden w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Add to Playlist</h2>
                  <button 
                    onClick={() => setShowPlaylistModal(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    <FaTimes size={24} />
                  </button>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Existing Playlists</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.keys(playlists).map(playlist => (
                      <Button
                        key={playlist}
                        onClick={() => addToPlaylist(playlist, selectedForPlaylist)}
                        className="bg-slate-700 hover:bg-slate-600"
                      >
                        {playlist}
                      </Button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Create New Playlist</h3>
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      placeholder="Playlist name"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="bg-slate-700 border-slate-600"
                    />
                    <Button
                      onClick={createPlaylist}
                      className="bg-red-500 hover:bg-red-600"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Playlists Section */}
      {Object.keys(playlists).length > 0 && (
        <section className="max-w-7xl mx-auto px-4 pb-8">
          <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(playlists).map(([name, videoIds]) => (
              <div key={name} className="bg-slate-800/50 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                  <h3 className="font-bold text-lg flex justify-between">
                    <span>{name}</span>
                    <span className="text-gray-400">{videoIds.length} videos</span>
                  </h3>
                </div>
                <div className="p-4">
                  <div className="grid grid-cols-3 gap-2">
                    {videoIds.slice(0, 3).map(videoId => {
                      const video = videos.find(v => v.id === videoId);
                      return video ? (
                        <img 
                          key={videoId} 
                          src={video.thumbnail} 
                          alt="Thumbnail" 
                          className="aspect-video object-cover rounded"
                        />
                      ) : null;
                    })}
                    {videoIds.length > 3 && (
                      <div className="aspect-video bg-slate-700 flex items-center justify-center rounded">
                        +{videoIds.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}