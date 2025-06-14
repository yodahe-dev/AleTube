'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState, useMemo, useRef } from 'react'
import { Play, Heart, MessageCircle, Eye, ChevronDown } from 'lucide-react'
import confetti from 'canvas-confetti'

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY
const CHANNEL_ID = 'UCJD-UtyBgYWqvmp_lknn7Lg'

type ChannelStats = {
  subscriberCount: string
  viewCount: string
  videoCount: string
}

type Video = {
  id: string
  title: string
  thumbnail: string
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

// Custom hook for responsive design
const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState('')

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth
      if (width < 640) setBreakpoint('sm')
      else if (width < 768) setBreakpoint('md')
      else if (width < 1024) setBreakpoint('lg')
      else if (width < 1280) setBreakpoint('xl')
      else setBreakpoint('2xl')
    }

    window.addEventListener('resize', handleResize)
    handleResize()
    
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return breakpoint
}

// Waveform background component
const WaveBackground = () => (
  <div className="absolute inset-0 overflow-hidden -z-10">
    <motion.div 
      className="absolute top-0 left-0 w-[200%] h-full opacity-10"
      animate={{ x: ['0%', '-100%'] }}
      transition={{ 
        duration: 12,
        repeat: Infinity,
        ease: "linear"
      }}
    >
      <svg 
        viewBox="0 0 1200 120" 
        preserveAspectRatio="none" 
        className="w-full h-full"
      >
        <path 
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" 
          fill={brandColors.primary}
        ></path>
        <path 
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" 
          fill={brandColors.secondary}
          opacity="0.6"
        ></path>
        <path 
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" 
          fill={brandColors.accent}
          opacity="0.4"
        ></path>
      </svg>
    </motion.div>
  </div>
)

export default function HeroSection() {
  const breakpoint = useBreakpoint()
  const [channelStats, setChannelStats] = useState<ChannelStats | null>(null)
  const [latestVideo, setLatestVideo] = useState<Video | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriberCount, setSubscriberCount] = useState<number>(0)
  const prevSubscriberCount = useRef<number>(0)

  // Fetch channel stats and latest video
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
          
          // Update subscriber count with animation
          const newSubs = parseInt(stats.subscriberCount)
          setSubscriberCount(newSubs)
          
          // Check for milestone
          const milestones = [10000, 50000, 100000, 500000, 1000000]
          const prev = prevSubscriberCount.current
          prevSubscriberCount.current = newSubs
          
          milestones.forEach(m => {
            if (prev < m && newSubs >= m) {
              // Trigger confetti
              confetti({
                particleCount: 150,
                spread: 70,
                origin: { y: 0.6 }
              })
            }
          })
        }

        // Get the latest video from the uploads playlist
        const channelDetailsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=contentDetails&id=${CHANNEL_ID}&key=${API_KEY}`
        )
        const channelDetailsData = await channelDetailsRes.json()
        const uploadsId = channelDetailsData.items?.[0]?.contentDetails?.relatedPlaylists?.uploads
        
        if (!uploadsId) {
          setError('Uploads playlist not found')
          return
        }

        // Get the latest video from the playlist
        const playlistRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=1&playlistId=${uploadsId}&key=${API_KEY}`
        )
        const playlistData = await playlistRes.json()
        const latestItem = playlistData.items?.[0]?.snippet
        
        if (latestItem) {
          setLatestVideo({
            id: latestItem.resourceId.videoId,
            title: latestItem.title,
            thumbnail: latestItem.thumbnails.medium?.url || latestItem.thumbnails.default.url
          })
        }
      } catch (err) {
        setError('Failed to fetch data')
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Update subscriber count every 30 seconds
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [])

  // Animation variants for text
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
        duration: 0.5,
        ease: "easeOut"
      }
    }
  }

  // Handle play video
  const handlePlayVideo = (videoId: string) => {
    // For demo purposes, open in new tab
    window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')
  }

  return (
    <motion.div 
      className="relative overflow-hidden bg-gradient-to-br from-[#192937] via-[#2a4552] to-[#385666] text-white pt-24 pb-16 md:pt-32 md:pb-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <WaveBackground />
      
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
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.span 
                  className="block text-[#EAA632]"
                  variants={itemVariants}
                >
                  ወቸው GOOD
                </motion.span>
                <motion.span 
                  className="text-white"
                  variants={itemVariants}
                >
                  የአዲሱ ትውልድ ድምፅ
                </motion.span>
              </motion.h1>
              
              <motion.div 
                className="text-xl md:text-2xl mb-8 max-w-2xl space-y-3"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
              >
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Ethiopia's most vibrant podcast channel filled with laughter, experiences, and ideas
                </motion.p>
                <motion.p 
                  className="text-[#EAA632] font-medium"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0 }}
                >
                  The voice of the new generation!
                </motion.p>
              </motion.div>
            </motion.div>
            
            {/* Stats with animations */}
            {channelStats && (
              <motion.div 
                className="flex flex-wrap gap-6 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-[#EAA632] p-2 rounded-full">
                    <Eye className="text-white" size={24} />
                  </div>
                  <div>
                    <motion.span 
                      className="text-2xl font-bold block"
                      key={subscriberCount}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {formatNumber(subscriberCount)}
                    </motion.span>
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
              transition={{ delay: 1.4, ease: "easeOut" }}
              className="flex flex-wrap gap-4"
            >
              {latestVideo && (
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePlayVideo(latestVideo.id)}
                  className={`bg-[#EAA632] text-white px-6 py-3 rounded-full font-bold 
                    hover:bg-[#d6942a] transition-all shadow-lg flex items-center gap-2`}
                >
                  <Play size={18} /> Watch Latest Episode
                </motion.button>
              )}
              
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`bg-transparent border-2 border-white text-white px-6 py-3 rounded-full font-medium 
                  hover:bg-white/10 transition-all flex items-center gap-2`}
              >
                <Heart size={18} /> Subscribe
              </motion.button>
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
                {latestVideo ? (
                  <div className="relative">
                    <img 
                      src={latestVideo.thumbnail} 
                      alt="Latest episode" 
                      className="w-full h-64 md:h-80 lg:h-96 object-cover rounded-xl cursor-pointer"
                      onClick={() => handlePlayVideo(latestVideo.id)}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                      onClick={() => handlePlayVideo(latestVideo.id)}>
                      <motion.div 
                        className="w-16 h-16 rounded-full bg-[#EAA632] flex items-center justify-center"
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <Play className="text-white ml-1" size={32} />
                      </motion.div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64 md:h-80 lg:h-96" />
                )}
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
  )
}