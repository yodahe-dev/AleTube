'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaCrown, FaStar, FaRocket, FaGem, FaShieldAlt, FaVideo, FaUsers, FaGift, FaCheck, FaHandshake, FaRegSmile, FaRegLightbulb, FaRegClock, FaQuoteLeft } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

export default function PackagesPage() {
  type ChannelData = {
    snippet?: {
      thumbnails?: {
        high?: { url?: string }
      }
    },
    statistics?: {
      viewCount?: string | number,
      subscriberCount?: string | number
    },
    brandingSettings?: {
      image?: {
        bannerExternalUrl?: string
      }
    }
  };

  const [channelData, setChannelData] = useState<ChannelData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('sponsors');
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const packagesRef = useRef<HTMLDivElement>(null);
  const [isInitial, setIsInitial] = useState(true);
  
  useEffect(() => {
    const fetchChannelData = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_YT_API_KEY;
        const channelId = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics,brandingSettings&id=${channelId}&key=${apiKey}`
        );
        
        if (!response.ok) {
          throw new Error('Failed to fetch channel data');
        }
        
        const data = await response.json();
        if (data.items && data.items.length > 0) {
          setChannelData(data.items[0]);
        }
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError(String(err));
        }
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, []);

  useEffect(() => {
    if (isInitial) {
      setIsInitial(false);
      return;
    }
    
    // Smooth scroll to packages section
    setTimeout(() => {
      if (packagesRef.current) {
        packagesRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  }, [activeTab]);

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg inline-block">
            <p>Error loading channel data: {error}</p>
            <p className="mt-2 text-sm">Please check your API key and channel ID</p>
          </div>
        </div>
      </div>
    );
  }

  const formatNumber = (num: string | number | null) => {
    if (!num) return '0';
    return parseInt(num.toString()).toLocaleString('en-US');
  };

  // Testimonial data
  const testimonials = [
    {
      name: "Selam Tadesse",
      role: "Marketing Director, Safaricom Ethiopia",
      quote: "Partnering with Aletube transformed our brand awareness. We saw a 150% increase in engagement within just two months!",
      rating: 5
    },
    {
      name: "Kaleb Wolde",
      role: "Brand Manager, Ethiopian Airlines",
      quote: "The creative integration of our services in Aletube's content felt authentic and resonated perfectly with our target audience.",
      rating: 5
    },
    {
      name: "Meron Abebe",
      role: "Digital Strategist, Dashen Bank",
      quote: "Aletube's audience engagement is unmatched. Our campaign generated the highest ROI we've ever seen from influencer marketing.",
      rating: 5
    }
  ];

  // Package data (converted to ETB)
  const sponsorPackages = [
    {
      id: "bronze",
      title: "Bronze Partner",
      price: "15,000 ETB",
      duration: "/month",
      featured: false,
      highlight: "Perfect for startups",
      icon: <FaRegSmile className="text-amber-600" />,
      features: [
        "Logo placement in video descriptions",
        "Mention in 1 video/month",
        "Social media shoutout",
        "Basic analytics report",
        "Aletube thank you badge"
      ]
    },
    {
      id: "silver",
      title: "Silver Partner",
      price: "45,000 ETB",
      duration: "/month",
      featured: true,
      highlight: "Most popular choice",
      icon: <FaStar className="text-gray-300" />,
      features: [
        "Logo in video end screens",
        "Mention in 3 videos/month",
        "Dedicated social media post",
        "Detailed analytics report",
        "60-second product showcase",
        "Early access to content"
      ]
    },
    {
      id: "gold",
      title: "Gold Partner",
      price: "90,000 ETB",
      duration: "/month",
      featured: false,
      highlight: "Premium visibility",
      icon: <FaGem className="text-yellow-400" />,
      features: [
        "Logo in video intro",
        "Mention in every video",
        "Dedicated video segment",
        "Premium analytics dashboard",
        "Product integration in videos",
        "Exclusive behind-the-scenes",
        "Monthly strategy call"
      ]
    },
    {
      id: "platinum",
      title: "Platinum Partner",
      price: "Custom ETB",
      duration: "",
      featured: false,
      highlight: "Ultimate collaboration",
      icon: <FaCrown className="text-purple-500" />,
      features: [
        "Co-branded content series",
        "Executive producer credit",
        "Full episode sponsorship",
        "Dedicated campaign manager",
        "Custom content creation",
        "Priority access to Aletube",
        "Exclusive events invitation"
      ]
    }
  ];

  const followerPackages = [
    {
      id: "fan",
      title: "Super Fan",
      price: "150 ETB",
      duration: "/month",
      icon: <FaRegLightbulb className="text-blue-400" />,
      features: [
        "Exclusive emojis & badges",
        "Early video access (24hr)",
        "Members-only live chats",
        "Behind-the-scenes content",
        "Monthly fan Q&A access"
      ]
    },
    {
      id: "ultimate",
      title: "Ultimate Fan",
      price: "300 ETB",
      duration: "/month",
      icon: <FaRocket className="text-purple-500" />,
      features: [
        "All Super Fan benefits",
        "Early video access (48hr)",
        "Exclusive video content",
        "Personalized shoutouts",
        "Monthly fan Zoom call",
        "Limited edition merch"
      ]
    },
    {
      id: "legend",
      title: "Legendary Fan",
      price: "750 ETB",
      duration: "/month",
      icon: <FaShieldAlt className="text-yellow-500" />,
      features: [
        "All Ultimate Fan benefits",
        "Early video access (72hr)",
        "Video call with Aletube",
        "Influence content topics",
        "Autographed merchandise",
        "VIP event invitations",
        "Legendary fan status"
      ]
    }
  ];

  const specialPackages = [
    {
      id: "content",
      title: "Content Collaboration",
      price: "Custom ETB",
      description: "Co-create content with Aletube",
      icon: <FaVideo className="text-red-500" />,
      features: [
        "Custom video production",
        "Cross-promotion strategy",
        "Shared audience growth",
        "Creative concept development",
        "Multi-platform distribution"
      ]
    },
    {
      id: "influence",
      title: "Influence Amplifier",
      price: "Custom ETB",
      description: "Maximize your brand influence",
      icon: <FaUsers className="text-green-500" />,
      features: [
        "Social media takeover",
        "Product challenge series",
        "Influencer networking",
        "Brand ambassador program",
        "Community building strategy"
      ]
    },
    {
      id: "legacy",
      title: "Legacy Partner",
      price: "Custom ETB",
      description: "Long-term strategic partnership",
      icon: <FaRegClock className="text-indigo-500" />,
      features: [
        "Year-round sponsorship",
        "Priority in all content",
        "Executive producer role",
        "Dedicated creative team",
        "Co-branded merchandise",
        "Annual retreat invitation"
      ]
    }
  ];

  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6, 
        ease: "easeOut" 
      }
    }
  };

  const staggerChildren = {
    visible: { 
      transition: { 
        staggerChildren: 0.1 
      } 
    }
  };

  const cardHover = {
    hover: { 
      y: -10,
      transition: { 
        duration: 0.3, 
        ease: "easeOut" 
      }
    }
  };

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 text-white overflow-x-hidden">
      {/* Hero Section */}
      <motion.div 
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
        className="relative py-28 md:py-36 overflow-hidden"
      >
        <div className="absolute inset-0">
          {channelData?.brandingSettings?.image?.bannerExternalUrl && (
            <div 
              className="absolute inset-0 bg-cover bg-center"
              style={{ 
                backgroundImage: `url(${channelData.brandingSettings.image.bannerExternalUrl})`,
                filter: 'blur(4px) brightness(0.3) saturate(1.2)'
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.1)_0%,transparent_70%)]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center">
          <motion.div variants={fadeIn} className="mb-8">
            <div className="flex justify-center mb-6">
              {loading ? (
                <Skeleton className="w-32 h-32 rounded-full" />
              ) : channelData?.snippet?.thumbnails?.high?.url ? (
                <motion.img 
                  src={channelData.snippet.thumbnails.high.url} 
                  alt="Channel Profile"
                  className="w-32 h-32 rounded-full border-4 border-white shadow-xl"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                />
              ) : (
                <div className="bg-gray-200 border-2 border-dashed rounded-full w-32 h-32" />
              )}
            </div>
            
            <motion.div 
              className="inline-flex items-center bg-red-900/30 text-red-300 px-4 py-1 rounded-full mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <FaHandshake className="mr-2" />
              Premium Partnerships
            </motion.div>
            
            <motion.h1 
              className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Aletube Sponsorship Packages
            </motion.h1>
            
            <motion.p 
              className="text-xl text-gray-300 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Join forces with Ethiopia's top YouTube channel to reach millions of engaged viewers
            </motion.p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-4 mt-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={() => handleTabChange("sponsors")}
              variant={activeTab === "sponsors" ? "default" : "secondary"}
              className="px-6 py-3 rounded-full font-medium transition-all bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900"
            >
              For Sponsors
            </Button>
            <Button 
              onClick={() => handleTabChange("followers")}
              variant={activeTab === "followers" ? "default" : "secondary"}
              className="px-6 py-3 rounded-full font-medium transition-all bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900"
            >
              For Followers
            </Button>
            <Button 
              onClick={() => handleTabChange("special")}
              variant={activeTab === "special" ? "default" : "secondary"}
              className="px-6 py-3 rounded-full font-medium transition-all bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900"
            >
              Special Programs
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Stats Section */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-12"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16"
          variants={staggerChildren}
        >
          {[
            { 
              value: channelData?.statistics?.viewCount ? formatNumber(channelData.statistics.viewCount) + "+" : "0+", 
              label: "Total Views",
              gradient: "from-red-400 to-red-600"
            },
            { 
              value: channelData?.statistics?.subscriberCount ? formatNumber(channelData.statistics.subscriberCount) : "0", 
              label: "Subscribers",
              gradient: "from-blue-400 to-cyan-500"
            },
            { 
              value: "86%", 
              label: "Engagement Rate",
              gradient: "from-purple-400 to-fuchsia-500"
            },
            { 
              value: "200+", 
              label: "Brands Partnered",
              gradient: "from-green-400 to-emerald-500"
            }
          ].map((stat, index) => (
            <motion.div 
              key={index}
              className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 text-center hover:border-red-500 transition-colors"
              variants={fadeIn}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className={`text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r ${stat.gradient}`}>
                {loading ? <Skeleton className="h-10 w-24 mx-auto" /> : stat.value}
              </div>
              <div className="text-gray-400 mt-2">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Tab Content */}
      <div ref={packagesRef}>
        <AnimatePresence mode="wait">
          <motion.div 
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Sponsor Packages */}
            {activeTab === "sponsors" && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div 
                  className="text-center mb-16"
                  variants={fadeIn}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-red-600">
                    Sponsor Packages
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Premium sponsorship opportunities designed for Ethiopian brands
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  {sponsorPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      variants={cardHover}
                      whileHover="hover"
                      className={`relative rounded-2xl overflow-hidden border-2 ${
                        pkg.featured 
                          ? "border-red-500 shadow-xl shadow-red-500/20 z-10"
                          : "border-slate-700"
                      }`}
                    >
                      {pkg.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold px-3 py-1 rounded-full text-sm">
                          MOST POPULAR
                        </div>
                      )}
                      <div className={`p-6 h-full flex flex-col ${
                        pkg.id === "bronze" ? "bg-gradient-to-br from-amber-900/20 to-slate-900" :
                        pkg.id === "silver" ? "bg-gradient-to-br from-slate-800 to-slate-900" :
                        pkg.id === "gold" ? "bg-gradient-to-br from-yellow-900/20 to-slate-900" :
                        "bg-gradient-to-br from-purple-900/20 to-slate-900"
                      }`}>
                        <div>
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-3">{pkg.icon}</div>
                            <h3 className="text-xl font-bold">{pkg.title}</h3>
                          </div>
                          
                          <div className="mb-6">
                            <div className="text-4xl font-bold mb-1">{pkg.price}</div>
                            <div className="text-gray-400">{pkg.duration}</div>
                            <div className="text-sm text-red-400 mt-2">{pkg.highlight}</div>
                          </div>
                          
                          <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-auto">
                          <Button 
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`w-full py-3 rounded-lg font-medium transition-all ${
                              pkg.featured 
                                ? "bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                                : "bg-slate-700 hover:bg-slate-600"
                            }`}
                          >
                            Select Package
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Follower Packages */}
            {activeTab === "followers" && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div 
                  className="text-center mb-16"
                  variants={fadeIn}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-500">
                    Fan Memberships
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Exclusive perks for our most dedicated Ethiopian fans
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                  {followerPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      variants={cardHover}
                      whileHover="hover"
                      className={`relative rounded-2xl overflow-hidden border-2 ${
                        pkg.id === "ultimate" 
                          ? "border-purple-500 shadow-xl shadow-purple-500/20 z-10"
                          : "border-slate-700"
                      }`}
                    >
                      {pkg.id === "ultimate" && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold px-3 py-1 rounded-full text-sm">
                          RECOMMENDED
                        </div>
                      )}
                      <div className={`p-6 h-full flex flex-col ${
                        pkg.id === "fan" ? "bg-gradient-to-br from-blue-900/20 to-slate-900" :
                        pkg.id === "ultimate" ? "bg-gradient-to-br from-purple-900/20 to-slate-900" :
                        "bg-gradient-to-br from-amber-900/20 to-slate-900"
                      }`}>
                        <div>
                          <div className="flex items-center mb-4">
                            <div className="text-3xl mr-3">{pkg.icon}</div>
                            <h3 className="text-xl font-bold">{pkg.title}</h3>
                          </div>
                          
                          <div className="mb-6">
                            <div className="text-4xl font-bold mb-1">{pkg.price}</div>
                            <div className="text-gray-400">{pkg.duration}</div>
                          </div>
                          
                          <ul className="space-y-3 mb-8">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-auto">
                          <Button 
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`w-full py-3 rounded-lg font-medium transition-all ${
                              pkg.id === "ultimate"
                                ? "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
                                : "bg-slate-700 hover:bg-slate-600"
                            }`}
                          >
                            Become a Member
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Special Packages */}
            {activeTab === "special" && (
              <div className="max-w-7xl mx-auto px-4 py-8">
                <motion.div 
                  className="text-center mb-16"
                  variants={fadeIn}
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-teal-500">
                    Special Programs
                  </h2>
                  <p className="text-gray-400 max-w-2xl mx-auto">
                    Custom partnerships for unique Ethiopian collaborations
                  </p>
                </motion.div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {specialPackages.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      variants={cardHover}
                      whileHover="hover"
                      className="relative rounded-2xl overflow-hidden border-2 border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900"
                    >
                      <div className="p-8 h-full flex flex-col">
                        <div className="text-5xl mb-4">{pkg.icon}</div>
                        <h3 className="text-2xl font-bold mb-2">{pkg.title}</h3>
                        <p className="text-gray-400 mb-6">{pkg.description}</p>
                        
                        <div className="mb-8">
                          <div className="text-xl font-bold mb-4">Key Features:</div>
                          <ul className="space-y-3">
                            {pkg.features.map((feature, idx) => (
                              <li key={idx} className="flex items-start">
                                <FaCheck className="text-green-500 mt-1 mr-2 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                        
                        <div className="mt-auto">
                          <Button 
                            onClick={() => setSelectedPackage(pkg.id)}
                            className={`w-full py-3 rounded-lg font-medium transition-all ${
                              pkg.id === "legacy"
                                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                                : "bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700"
                            }`}
                          >
                            Request Proposal
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Testimonials */}
      <motion.div 
        className="max-w-7xl mx-auto px-4 py-16 mt-16 border-t border-slate-800"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.div 
          className="text-center mb-16"
          variants={fadeIn}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trusted by Industry Leaders</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Hear from brands that have transformed their reach through Aletube partnerships
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div 
              key={index}
              variants={fadeIn}
              whileHover={{ y: -10 }}
              className="bg-slate-800/30 backdrop-blur-sm p-6 rounded-2xl border border-slate-700 hover:border-red-500 transition-colors"
            >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-red-500 to-red-700 flex items-center justify-center mr-4">
                  <FaQuoteLeft className="text-white" />
                </div>
                <div>
                  <div className="font-bold">{testimonial.name}</div>
                  <div className="text-gray-400 text-sm">{testimonial.role}</div>
                </div>
              </div>
              <p className="text-gray-300 italic mb-4">"{testimonial.quote}"</p>
              <div className="flex">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <FaStar key={i} className="text-yellow-400" />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* FAQ */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-16"
        initial="hidden"
        animate="visible"
        variants={staggerChildren}
      >
        <motion.h2 
          className="text-3xl md:text-4xl font-bold text-center mb-16"
          variants={fadeIn}
        >
          Frequently Asked Questions
        </motion.h2>
        
        <div className="space-y-6">
          {[
            {
              question: "How long does it take to set up a sponsorship?",
              answer: "Most sponsorships can be activated within 3-5 business days after agreement. Custom packages may require additional time for planning and integration."
            },
            {
              question: "Can I customize a sponsorship package?",
              answer: "Absolutely! Our Platinum and Custom packages are fully customizable to meet your specific marketing goals and budget requirements."
            },
            {
              question: "What audience demographics does Aletube reach?",
              answer: "Our audience is primarily tech-savvy millennials and Gen Z (18-34 years), with 65% male, 35% female, and a global reach across North America, Europe, and Asia."
            },
            {
              question: "How do follower memberships support the channel?",
              answer: "Follower memberships provide direct support that helps us create higher quality content, invest in better equipment, and maintain our independence."
            },
            {
              question: "What analytics do sponsors receive?",
              answer: "Depending on your package, you'll receive detailed analytics including impressions, click-through rates, engagement metrics, and audience demographics."
            }
          ].map((faq, index) => (
            <motion.div 
              key={index} 
              className="border-b border-slate-700 pb-6"
              variants={fadeIn}
            >
              <button 
                className="flex justify-between items-center w-full text-left font-medium text-lg hover:text-red-400 transition-colors"
                onClick={(e) => {
                  const content = e.currentTarget.nextElementSibling as HTMLElement;
                  content.style.maxHeight = content.style.maxHeight ? "" : `${content.scrollHeight}px`;
                }}
              >
                {faq.question}
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </button>
              <div className="overflow-hidden transition-all max-h-0">
                <p className="pt-4 text-gray-400">{faq.answer}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div 
        className="max-w-4xl mx-auto px-4 py-16 text-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-3xl p-8 md:p-12 border border-slate-700 relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-500 rounded-full filter blur-[100px] opacity-20" />
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-500 rounded-full filter blur-[100px] opacity-20" />
          
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Partner with Aletube?</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join Ethiopia's top brands and thousands of fans supporting premium content
            </p>
            <Button className="bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 px-8 rounded-full text-lg transition-all transform hover:scale-105">
              Contact Our Partnership Team
            </Button>
            <p className="text-gray-400 mt-4">Response within 24 hours</p>
          </div>
        </div>
      </motion.div>

      {/* Footer */}
      <motion.footer 
        className="border-t border-slate-800 py-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="text-2xl font-bold mb-4">Aletube Partnerships</div>
          <p className="text-gray-400 max-w-2xl mx-auto mb-8">
            Premium sponsorship opportunities for forward-thinking Ethiopian brands
          </p>
          <div className="flex justify-center gap-6 mb-8">
            {['Terms', 'Privacy', 'FAQ', 'Contact'].map((item) => (
              <a key={item} href="#" className="text-gray-400 hover:text-red-400 transition-colors">
                {item}
              </a>
            ))}
          </div>
          <div className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Aletube. All rights reserved.
          </div>
        </div>
      </motion.footer>

      {/* Package Modal */}
      <AnimatePresence>
        {selectedPackage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-800 rounded-2xl border border-slate-700 max-w-md w-full"
            >
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-bold">Package Inquiry</h3>
                  <Button 
                    variant="ghost"
                    size="icon"
                    onClick={() => setSelectedPackage(null)}
                    className="text-gray-400 hover:text-white"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </Button>
                </div>
                
                <p className="text-gray-300 mb-8">
                  Thank you for your interest in our {selectedPackage} package! Our partnership team will contact you within 24 hours to discuss details.
                </p>
                
                <form className="space-y-4">
                  <div>
                    <label className="block text-gray-400 mb-2">Your Name</label>
                    <input 
                      type="text" 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="John Smith"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="john@company.com"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-400 mb-2">Message (Optional)</label>
                    <textarea 
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                      placeholder="Tell us about your goals..."
                      rows={3}
                    ></textarea>
                  </div>
                  
                  <Button 
                    type="submit"
                    className="w-full bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 rounded-lg transition-all"
                  >
                    Submit Inquiry
                  </Button>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}