'use client'

import { useState, useRef, useEffect } from 'react'
import { TiltedCard } from './TiltedCard'
import { SpotlightCard } from './SpotlightCard'
import { CountUp } from './CountUp'
import { ElasticSlider } from './ElasticSlider'
import { TypewriterEffect } from './TypewriterEffect'
import { FaSteamSymbol } from "react-icons/fa"

export function MainPage() {
  const [isPlaying, setIsPlaying] = useState(true) // Start with playing
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(180) // Will be updated when video loads
  const [volume, setVolume] = useState(0.7) // Default volume
  const [viewCount, setViewCount] = useState(0)
  const [steamStatus, setSteamStatus] = useState<'online' | 'offline' | 'away' | 'busy' | 'snooze' | 'looking-to-trade' | 'looking-to-play'>('offline')
  const [lastLogoff, setLastLogoff] = useState<number>(0)
  const videoRef = useRef<HTMLVideoElement>(null)

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const handleSeek = (newTime: number) => {
    setCurrentTime(newTime)
    if (videoRef.current) {
      videoRef.current.currentTime = newTime
    }
  }

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume)
    if (videoRef.current) {
      videoRef.current.volume = newVolume
    }
  }

  const handleSkipBack = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10)
    }
  }

  const handleSkipForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(videoRef.current.duration, videoRef.current.currentTime + 10)
    }
  }

  const handleSteamClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open('https://steamcommunity.com/id/designv4', '_blank', 'noopener,noreferrer')
  }

  const handleGitHubClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    window.open('https://github.com/razvanc6', '_blank', 'noopener,noreferrer')
  }

  const handleDiscordClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    // Link pentru a începe o conversație pe Discord
    const discordId = process.env.NEXT_PUBLIC_DISCORD_USER_ID
    if (discordId) {
      window.open(`https://discord.com/users/${discordId}`, '_blank', 'noopener,noreferrer')
    } else {
      console.warn('Discord ID not configured')
    }
  }

  const fetchSteamStatus = async () => {
    try {
      // Steam Web API pentru a obține statusul utilizatorului
      // Folosim variabilele de mediu pentru securitate
      const steamId = process.env.NEXT_PUBLIC_STEAM_USER_ID
      const steamApiKey = process.env.NEXT_PUBLIC_STEAM_API_KEY
      const proxyUrl = process.env.NEXT_PUBLIC_CORS_PROXY_URL || 'https://api.allorigins.win/raw?url='
      
      if (!steamId || !steamApiKey) {
        console.warn('Steam API credentials not configured')
        return
      }
      
      const steamApiUrl = `https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v0002/?key=${steamApiKey}&steamids=${steamId}`
      
      const response = await fetch(proxyUrl + encodeURIComponent(steamApiUrl))
      
      if (response.ok) {
        const data = await response.json()
        const player = data.response.players[0]
        
        if (player) {
          // Stochează ultima dată de logoff
          setLastLogoff(player.lastlogoff)
          
          // Mapează statusul Steam la statusul nostru
          switch (player.personastate) {
            case 0:
              setSteamStatus('offline')
              break
            case 1:
              setSteamStatus('online')
              break
            case 2:
              setSteamStatus('busy')
              break
            case 3:
              setSteamStatus('away')
              break
            case 4:
              setSteamStatus('snooze')
              break
            case 5:
              setSteamStatus('looking-to-trade')
              break
            case 6:
              setSteamStatus('looking-to-play')
              break
            default:
              setSteamStatus('offline')
          }
        } else {
          setSteamStatus('offline')
        }
      } else {
        // Fallback la offline dacă API-ul nu funcționează
        setSteamStatus('offline')
      }
    } catch (error) {
      console.error('Error fetching Steam status:', error)
      // Setează statusul la offline și un timestamp real pentru demo
      setSteamStatus('offline')
      setLastLogoff(1755647924) // Timestamp-ul real din API-ul tău
    }
  }

  const getStatusInfo = (status: string) => {
    switch (status) {
      case 'online':
        return { color: 'bg-green-500', text: 'Online', textColor: 'text-green-400' }
      case 'away':
        return { color: 'bg-yellow-500', text: 'Away', textColor: 'text-yellow-400' }
      case 'busy':
        return { color: 'bg-red-500', text: 'Busy', textColor: 'text-red-400' }
      case 'snooze':
        return { color: 'bg-purple-500', text: 'Snooze', textColor: 'text-purple-400' }
      case 'looking-to-trade':
        return { color: 'bg-blue-500', text: 'Looking to Trade', textColor: 'text-blue-400' }
      case 'looking-to-play':
        return { color: 'bg-indigo-500', text: 'Looking to Play', textColor: 'text-indigo-400' }
      default:
        return { color: 'bg-gray-500', text: 'Offline', textColor: 'text-gray-400' }
    }
  }

  const formatLastSeen = (timestamp: number) => {
    if (!timestamp) return 'unknown'
    
    const now = Math.floor(Date.now() / 1000)
    const diff = now - timestamp
    
    if (diff < 60) return 'just now'
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`
    
    return new Date(timestamp * 1000).toLocaleDateString()
  }


  // Set video volume when it changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = volume
    }
  }, [volume])

  // Auto-play video when component mounts
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(console.error)
    }
  }, [])

  // Increment view count when component mounts
  useEffect(() => {
    // Verifică dacă utilizatorul a vizitat deja în această sesiune
    const sessionKey = 'hasVisitedThisSession'
    const hasVisited = sessionStorage.getItem(sessionKey)
    
    if (!hasVisited) {
      // Încarcă numărul de vizitatori din localStorage
      const savedViewCount = localStorage.getItem('viewCount')
      const currentCount = savedViewCount ? parseInt(savedViewCount) : 0
      
      // Incrementează contorul doar o dată per sesiune
      const newCount = currentCount + 1
      
      // Salvează noul număr în localStorage
      localStorage.setItem('viewCount', newCount.toString())
      
      // Marchează că utilizatorul a vizitat în această sesiune
      sessionStorage.setItem(sessionKey, 'true')
      
      // Setează numărul în state
      setViewCount(newCount)
    } else {
      // Dacă a vizitat deja, doar afișează numărul curent
      const savedViewCount = localStorage.getItem('viewCount')
      const currentCount = savedViewCount ? parseInt(savedViewCount) : 0
      setViewCount(currentCount)
    }
  }, [])

  // Fetch Steam status on mount and every 30 seconds
  useEffect(() => {
    fetchSteamStatus()
    const interval = setInterval(fetchSteamStatus, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-black relative overflow-hidden">
      {/* Background video with blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-pink-900/30"></div>
        {/* Video background */}
        <video 
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover filter blur-sm pointer-events-none transform scale-110"
          autoPlay 
          muted={false}
          loop
          playsInline
          onTimeUpdate={() => {
            if (videoRef.current) {
              setCurrentTime(Math.floor(videoRef.current.currentTime))
            }
          }}
          onEnded={() => setIsPlaying(false)}
          onLoadedMetadata={() => {
            if (videoRef.current) {
              setDuration(Math.floor(videoRef.current.duration))
            }
          }}
        >
          <source src="/background-video.mp4" type="video/mp4" />
          {/* Fallback image */}
          <div 
            className="w-full h-full bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80")'
            }}
          ></div>
        </video>
      </div>


      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-6">
          {/* Profile Card */}
          <TiltedCard>
            <SpotlightCard>
              <div className="bg-gray-900/80 backdrop-blur-md rounded-2xl p-6 border border-gray-700/50">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12">
                    <img 
                      src="data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20280%20280%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EAvataaars%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Favataaars.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Favataaars.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EAvataaars%E2%80%9D%20(https%3A%2F%2Favataaars.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Favataaars.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22e4nlrspy%22%3E%3Crect%20width%3D%22280%22%20height%3D%22280%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23e4nlrspy)%22%3E%3Cg%20transform%3D%22translate(8)%22%3E%3Cmask%20id%3D%22l59phaqp%22%20style%3D%22mask-type%3Aluminance%22%20maskUnits%3D%22userSpaceOnUse%22%20x%3D%220%22%20y%3D%220%22%20width%3D%22264%22%20height%3D%22280%22%3E%3Cpath%20d%3D%22M264%200H0v160h12c0%2066.27%2053.73%20120%20120%20120%2066.27%200%20120-53.73%20120-120h12V0Z%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23l59phaqp)%22%3E%3Cpath%20d%3D%22M132%2036a56%2056%200%200%200-56%2056v6.17A12%2012%200%200%200%2066%20110v14a12%2012%200%200%200%2010.3%2011.88%2056.04%2056.04%200%200%200%2031.7%2044.73v18.4h-4a72%2072%200%200%200-72%2072v9h200v-9a72%2072%200%200%200-72-72h-4v-18.39a56.04%2056.04%200%200%200%2031.7-44.73A12%2012%200%200%200%20198%20124v-14a12%2012%200%200%200-10-11.83V92a56%2056%200%200%200-56-56Z%22%20fill%3D%22%23d08b5b%22%2F%3E%3Cpath%20d%3D%22M108%20180.61v8a55.79%2055.79%200%200%200%2024%205.39c8.59%200%2016.73-1.93%2024-5.39v-8a55.79%2055.79%200%200%201-24%205.39%2055.79%2055.79%200%200%201-24-5.39Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.1%22%2F%3E%3Cg%20transform%3D%22translate(0%20170)%22%3E%3Cpath%20d%3D%22M108%2014.7c-15.52%203.68-27.1%2010.83-30.77%2019.44A72.02%2072.02%200%200%200%2032%20101v9h200v-9a72.02%2072.02%200%200%200-45.23-66.86C183.1%2025.53%20171.52%2018.38%20156%2014.7V32a24%2024%200%201%201-48%200V14.7Z%22%20fill%3D%22%233c4f5c%22%2F%3E%3Cpath%20d%3D%22M102%2063.34a67.1%2067.1%200%200%201-7-2.82V110h7V63.34ZM162%2063.34a67.04%2067.04%200%200%200%207-2.82V98.5a3.5%203.5%200%201%201-7%200V63.34Z%22%20fill%3D%22%23F4F4F4%22%2F%3E%3Cpath%20d%3D%22M187.62%2034.49a71.79%2071.79%200%200%201%2010.83%205.63C197.11%2055.62%20167.87%2068%20132%2068c30.93%200%2056-13.43%2056-30%200-1.19-.13-2.36-.38-3.51ZM76.38%2034.49a16.48%2016.48%200%200%200-.38%203.5c0%2016.58%2025.07%2030%2056%2030-35.87%200-65.1-12.38-66.45-27.88a71.79%2071.79%200%200%201%2010.83-5.63Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.16%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(78%20134)%22%3E%3Cpath%20d%3D%22M40%2016c0%205.37%206.16%209%2014%209s14-3.63%2014-9c0-1.1-.95-2-2-2-1.3%200-1.87.9-2%202-1.24%202.94-4.32%204.72-10%205-5.68-.28-8.76-2.06-10-5-.13-1.1-.7-2-2-2-1.05%200-2%20.9-2%202Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(104%20122)%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M16%208c0%204.42%205.37%208%2012%208s12-3.58%2012-8%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.16%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(76%2090)%22%3E%3Cpath%20d%3D%22M36%2022a6%206%200%201%201-12%200%206%206%200%200%201%2012%200ZM88%2022a6%206%200%201%201-12%200%206%206%200%200%201%2012%200Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(76%2082)%22%3E%3Cpath%20d%3D%22M15.63%2017.16c3.92-5.51%2014.65-8.6%2023.9-6.33a2%202%200%201%200%20.95-3.88c-10.74-2.64-23.17.94-28.11%207.9a2%202%200%200%200%203.26%202.3ZM96.37%2017.16c-3.91-5.51-14.65-8.6-23.9-6.33a2%202%200%201%201-.95-3.88c10.74-2.64%2023.17.94%2028.11%207.9a2%202%200%200%201-3.26%202.3Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(-1)%22%3E%3Cpath%20fill-rule%3D%22evenodd%22%20clip-rule%3D%22evenodd%22%20d%3D%22M180.15%2039.92c-2.76-2.82-5.96-5.21-9.08-7.61-.69-.53-1.39-1.05-2.06-1.6-.15-.12-1.72-1.24-1.9-1.66-.45-.99-.19-.22-.12-1.4.08-1.5%203.13-5.73.85-6.7-1-.43-2.8.7-3.75%201.08a59.56%2059.56%200%200%201-5.73%201.9c.93-1.85%202.7-5.57-.63-4.58-2.6.78-5.03%202.77-7.64%203.7.86-1.4%204.32-5.8%201.2-6.05-.98-.07-3.8%201.75-4.86%202.14a55.81%2055.81%200%200%201-9.63%202.51c-11.2%202.02-24.3%201.45-34.65%206.54-8%203.93-15.88%2010.03-20.5%2017.8-4.44%207.48-6.1%2015.67-7.03%2024.25-.69%206.3-.74%2012.8-.42%2019.12.1%202.07.34%2011.61%203.34%208.72%201.5-1.44%201.49-7.25%201.87-9.22.75-3.91%201.47-7.85%202.72-11.64%202.2-6.68%204.81-13.8%2010.3-18.4%203.53-2.94%206.01-6.93%209.39-9.9%201.51-1.35.36-1.2%202.8-1.03%201.63.12%203.28.16%204.92.2%203.8.1%207.6.08%2011.4.1%207.64%200%2015.25.12%2022.89-.28%203.4-.18%206.8-.28%2010.18-.6%201.9-.17%205.25-1.38%206.8-.45%201.43.84%202.91%203.61%203.94%204.75%202.41%202.67%205.3%204.72%208.12%206.92%205.9%204.57%208.87%2010.33%2010.66%2017.48%201.79%207.13%201.29%2013.75%203.5%2020.76.38%201.24%201.4%203.36%202.67%201.46.24-.36.18-2.3.18-3.42%200-4.52%201.14-7.91%201.13-12.46-.06-13.83-.5-31.87-10.85-42.44Z%22%20fill%3D%22%23724133%22%2F%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(49%2072)%22%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(62%2042)%22%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" 
                      alt="Profile" 
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-white shiny-text">Design</h1>
                    <p className="text-gray-400 text-sm">
                      <TypewriterEffect 
                        text="./app.java" 
                        typeSpeed={150}
                        deleteSpeed={75}
                        pauseTime={2500}
                        className="text-gray-400"
                      />
                    </p>
                  </div>
                </div>

                {/* GitHub profile */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0C5.374 0 0 5.373 0 12 0 17.302 3.438 21.8 8.207 23.387c.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleGitHubClick}
                      className="text-white text-sm hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      razvanc6
                    </button>
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Discord profile */}
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleDiscordClick}
                      className="text-white text-sm hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      _design
                    </button>
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>

                {/* Steam profile */}
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                    <FaSteamSymbol className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <button 
                      onClick={handleSteamClick}
                      className="text-white text-sm hover:text-blue-400 transition-colors cursor-pointer"
                    >
                      designv4
                    </button>
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-2">
                    {steamStatus === 'offline' ? (
                      <p className="text-gray-400 text-xs">last seen {formatLastSeen(lastLogoff)}</p>
                    ) : (
                      <div className="flex items-center space-x-1">
                        <div className={`w-2 h-2 ${getStatusInfo(steamStatus).color} rounded-full ${steamStatus === 'online' ? 'animate-pulse' : ''}`}></div>
                        <span className={`${getStatusInfo(steamStatus).textColor} text-xs`}>{getStatusInfo(steamStatus).text}</span>
                      </div>
                    )}
                  </div>
                </div>


                {/* Bottom info */}
                <div className="flex justify-between items-center text-sm pt-4 pb-2">
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <CountUp 
                      end={viewCount} 
                      duration={2000}
                      className="text-gray-400"
                    />
                  </div>
                  <div className="flex items-center space-x-2 text-gray-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span>Romania</span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </TiltedCard>

          {/* Music Player Card - Redesigned */}
          <TiltedCard>
            <SpotlightCard>
              <div className="bg-gradient-to-br from-black/60 to-gray-900/60 backdrop-blur-xl rounded-3xl p-8 border border-white/20 shadow-2xl">
                {/* Album Art Section */}
                <div className="flex items-center space-x-6 mb-6">
                  <div className="relative">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                      <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v9.114A4.369 4.369 0 005 14c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V7.82l8-1.6v5.894A4.369 4.369 0 0015 12c-1.657 0-3 .895-3 2s1.343 2 3 2 3-.895 3-2V3z"/>
                      </svg>
                    </div>
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-white text-lg font-bold mb-1">
                      Petrica, Florin si Ionut Cercel
                    </h3>
                    <p className="text-gray-300 text-sm">
                      Noi dam inainte, voi dati inapoi
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                      <span className="text-purple-300 text-xs font-medium">Now Playing</span>
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="mb-6">
                  <div className="flex justify-between text-sm text-gray-400 mb-2">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>
                  <ElasticSlider
                    min={0}
                    max={duration}
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-2"
                  />
                </div>

                {/* Controls Section */}
                <div className="flex items-center justify-between">
                  {/* Main Controls */}
                  <div className="flex items-center space-x-4">
                    <button 
                      onClick={handleSkipBack}
                      className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M8.445 14.832A1 1 0 0010 14v-2.798l5.445 3.63A1 1 0 0017 14V6a1 1 0 00-1.555-.832L10 8.798V6a1 1 0 00-1.555-.832l-6 4a1 1 0 000 1.664l6 4z"/>
                      </svg>
                    </button>
                    
                    <button 
                      onClick={handlePlayPause}
                      className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-110 shadow-lg"
                    >
                      {isPlaying ? (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleSkipForward}
                      className="p-2 text-gray-400 hover:text-white transition-colors hover:bg-white/10 rounded-full"
                    >
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M4.555 5.168A1 1 0 003 6v8a1 1 0 001.555.832L10 11.202V14a1 1 0 001.555.832l6-4a1 1 0 000-1.664l-6-4A1 1 0 0010 6v2.798l-5.445-3.63z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Volume Control */}
                  <div className="flex items-center space-x-3">
                    <svg className="w-5 h-5 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.617.793L4.617 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.617l3.766-3.793a1 1 0 011-.124zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clipRule="evenodd" />
                    </svg>
                    <div className="w-20">
                      <ElasticSlider
                        min={0}
                        max={1}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="w-full h-1"
                      />
                    </div>
                    <span className="text-gray-400 text-xs w-8">
                      {Math.round(volume * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </SpotlightCard>
          </TiltedCard>
        </div>
      </div>


    </div>
  )
}