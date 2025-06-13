'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo, useRef } from 'react'
import { Play, Heart, MessageCircle, Eye, ChevronDown, X } from 'lucide-react'

// Extend the Window interface to include onYouTubeIframeAPIReady
declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY
const CHANNEL_ID = 'UCJD-UtyBgYWqvmp_lknn7Lg'

type Video = {
  id: string
  title: string
  thumbnail: string
  views: number
  publishedAt: string
  likes: number
  comments: number
  duration: string
}

type ChannelStats = {
  subscriberCount: string
  viewCount: string
  videoCount: string
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

// Format date like YouTube
const formatPublishedDate = (publishedAt: string) => {
  const now = new Date()
  const publishedDate = new Date(publishedAt)
  const diffMs = now.getTime() - publishedDate.getTime()
  
  const diffSecs = Math.floor(diffMs / 1000)
  const diffMins = Math.floor(diffSecs / 60)
  const diffHours = Math.floor(diffMins / 60)
  const diffDays = Math.floor(diffHours / 24)
  const diffWeeks = Math.floor(diffDays / 7)
  const diffMonths = Math.floor(diffDays / 30)
  const diffYears = Math.floor(diffDays / 365)

  if (diffYears > 0) return `${diffYears} year${diffYears > 1 ? 's' : ''} ago`
  if (diffMonths > 0) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`
  if (diffWeeks > 0) return `${diffWeeks} week${diffWeeks > 1 ? 's' : ''} ago`
  if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`
  if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`
  if (diffMins > 0) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`
  return 'Just now'
}

export default function Episodes() {
  const [allVideos, setAllVideos] = useState<Video[]>([])
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'popularity' | 'likes' | 'comments'>('newest')
  const [isClient, setIsClient] = useState(false)
  const [showAllVideos, setShowAllVideos] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const videosPerPage = 12
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const playerInstance = useRef<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Detect client-side to prevent hydration errors
  useEffect(() => {
    setIsClient(true)
    // Load YouTube IFrame API
    const tag = document.createElement('script')
    tag.src = 'https://www.youtube.com/iframe_api'
    const firstScriptTag = document.getElementsByTagName('script')[0]
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag)

    // Initialize YouTube player when API is ready
    window.onYouTubeIframeAPIReady = initializePlayer

    return () => {
      if (playerInstance.current) {
        playerInstance.current.destroy()
      }
    }
  }, [])

  // Initialize YouTube player
  const initializePlayer = () => {
    if (playerRef.current && selectedVideo) {
      playerInstance.current = new (window as any).YT.Player(playerRef.current, {
        height: '100%',
        width: '100%',
        videoId: selectedVideo,
        playerVars: {
          playsinline: 1,
          autoplay: 1,
          modestbranding: 1,
          rel: 0
        },
        events: {
          'onReady': onPlayerReady,
          'onStateChange': onPlayerStateChange
        }
      })
    }
  }

  const onPlayerReady = (event: any) => {
    event.target.playVideo()
    setIsPlaying(true)
  }

  const onPlayerStateChange = (event: any) => {
    // Video ended (0) or paused (2)
    if (event.data === 0 || event.data === 2) {
      setIsPlaying(false)
    } 
    // Playing (1)
    else if (event.data === 1) {
      setIsPlaying(true)
    }
  }

  // When selected video changes
  useEffect(() => {
    if (selectedVideo) {
      if (playerInstance.current) {
        playerInstance.current.loadVideoById(selectedVideo)
        playerInstance.current.playVideo()
      } else {
        initializePlayer()
      }
    }
  }, [selectedVideo])

  // Close player
  const closePlayer = () => {
    setSelectedVideo(null)
    setIsPlaying(false)
    if (playerInstance.current) {
      playerInstance.current.stopVideo()
    }
  }

  // Fetch videos with enhanced data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch channel statistics
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        const channelData = await channelRes.json()
        const stats = channelData.items?.[0]?.statistics
        
        if (stats) {
          setChannelStats({
            subscriberCount: stats.subscriberCount,
            viewCount: stats.viewCount,
            videoCount: stats.videoCount
          })
        }

        // Get uploads playlist
        const channelDetailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        const channelDetailsData = await channelDetailsRes.json()
        const uploadsId = channelDetailsData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
        
        if (!uploadsId) {
          console.error('Uploads playlist not found')
          setLoading(false)
          return
        }

        // Get all videos from playlist
        const allVideosData: Video[] = []
        let nextPageToken = ''
        
        do {
          const playlistRes = await fetch(
            `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${uploadsId}&pageToken=${nextPageToken}&key=${API_KEY}`
          )
          const playlistData = await playlistRes.json()
          const items = playlistData.items || []
          nextPageToken = playlistData.nextPageToken || ''
          
          const videoIds = items.map((item: any) => item.snippet.resourceId?.videoId).filter(Boolean).join(',')

          // Get detailed video statistics
          if (videoIds) {
            const statsRes = await fetch(
              `https://www.googleapis.com/youtube/v3/videos?part=statistics,contentDetails,snippet&id=${videoIds}&key=${API_KEY}`
            )
            const statsData = await statsRes.json()

            // Parse duration from ISO 8601
            const parseDuration = (duration: string) => {
              const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/)
              if (!match) return ''
              
              const hours = parseInt(match[1]) || 0
              const minutes = parseInt(match[2]) || 0
              const seconds = parseInt(match[3]) || 0
              
              return [
                hours ? `${hours}:` : '',
                `${minutes.toString().padStart(hours ? 2 : 1, '0')}:`,
                `${seconds.toString().padStart(2, '0')}`
              ].join('')
            }

            const batchVideos: Video[] = statsData.items.map((item: any) => ({
              id: item.id,
              title: item.snippet.title,
              thumbnail: item.snippet.thumbnails.medium?.url || item.snippet.thumbnails.default.url,
              views: parseInt(item.statistics.viewCount) || 0,
              publishedAt: item.snippet.publishedAt,
              likes: parseInt(item.statistics.likeCount) || 0,
              comments: parseInt(item.statistics.commentCount) || 0,
              duration: parseDuration(item.contentDetails.duration)
            }))

            allVideosData.push(...batchVideos)
          }
        } while (nextPageToken)

        // Sort by published date to ensure oldest videos come first
        const sortedByDate = [...allVideosData].sort((a, b) => 
          new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
        )
        
        setAllVideos(sortedByDate)
      } catch (err) {
        console.error('Error fetching data', err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Sort videos based on selected criteria
  const sortedVideos = useMemo(() => {
    return [...allVideos].sort((a, b) => {
      if (sortBy === 'popularity') return b.views - a.views
      if (sortBy === 'likes') return b.likes - a.likes
      if (sortBy === 'comments') return b.comments - a.comments
      if (sortBy === 'newest') return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
      return new Date(a.publishedAt).getTime() - new Date(b.publishedAt).getTime()
    })
  }, [allVideos, sortBy])

  // Paginated videos
  const currentVideos = useMemo(() => {
    return sortedVideos.slice(0, currentPage * videosPerPage)
  }, [sortedVideos, currentPage])

  // Load more videos
  const loadMoreVideos = () => {
    setCurrentPage(prev => prev + 1)
    setShowAllVideos((currentPage + 1) * videosPerPage >= sortedVideos.length)
  }

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut"
      }
    },
    hover: {
      y: -8,
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      transition: { duration: 0.3, ease: "easeOut" }
    },
    tap: { scale: 0.98 }
  }

  // Skeleton loader
  if (loading) return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#0F1A24] py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-wrap gap-3 mb-8 animate-pulse">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-10 w-24 bg-gray-300 dark:bg-neutral-700 rounded-full"></div>
          ))}
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-neutral-900 rounded-xl overflow-hidden shadow-md">
              <div className="bg-gray-200 dark:bg-neutral-800 h-48 w-full animate-pulse"></div>
              <div className="p-4 space-y-2">
                <div className="h-5 bg-gray-200 dark:bg-neutral-800 rounded w-4/5 animate-pulse"></div>
                <div className="h-4 bg-gray-200 dark:bg-neutral-800 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F0F4F8] dark:bg-[#0F1A24]">
      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div 
              className="relative w-full max-w-4xl aspect-video bg-black rounded-xl overflow-hidden"
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
            >
              <div 
                ref={playerRef}
                className="w-full h-full"
                id="youtube-player"
              />
              
              <button 
                onClick={closePlayer}
                className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70 transition-colors"
              >
                <X size={24} />
              </button>
              
              <div className="absolute bottom-4 left-4 text-white text-lg font-medium">
                {allVideos.find(v => v.id === selectedVideo)?.title}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modern Hero Section */}
      <motion.div 
        className="relative overflow-hidden bg-gradient-to-br from-[#192937] via-[#2a4552] to-[#385666] text-white pt-24 pb-16 md:pt-32 md:pb-24"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Dynamic floating shapes */}
        <motion.div 
          className="absolute top-10 left-1/4 w-24 h-24 rounded-full bg-[#EAA632]/20 blur-xl"
          animate={{ 
            y: [0, 15, 0],
            scale: [1, 1.05, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/4 w-16 h-16 rounded-full bg-[#D94B2B]/20 blur-xl"
          animate={{ 
            y: [0, -20, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mb-6"
              >
                <motion.h1 
                  className="text-4xl md:text-6xl font-bold mb-4 leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <span className="block text-[#EAA632]">ወቸው GOOD</span>
                  <span className="text-white">የአዲሱ ትውልድ ድምፅ</span>
                </motion.h1>
                
                <motion.div 
                  className="text-xl md:text-2xl mb-8 max-w-2xl space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                >
                  <p>Ethiopia's most vibrant podcast channel filled with laughter, experiences, and ideas</p>
                  <p className="text-[#EAA632] font-medium">The voice of the new generation!</p>
                </motion.div>
              </motion.div>
              
              {/* Stats with animations */}
              {channelStats && (
                <motion.div 
                  className="flex flex-wrap gap-6 mb-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-[#EAA632] p-2 rounded-full">
                      <Eye className="text-white" size={24} />
                    </div>
                    <div>
                      <span className="text-2xl font-bold block">{formatNumber(parseInt(channelStats.subscriberCount))}</span>
                      <span className="text-sm opacity-90">Subscribers</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-[#D94B2B] p-2 rounded-full">
                      <Play className="text-white" size={24} />
                    </div>
                    <div>
                      <span className="text-2xl font-bold block">{formatNumber(parseInt(channelStats.viewCount))}</span>
                      <span className="text-sm opacity-90">Total Views</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="bg-[#385666] p-2 rounded-full">
                      <MessageCircle className="text-white" size={24} />
                    </div>
                    <div>
                      <span className="text-2xl font-bold block">{formatNumber(parseInt(channelStats.videoCount))}</span>
                      <span className="text-sm opacity-90">Total Videos</span>
                    </div>
                  </div>
                </motion.div>
              )}
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0, ease: "easeOut" }}
                className="flex flex-wrap gap-4"
              >
                {allVideos.length > 0 && (
                  <button 
                    onClick={() => setSelectedVideo(allVideos[0].id)}
                    className={`bg-[#EAA632] text-white px-6 py-3 rounded-full font-bold 
                      hover:bg-[#d6942a] transition-all shadow-lg flex items-center gap-2`}
                  >
                    <Play size={18} /> Watch Latest Episode
                  </button>
                )}
                
                <button className={`bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium 
                  hover:bg-white/10 transition-all flex items-center gap-2`}>
                  <Heart size={18} /> Subscribe
                </button>
              </motion.div>
            </div>
            
            <motion.div 
              className="flex-1 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-[#EAA632]/30 rounded-2xl blur-xl"></div>
                <div className="bg-gradient-to-br from-[#EAA632] to-[#D94B2B] p-1 rounded-2xl relative overflow-hidden">
                  {allVideos.length > 0 ? (
                    <img 
                      src={allVideos[0].thumbnail} 
                      alt="Latest episode" 
                      className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl cursor-pointer"
                      onClick={() => setSelectedVideo(allVideos[0].id)}
                    />
                  ) : (
                    <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-80 lg:h-96" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    onClick={() => allVideos.length > 0 && setSelectedVideo(allVideos[0].id)}>
                    <div className="w-16 h-16 rounded-full bg-[#EAA632] flex items-center justify-center">
                      <Play className="text-white ml-1" size={32} />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <motion.div 
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <span className="text-sm mb-2">Explore Episodes</span>
          <ChevronDown className="animate-bounce" />
        </motion.div>
      </motion.div>

      {/* Main Content */}
      <div className="py-12 px-4 max-w-7xl mx-auto">
        {/* Sorting Controls */}
        <motion.div 
          className="flex flex-wrap gap-3 mb-8 sticky top-4 z-10 py-2 bg-white/80 dark:bg-[#0F1A24]/80 backdrop-blur-sm rounded-xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, ease: "easeOut" }}
        >
          <button 
            onClick={() => setSortBy('newest')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${sortBy === 'newest' 
                ? 'bg-[#EAA632] text-white shadow-md' 
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
          >
            Newest First
          </button>
          
          <button 
            onClick={() => setSortBy('oldest')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${sortBy === 'oldest' 
                ? 'bg-[#EAA632] text-white shadow-md' 
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
          >
            Oldest First
          </button>
          
          <button 
            onClick={() => setSortBy('popularity')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${sortBy === 'popularity' 
                ? 'bg-[#EAA632] text-white shadow-md' 
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
          >
            Most Popular
          </button>
          
          <button 
            onClick={() => setSortBy('likes')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${sortBy === 'likes' 
                ? 'bg-[#EAA632] text-white shadow-md' 
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
          >
            <Heart size={16} /> Most Liked
          </button>
          
          <button 
            onClick={() => setSortBy('comments')}
            className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center gap-2
              ${sortBy === 'comments' 
                ? 'bg-[#EAA632] text-white shadow-md' 
                : 'bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-700'}`}
          >
            <MessageCircle size={16} /> Most Comments
          </button>
        </motion.div>

        {/* Stats Summary */}
        <motion.div 
          className="mb-8 bg-white dark:bg-neutral-900 rounded-2xl p-6 shadow-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Channel Insights</h3>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-[#F0F4F8] dark:bg-neutral-800 p-4 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Total Videos</div>
              <div className="text-2xl font-bold">{channelStats ? formatNumber(parseInt(channelStats.videoCount)) : '0'}</div>
            </div>
            <div className="bg-[#F0F4F8] dark:bg-neutral-800 p-4 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Oldest Video</div>
              <div className="text-lg font-bold">
                {allVideos.length > 0 
                  ? isClient ? formatPublishedDate(allVideos[0].publishedAt) : 'Loading...' 
                  : 'N/A'}
              </div>
            </div>
            <div className="bg-[#F0F4F8] dark:bg-neutral-800 p-4 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Most Views</div>
              <div className="text-lg font-bold">
                {allVideos.length > 0 
                  ? formatNumber(Math.max(...allVideos.map(v => v.views))) 
                  : '0'}
              </div>
            </div>
            <div className="bg-[#F0F4F8] dark:bg-neutral-800 p-4 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Most Likes</div>
              <div className="text-lg font-bold">
                {allVideos.length > 0 
                  ? formatNumber(Math.max(...allVideos.map(v => v.likes))) 
                  : '0'}
              </div>
            </div>
            <div className="bg-[#F0F4F8] dark:bg-neutral-800 p-4 rounded-xl">
              <div className="text-sm text-gray-600 dark:text-gray-300 mb-1">Most Comments</div>
              <div className="text-lg font-bold">
                {allVideos.length > 0 
                  ? formatNumber(Math.max(...allVideos.map(v => v.comments))) 
                  : '0'}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Video Grid */}
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <AnimatePresence>
            {currentVideos.map((video) => (
              <motion.div
                key={video.id}
                className="block group"
                variants={itemVariants}
                whileHover="hover"
                whileTap="tap"
                layout
              >
                <div 
                  className="bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden shadow-lg transition-all duration-300 h-full flex flex-col cursor-pointer"
                  onClick={() => setSelectedVideo(video.id)}
                >
                  {/* Thumbnail with duration badge */}
                  <div className="relative aspect-video">
                    <div className="relative h-full w-full overflow-hidden">
                      <img
                        src={video.thumbnail}
                        alt={video.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      
                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      
                      <div className="absolute bottom-3 right-3 bg-black/80 text-white text-xs px-2 py-1 rounded">
                        {video.duration}
                      </div>
                    </div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className={`w-14 h-14 rounded-full flex items-center justify-center bg-[#EAA632]`}>
                        <Play className="h-6 w-6 text-white ml-1 fill-current" />
                      </div>
                    </div>
                  </div>
                  
                  {/* Video Info */}
                  <div className="p-4 flex-grow flex flex-col">
                    <h3 className="font-bold text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-[#EAA632] transition-colors">
                      {video.title}
                    </h3>
                    
                    <div className="mt-auto">
                      {/* Stats row */}
                      <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          <span>{formatNumber(video.views)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Heart className="h-4 w-4" />
                          <span>{formatNumber(video.likes)}</span>
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{formatNumber(video.comments)}</span>
                        </div>
                        
                        <span>{isClient ? formatPublishedDate(video.publishedAt) : 'Loading...'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Load More Button */}
        {!showAllVideos && currentVideos.length < sortedVideos.length && (
          <motion.div 
            className="mt-12 flex justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <button 
              onClick={loadMoreVideos}
              className={`px-8 py-3.5 rounded-xl font-medium transition-all transform hover:scale-105
                bg-gradient-to-r from-[#EAA632] to-[#D94B2B] text-white shadow-lg flex items-center gap-2`}
            >
              Load More Videos
              <ChevronDown className="h-5 w-5" />
            </button>
          </motion.div>
        )}

        {/* All Videos Message */}
        {showAllVideos && (
          <div className="mt-12 text-center py-8 rounded-2xl bg-gradient-to-r from-[#F0F4F8] to-[#e6edf5] dark:from-[#1a2836] dark:to-[#192937]">
            <p className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
              You've viewed all {sortedVideos.length} episodes!
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="px-6 py-2.5 rounded-xl bg-[#385666] text-white hover:bg-[#2a4552] transition-colors"
            >
              Back to Top
            </button>
          </div>
        )}
      </div>

      {/* Brand Footer */}
      <div className="mt-16 py-10 px-4 bg-[#192937] text-white text-center">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <h2 className="text-3xl font-bold mb-4">ወቸው GOOD</h2>
            <p className="text-xl max-w-2xl mx-auto mb-8">
              Ethiopia's most vibrant podcast - where ideas flourish and laughter connects generations
            </p>
            <div className="text-[#EAA632] text-2xl font-bold mb-6">
              የአዲሱ ትውልድ ድምፅ!
            </div>
            <div className="flex justify-center gap-6">
              <button className="bg-[#EAA632] hover:bg-[#d6942a] px-6 py-2.5 rounded-full transition-colors">
                Subscribe
              </button>
              <button className="border-2 border-white hover:bg-white/10 px-6 py-2.5 rounded-full transition-colors">
                Contact Us
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}