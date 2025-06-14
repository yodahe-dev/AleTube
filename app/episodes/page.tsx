'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState, useEffect, useMemo, useRef } from 'react'
import { Play, Heart, ChevronDown, Search, Filter, X, ArrowDown, ArrowUp, Star, Eye } from 'lucide-react'

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY
const CHANNEL_ID = 'UCJD-UtyBgYWqvmp_lknn7Lg'

type Video = {
  id: string
  title: string
  thumbnail: string
  publishedAt: string
  viewCount: string
  duration: string
}

// Ethiopian-inspired colors with modern twist
const brandColors = {
  primary: '#EAA632',     // Gold/Yellow
  dark: '#192937',        // Deep Blue
  secondary: '#385666',   // Teal
  accent: '#D94B2B',      // Terracotta
  light: '#F0F4F8'        // Light background
}

// Format numbers like YouTube (1K, 1M, etc.)
const formatNumber = (num: number): string => {
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B'
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M'
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K'
  return num.toString()
}

// More robust duration formatting
const formatDuration = (duration: string): string => {
  if (!duration) return '0:00'
  
  try {
    // Extract time components
    const hoursMatch = duration.match(/(\d+)H/)
    const minutesMatch = duration.match(/(\d+)M/)
    const secondsMatch = duration.match(/(\d+)S/)
    
    const hours = hoursMatch ? parseInt(hoursMatch[1]) : 0
    const minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0
    const seconds = secondsMatch ? parseInt(secondsMatch[1]) : 0
    
    // Format based on components
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
    }
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  } catch (e) {
    console.error('Error formatting duration:', duration, e)
    return '0:00'
  }
}

export default function EpisodesPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popular'>('newest')
  const [searchQuery, setSearchQuery] = useState('')
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Fetch videos from the channel
  useEffect(() => {
    const fetchVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        // Get the uploads playlist ID
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        const channelData = await channelRes.json()
        const uploadsId = channelData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
        
        if (!uploadsId) {
          setError('Uploads playlist not found')
          return
        }

        // Get videos from the playlist
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsId}&key=${API_KEY}`
        )
        const playlistData = await playlistRes.json()
        
        // Get video IDs for fetching details
        const videoIds = playlistData.items.map((item: any) => item.snippet.resourceId.videoId).join(',')
        
        // Get video details (including duration and view count)
        const videosRes = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
        )
        const videosData = await videosRes.json()
        
        // Format videos data with error handling
        const formattedVideos = videosData.items.map((item: any) => {
          // Handle missing view count
          const viewCount = item.statistics?.viewCount ? 
            formatNumber(parseInt(item.statistics.viewCount)) : 
            'N/A'
          
          // Handle missing duration
          const duration = item.contentDetails?.duration ? 
            formatDuration(item.contentDetails.duration) : 
            '0:00'
          
          return {
            id: item.id,
            title: item.snippet.title,
            thumbnail: item.snippet.thumbnails?.medium?.url || 
                     item.snippet.thumbnails?.default?.url || 
                     '/default-thumbnail.jpg',
            publishedAt: item.snippet.publishedAt,
            viewCount,
            duration
          }
        })
        
        setVideos(formattedVideos)
      } catch (err) {
        setError('Failed to fetch videos. Please check your network connection and try again.')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [])

  // Filter and sort videos
  const filteredVideos = useMemo(() => {
    let result = [...videos]
    
    // Apply search filter
    if (searchQuery) {
      result = result.filter(video => 
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }
    
    // Apply sorting
    if (sortBy === 'newest') {
      result.sort((a, b) => 
        new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      )
    } else if (sortBy === 'oldest') {
      result.sort((a, b) => 
        new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
      )
    } else if (sortBy === 'popular') {
      result.sort((a, b) => {
        // Handle non-numeric view counts
        const aViews = a.viewCount === 'N/A' ? 0 : parseInt(a.viewCount.replace(/[^0-9]/g, ''))
        const bViews = b.viewCount === 'N/A' ? 0 : parseInt(b.viewCount.replace(/[^0-9]/g, ''))
        return bViews - aViews
      })
    }
    
    return result
  }, [videos, searchQuery, sortBy])

  // Focus search input when filter menu is opened
  useEffect(() => {
    if (showFilters && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [showFilters])

  // Handle play video
  const handlePlayVideo = (videoId: string) => {
    if (playingVideoId === videoId) {
      setPlayingVideoId(null)
    } else {
      setPlayingVideoId(videoId)
    }
  }

  // Handle scroll to top
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Format date to avoid hydration mismatch
  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    } catch (e) {
      return dateString.substring(0, 10) // Fallback to YYYY-MM-DD
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#192937] to-[#2a4552] text-white">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-[#192937]/90 backdrop-blur-md border-b border-[#385666]">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#EAA632] to-[#D94B2B] flex items-center justify-center">
              <Play size={20} />
            </div>
            <h1 className="text-xl md:text-2xl font-bold">
              <span className="text-[#EAA632]">ወቸው GOOD</span> Episodes
            </h1>
          </motion.div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 bg-[#385666] px-4 py-2 rounded-full hover:bg-[#2a4552] transition-colors"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Filter size={18} />
            <span className="hidden md:inline">Filters</span>
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
            className="bg-[#192937] border-b border-[#385666] overflow-hidden"
          >
            <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search episodes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#2a4552] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#EAA632]"
                />
              </div>
              
              <div className="flex flex-wrap gap-3">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('newest')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'newest' 
                      ? 'bg-[#EAA632] text-[#192937]' 
                      : 'bg-[#385666] hover:bg-[#2a4552]'
                  }`}
                >
                  <ArrowDown size={16} />
                  <span>Newest</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('oldest')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'oldest' 
                      ? 'bg-[#EAA632] text-[#192937]' 
                      : 'bg-[#385666] hover:bg-[#2a4552]'
                  }`}
                >
                  <ArrowUp size={16} />
                  <span>Oldest</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSortBy('popular')}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    sortBy === 'popular' 
                      ? 'bg-[#EAA632] text-[#192937]' 
                      : 'bg-[#385666] hover:bg-[#2a4552]'
                  }`}
                >
                  <Star size={16} />
                  <span>Popular</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setSearchQuery('')
                    setSortBy('newest')
                  }}
                  className="px-4 py-2 rounded-lg bg-[#385666] hover:bg-[#2a4552] flex items-center gap-2"
                >
                  <X size={16} />
                  <span>Reset</span>
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="flex justify-center items-center min-h-[50vh]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#EAA632]"></div>
            <span className="sr-only">Loading...</span>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <div className="bg-[#D94B2B]/20 p-6 rounded-xl inline-block">
              <h2 className="text-xl font-bold mb-2">Error Loading Videos</h2>
              <p className="mb-4">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="bg-[#EAA632] text-[#192937] px-4 py-2 rounded-lg font-medium hover:bg-[#d6942a]"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : filteredVideos.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-[#385666]/20 p-6 rounded-xl inline-block">
              <h2 className="text-xl font-bold mb-2">No Episodes Found</h2>
              <p className="mb-4">Try adjusting your search or filters</p>
              <button 
                onClick={() => {
                  setSearchQuery('')
                  setSortBy('newest')
                }}
                className="bg-[#EAA632] text-[#192937] px-4 py-2 rounded-lg font-medium hover:bg-[#d6942a]"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVideos.map((video) => (
                <motion.div
                  key={video.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="bg-[#192937]/50 backdrop-blur-sm rounded-xl overflow-hidden border border-[#385666] hover:border-[#EAA632] transition-all duration-300 hover:shadow-lg hover:shadow-[#EAA632]/20"
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
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-center justify-center">
                          <div className="absolute top-3 right-3 bg-black/70 px-2 py-1 rounded-md text-sm">
                            {video.duration}
                          </div>
                          <div className="w-14 h-14 rounded-full bg-[#EAA632] flex items-center justify-center">
                            <Play className="text-white ml-1" size={24} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4">
                    <h3 className="font-bold text-lg mb-2 line-clamp-2 h-14">{video.title}</h3>
                    <div className="flex justify-between items-center text-sm text-gray-300">
                      <div className="flex items-center gap-1">
                        <Eye size={14} />
                        <span>{video.viewCount} views</span>
                      </div>
                      <span>
                        {formatDate(video.publishedAt)}
                      </span>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePlayVideo(video.id)}
                        className={`flex-1 text-center py-2 rounded-lg ${
                          playingVideoId === video.id
                            ? 'bg-[#D94B2B] hover:bg-[#c53a1f]'
                            : 'bg-[#385666] hover:bg-[#2a4552]'
                        }`}
                      >
                        {playingVideoId === video.id ? 'Stop' : 'Play'}
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-2 bg-[#385666] rounded-lg hover:bg-[#2a4552]"
                      >
                        <Heart size={18} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination/Info */}
            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-300">
                Showing {filteredVideos.length} of {videos.length} episodes
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-4 py-2 bg-[#385666] rounded-lg hover:bg-[#2a4552] flex items-center gap-2"
                >
                  <ChevronDown size={16} />
                  <span>Load More</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={scrollToTop}
                  className="px-4 py-2 bg-[#EAA632] text-[#192937] rounded-lg hover:bg-[#d6942a] flex items-center gap-2"
                >
                  <ArrowUp size={16} />
                  <span>Back to Top</span>
                </motion.button>
              </div>
            </div>
          </>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-[#192937] border-t border-[#385666] py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span className="text-[#EAA632]">ወቸው GOOD</span> Podcast
              </h2>
              <p className="text-gray-400 mt-2 max-w-md">
                Ethiopia's most vibrant podcast channel filled with laughter, experiences, and ideas. 
                The voice of the new generation!
              </p>
            </div>
            
            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-[#385666] flex items-center justify-center hover:bg-[#2a4552]"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-[#385666] flex items-center justify-center hover:bg-[#2a4552]"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 rounded-full bg-[#385666] flex items-center justify-center hover:bg-[#2a4552]"
              >
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-6 h-6" />
              </motion.button>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-[#385666] text-center text-gray-500 text-sm">
            © {new Date().getFullYear()} ወቸው GOOD Podcast. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}