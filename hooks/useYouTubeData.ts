import { useState, useEffect } from "react";

const API_KEY = process.env.NEXT_PUBLIC_YT_API_KEY;
const CHANNEL_ID = process.env.NEXT_PUBLIC_YT_CHANNEL_ID;

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