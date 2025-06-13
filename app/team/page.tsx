"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Instagram, Music2, Star, Mic, Video, Headphones } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { useState, useEffect } from "react";

const team = [
  {
    name: "Abel Misrak",
    role: "Founder / Lead Host",
    bio: "Drives the voice of a generation with humor and deep cultural insights. Creates authentic connections through storytelling.",
    img: "/abelmisrak.png",
    ig: "https://www.instagram.com/abel_misrak",
    tiktok: "https://www.tiktok.com/@abelmisrak",
    isFounder: true,
    country: "USA",
    accentColor: "from-[#0052B4] to-[#00247D]",
    flag: "🇺🇸",
    specialties: ["Cultural Commentary", "Storytelling", "Interviewing"],
    episodeCount: 87
  },
  {
    name: "Mahider Kebede",
    role: "Lead Co-host",
    bio: "Brings insightful questions that spark deep conversations. Balances intellect with warmth and relatable humor.",
    img: "/mahiderkebede.png",
    ig: "https://www.instagram.com/mahider.k",
    tiktok: "https://www.tiktok.com/@mahider_k", 
    country: "Ethiopia",
    accentColor: "from-[#078930] to-[#FCDD09]",
    flag: "🇪🇹",
    specialties: ["Social Commentary", "Youth Perspectives", "Community Building"],
    episodeCount: 64
  },
  {
    name: "YONZIMA",
    role: "Creative Director & Host",
    bio: "Visionary behind the show's visual identity. Brings raw energy and audio production expertise to every episode.",
    img: "/yonzima.png",
    ig: "https://www.instagram.com/yonzima_",
    tiktok: "https://www.tiktok.com/@yonzima",
    isFounder: true,
    country: "Ethiopia",
    accentColor: "from-[#078930] to-[#FCDD09]",
    flag: "🇪🇹",
    specialties: ["Visual Design", "Audio Production", "Creative Direction"],
    episodeCount: 72
  },
  {
    name: "Bereket",
    role: "Producer & Comedic Talent",
    bio: "The hilarious mastermind crafting soundscapes and energy. Brings levity while maintaining production excellence.",
    img: "/bereket.png",
    ig: "https://www.instagram.com/4kilo_entertainment",
    tiktok: "https://www.tiktok.com/@4kilo_entertainment",
    isFounder: true,
    country: "Ethiopia",
    accentColor: "from-[#078930] to-[#FCDD09]",
    flag: "🇪🇹",
    specialties: ["Sound Design", "Comedy", "Production"],
    episodeCount: 68
  },
  {
    name: "Dania Awet",
    role: "Co-host & Cultural Analyst",
    bio: "Brings sharp emotional intelligence and diaspora perspectives. Creates bridges between cultures.",
    img: "/daniaawet.png",
    ig: "https://www.instagram.com/daniatcon",
    tiktok: "https://www.tiktok.com/@dania_awet",
    country: "USA",
    accentColor: "from-[#0052B4] to-[#00247D]",
    flag: "🇺🇸",
    specialties: ["Diaspora Insights", "Social Analysis", "Cultural Critique"],
    episodeCount: 42
  },
  {
    name: "Leyu Alazar",
    role: "Guest Host & Personality",
    bio: "Adds vibrant flair and authentic personality. Connects culture to contemporary trends.",
    img: "/leyualazar.png",
    ig: "https://www.instagram.com/leyu_alazar",
    tiktok: "https://www.tiktok.com/@leyu_nana",
    country: "USA",
    accentColor: "from-[#0052B4] to-[#00247D]",
    flag: "🇺🇸",
    specialties: ["Trend Analysis", "Personality Hosting", "Cultural Connections"],
    episodeCount: 31
  },
];

export default function TeamPage() {
  const [activeMember, setActiveMember] = useState<typeof team[number] | null>(null);
  const [isGridView, setIsGridView] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  
  const ethiopiaTeam = team.filter(member => member.country === "Ethiopia");
  const usaTeam = team.filter(member => member.country === "USA");

  useEffect(() => {
    setIsMounted(true);
    return () => setIsMounted(false);
  }, []);

  const handleMemberClick = (member: typeof team[number]) => {
    setActiveMember(member);
    document.body.style.overflow = 'hidden';
  };

  const closeDetailView = () => {
    setActiveMember(null);
    document.body.style.overflow = 'auto';
  };

  if (!isMounted) return null;

  return (
    <section className="min-h-screen w-full bg-gradient-to-br from-[#0a0f15] to-[#15202b] px-4 md:px-8 lg:px-16 py-16 text-white relative overflow-x-hidden">
      {/* Advanced Background */}
      <div className="fixed inset-0 -z-20">
        <div className="absolute top-[10%] left-[15%] w-[40vw] h-[40vw] bg-[#EAA632]/5 rounded-full blur-[100px] animate-pulse-slow"></div>
        <div className="absolute bottom-[5%] right-[10%] w-[30vw] h-[30vw] bg-[#69C9D0]/5 rounded-full blur-[100px] animate-pulse-medium"></div>
        <div className="absolute top-[40%] right-[25%] w-[20vw] h-[20vw] bg-[#078930]/5 rounded-full blur-[100px] animate-pulse-fast"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-[length:100px_100px] opacity-[0.03]"></div>
      </div>
      
      {/* Floating particles */}
      {[...Array(30)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-[#EAA632]/20"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 10 + 2}px`,
            height: `${Math.random() * 10 + 2}px`,
          }}
          animate={{
            y: [0, Math.random() * 40 - 20],
            x: [0, Math.random() * 40 - 20],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="max-w-7xl mx-auto">
        {/* Header with view toggle */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-center max-w-4xl mx-auto mb-16 relative"
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-[#EAA632] to-[#FFD580] rounded-full"></div>
          
          <motion.h1 
            className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-[#EAA632] to-[#FFD580] drop-shadow-2xl mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Meet the Visionaries
          </motion.h1>
          
          <motion.p 
            className="text-3xl md:text-4xl font-semibold text-[#D6D6D6] mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            የቡድኑ አባላት ይህ ናቸው
          </motion.p>
          
          <motion.div 
            className="mt-6 text-lg text-[#a0aec0] leading-relaxed max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <p>The creative force behind Africa's fastest-growing podcast</p>
            <p className="mt-2">ይህ ቻናል አስቂኝና የእውነተኛ ውይይቶች ነው።</p>
          </motion.div>
          
          <motion.div 
            className="flex justify-center mt-10 space-x-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <button 
              onClick={() => setIsGridView(true)}
              className={`px-6 py-2 rounded-full transition-all ${
                isGridView 
                  ? "bg-gradient-to-r from-[#EAA632] to-[#FFD580] text-black font-bold" 
                  : "bg-[#1e293b] text-[#a0aec0] hover:bg-[#2d3748]"
              }`}
            >
              Grid View
            </button>
            <button 
              onClick={() => setIsGridView(false)}
              className={`px-6 py-2 rounded-full transition-all ${
                !isGridView 
                  ? "bg-gradient-to-r from-[#078930] to-[#FCDD09] text-black font-bold" 
                  : "bg-[#1e293b] text-[#a0aec0] hover:bg-[#2d3748]"
              }`}
            >
              List View
            </button>
          </motion.div>
        </motion.div>

        {/* ETHIOPIAN TEAM FIRST - MOST POPULAR */}
        <EthiopiaTeamSection 
          team={ethiopiaTeam} 
          isGridView={isGridView} 
          onMemberClick={handleMemberClick}
        />
        
        {/* USA TEAM SECTION */}
        <USATeamSection 
          team={usaTeam} 
          isGridView={isGridView} 
          onMemberClick={handleMemberClick}
        />
      </div>
      
      {/* Member Detail View */}
      <AnimatePresence>
        {activeMember && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 backdrop-blur-lg z-50 flex items-center justify-center p-4"
            onClick={closeDetailView}
          >
            <motion.div 
              className="relative max-w-4xl w-full bg-gradient-to-br from-[#1a202c] to-[#2d3748] rounded-3xl overflow-hidden shadow-2xl border border-[#EAA632]/30"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                className="absolute top-5 right-5 text-white bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all z-10"
                onClick={closeDetailView}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-[500px]">
                  <Image
                    src={activeMember.img}
                    alt={activeMember.name}
                    fill
                    className="object-cover"
                    loading="eager"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 pt-16">
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`text-3xl ${activeMember.country === "Ethiopia" ? "bg-gradient-to-r from-[#078930] to-[#FCDD09]" : "bg-gradient-to-r from-[#0052B4] to-[#00247D]"} px-4 py-1 rounded-full text-white font-bold`}>
                        {activeMember.flag} {activeMember.country}
                      </span>
                      {activeMember.isFounder && (
                        <span className="bg-gradient-to-r from-[#EAA632] to-[#ffc55c] text-black px-4 py-1 rounded-full font-bold flex items-center gap-1">
                          <Star className="w-4 h-4" />
                          Founder
                        </span>
                      )}
                    </div>
                    <h2 className="text-4xl font-bold text-white">{activeMember.name}</h2>
                    <p className="text-xl text-[#FFD580] mt-1">{activeMember.role}</p>
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#FFD580] mb-3">About</h3>
                    <p className="text-[#cbd5e0] leading-relaxed">{activeMember.bio}</p>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#FFD580] mb-3">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {activeMember.specialties.map((specialty, i) => (
                        <span 
                          key={i} 
                          className="bg-[#2d3748] border border-[#4a5568] px-3 py-1 rounded-full text-sm"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-[#FFD580] mb-3">Episode Contributions</h3>
                    <div className="w-full bg-[#2d3748] rounded-full h-4">
                      <div 
                        className="bg-gradient-to-r from-[#EAA632] to-[#FFD580] h-4 rounded-full" 
                        style={{ width: `${(activeMember.episodeCount / 100) * 100}%` }}
                      ></div>
                    </div>
                    <p className="mt-2 text-[#a0aec0]">{activeMember.episodeCount}+ episodes</p>
                  </div>
                  
                  <div>
                    <h3 className="text-2xl font-bold text-[#FFD580] mb-3">Connect</h3>
                    <div className="flex gap-4">
                      <a 
                        href={activeMember.ig} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group"
                        aria-label={`${activeMember.name} Instagram`}
                      >
                        <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] p-3 rounded-full group-hover:scale-110 transition-transform">
                          <Instagram className="text-white" size={24} />
                        </div>
                      </a>
                      <a 
                        href={activeMember.tiktok} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="group"
                        aria-label={`${activeMember.name} TikTok`}
                      >
                        <div className="bg-black p-3 rounded-full group-hover:scale-110 transition-transform">
                          <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-[#69C9D0] to-[#EE1D52] rounded-full blur-sm"></div>
                            <Music2 className="text-white relative" size={24} />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx global>{`
        .hexagon-mask {
          -webkit-clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          clip-path: polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%);
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .hexagon-mask:hover {
          transform: scale(1.05) rotate(5deg);
          box-shadow: 0 0 40px rgba(234, 166, 50, 0.4);
        }
        
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.1; }
          50% { opacity: 0.3; }
        }
        
        @keyframes pulse-medium {
          0%, 100% { opacity: 0.15; }
          50% { opacity: 0.25; }
        }
        
        @keyframes pulse-fast {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.35; }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 8s infinite;
        }
        
        .animate-pulse-medium {
          animation: pulse-medium 6s infinite;
        }
        
        .animate-pulse-fast {
          animation: pulse-fast 4s infinite;
        }
        
        .team-card {
          transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        
        .team-card:hover {
          transform: translateY(-8px) rotate(1deg);
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </section>
  );
}

type EthiopiaTeamSectionProps = {
  team: typeof team;
  isGridView: boolean;
  onMemberClick: (member: typeof team[number]) => void;
};

function EthiopiaTeamSection({ team, isGridView, onMemberClick }: EthiopiaTeamSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="mb-20 relative"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#078930] to-transparent w-full mb-8"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#078930] to-[#FCDD09] w-10 h-10 rounded-full flex items-center justify-center text-xl">
            🇪🇹
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            Ethiopian Episodes Team
          </h2>
          <div className="bg-gradient-to-r from-[#078930] to-[#FCDD09] w-10 h-10 rounded-full flex items-center justify-center text-xl">
            🇪🇹
          </div>
        </div>
        <p className="text-[#a0aec0] max-w-2xl text-center">
          The creative force behind our most popular episodes. Bringing authentic Ethiopian perspectives to the global stage.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-[#078930] to-transparent w-full mt-8"></div>
      </div>
      
      {isGridView ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <TeamMemberCard 
              key={member.name} 
              member={member} 
              index={i} 
              country="Ethiopia" 
              onClick={() => onMemberClick(member)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {team.map((member, i) => (
            <TeamListCard 
              key={member.name} 
              member={member} 
              index={i} 
              onClick={() => onMemberClick(member)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

type USATeamSectionProps = {
  team: typeof team;
  isGridView: boolean;
  onMemberClick: (member: typeof team[number]) => void;
};

function USATeamSection({ team, isGridView, onMemberClick }: USATeamSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.2 }}
      className="relative"
    >
      <div className="flex flex-col items-center mb-12">
        <div className="h-px bg-gradient-to-r from-transparent via-[#0052B4] to-transparent w-full mb-8"></div>
        <div className="flex items-center gap-4 mb-6">
          <div className="bg-gradient-to-r from-[#0052B4] to-[#00247D] w-10 h-10 rounded-full flex items-center justify-center text-xl">
            🇺🇸
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white">
            USA Episodes Team
          </h2>
          <div className="bg-gradient-to-r from-[#0052B4] to-[#00247D] w-10 h-10 rounded-full flex items-center justify-center text-xl">
            🇺🇸
          </div>
        </div>
        <p className="text-[#a0aec0] max-w-2xl text-center">
          Bridging cultures and bringing diaspora perspectives. Creating content that resonates across continents.
        </p>
        <div className="h-px bg-gradient-to-r from-transparent via-[#0052B4] to-transparent w-full mt-8"></div>
      </div>
      
      {isGridView ? (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {team.map((member, i) => (
            <TeamMemberCard 
              key={member.name} 
              member={member} 
              index={i} 
              country="USA" 
              onClick={() => onMemberClick(member)}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {team.map((member, i) => (
            <TeamListCard 
              key={member.name} 
              member={member} 
              index={i} 
              onClick={() => onMemberClick(member)}
            />
          ))}
        </div>
      )}
    </motion.div>
  );
}

type TeamMemberCardProps = {
  member: typeof team[number];
  index: number;
  country: string;
  onClick: () => void;
};

function TeamMemberCard({ member, index, country, onClick }: TeamMemberCardProps) {
  return (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, y: 40, rotate: index % 2 === 0 ? -1 : 1 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -10,
        rotate: index % 2 === 0 ? 1 : -1,
      }}
      className="team-card relative cursor-pointer"
      onClick={onClick}
    >
      <Card
        className={clsx(
          "overflow-hidden border bg-gradient-to-b from-[#1e293b]/70 to-[#1e293b]/30 backdrop-blur-lg rounded-2xl shadow-2xl h-full border-[#4a5568] hover:border-[#EAA632]/50 transition-all duration-300",
          member.isFounder ? "border-[#EAA632]" : 
          country === "USA" ? "border-blue-500/30" : "border-green-500/30"
        )}
      >
        {/* Glow effect */}
        <div className={clsx(
          "absolute top-0 left-0 w-full h-1 bg-gradient-to-r",
          country === "USA" 
            ? "from-[#0052B4] via-[#69C9D0] to-[#0052B4]" 
            : "from-[#078930] via-[#FCDD09] to-[#078930]"
        )}></div>
        
        {/* Founder badge */}
        {member.isFounder && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-[#EAA632] to-[#ffc55c] text-black px-3 py-1 rounded-full text-sm font-bold flex items-center gap-1 shadow-lg z-20">
            <Star className="w-4 h-4" />
            Founder
          </div>
        )}
        
        {/* Country flag */}
        <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2 shadow-lg z-10">
          {member.flag}
        </div>
        
        <div className="relative pt-16 pb-8 flex flex-col items-center">
          {/* Hexagonal image container */}
          <div className="relative w-40 h-40 overflow-hidden hexagon-mask group mx-auto mb-6">
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/30 z-10"></div>
            <Image
              src={member.img}
              alt={member.name}
              width={200}
              height={200}
              className="object-cover w-full h-full transform group-hover:scale-110 transition duration-500"
              loading="eager"
            />
          </div>

          <CardContent className="p-5 space-y-3 text-center">
            <motion.h3 
              className={clsx(
                "text-2xl font-bold",
                country === "USA" ? "text-[#89CFF0]" : "text-[#4CAF50]"
              )}
              whileHover={{ scale: 1.03 }}
            >
              {member.name}
            </motion.h3>
            
            <p className="text-[#a0aec0] text-sm mt-1">{member.role}</p>
            
            {member.name === "Abel Misrak" && (
              <div className="inline-flex items-center bg-[#EAA632]/20 px-3 py-1 rounded-full text-xs text-[#FFD580] mt-2">
                <Star className="w-3 h-3 mr-1" />
                Main Co-Founder
              </div>
            )}
            
            <div className="flex justify-center gap-3 mt-4">
                {member.specialties.slice(0, 2).map((specialty: string, i: number) => (
                <span 
                  key={i} 
                  className="bg-[#2d3748] border border-[#4a5568] px-2 py-1 rounded-full text-xs"
                >
                  {specialty}
                </span>
                ))}
            </div>
            
            <div className="mt-4 flex justify-center gap-4">
              <a 
                href={member.ig} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
                aria-label={`${member.name} Instagram`}
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] p-1.5 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram className="text-white" size={18} />
                </div>
              </a>
              <a 
                href={member.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
                aria-label={`${member.name} TikTok`}
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-black p-1.5 rounded-full group-hover:scale-110 transition-transform">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#69C9D0] to-[#EE1D52] rounded-full blur-sm"></div>
                    <Music2 className="text-white relative" size={18} />
                  </div>
                </div>
              </a>
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
}

type TeamListCardProps = {
  member: typeof team[number];
  index: number;
  onClick: () => void;
};

function TeamListCard({ member, index, onClick }: TeamListCardProps) {
  const country = member.country;
  
  return (
    <motion.div
      key={member.name}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ 
        y: -5,
      }}
      className="team-card bg-gradient-to-r from-[#1e293b] to-[#1a202c] backdrop-blur-lg rounded-2xl border border-[#4a5568] p-6 cursor-pointer transition-all hover:border-[#EAA632]/50"
      onClick={onClick}
    >
      <div className="flex items-center">
        <div className="relative w-24 h-24 overflow-hidden rounded-full flex-shrink-0 border-2 border-[#EAA632]/50">
          <Image
            src={member.img}
            alt={member.name}
            width={96}
            height={96}
            className="object-cover w-full h-full"
            loading="eager"
          />
          {member.isFounder && (
            <div className="absolute -top-2 -left-2 bg-gradient-to-r from-[#EAA632] to-[#ffc55c] text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
              <Star className="w-3 h-3" />
            </div>
          )}
          <div className="absolute -bottom-2 -right-2 bg-black/80 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            {member.flag}
          </div>
        </div>
        
        <div className="ml-6 flex-1">
          <div className="flex items-baseline justify-between">
            <h3 className={clsx(
              "text-xl font-bold",
              country === "USA" ? "text-[#89CFF0]" : "text-[#4CAF50]"
            )}>
              {member.name}
              {member.name === "Abel Misrak" && (
                <span className="ml-2 bg-[#EAA632]/20 px-2 py-0.5 rounded-full text-xs text-[#FFD580] align-middle">
                  Main Co-Founder
                </span>
              )}
            </h3>
            <div className="flex gap-2">
              <a 
                href={member.ig} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
                aria-label={`${member.name} Instagram`}
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-gradient-to-br from-[#833AB4] via-[#FD1D1D] to-[#FCB045] p-1 rounded-full group-hover:scale-110 transition-transform">
                  <Instagram className="text-white" size={16} />
                </div>
              </a>
              <a 
                href={member.tiktok} 
                target="_blank" 
                rel="noopener noreferrer"
                className="group"
                aria-label={`${member.name} TikTok`}
                onClick={e => e.stopPropagation()}
              >
                <div className="bg-black p-1 rounded-full group-hover:scale-110 transition-transform">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#69C9D0] to-[#EE1D52] rounded-full blur-sm"></div>
                    <Music2 className="text-white relative" size={16} />
                  </div>
                </div>
              </a>
            </div>
          </div>
          
          <p className="text-[#a0aec0] text-sm mt-1">{member.role}</p>
          
          <p className="text-[#cbd5e0] mt-3 line-clamp-2">{member.bio}</p>
          
          <div className="flex flex-wrap gap-2 mt-4">
            {member.specialties.map((specialty: string, i: number) => (
              <span 
              key={i} 
              className="bg-[#2d3748] border border-[#4a5568] px-2 py-1 rounded-full text-xs"
              >
              {specialty}
              </span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}