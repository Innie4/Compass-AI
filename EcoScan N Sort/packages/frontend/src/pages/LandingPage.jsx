import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsAPI } from '../services/api.js'

function LandingPage() {
  const navigate = useNavigate()
  const [todayStats, setTodayStats] = useState({ total_scans: 1248 })
  
  useEffect(() => {
    // Fetch today's stats from backend
    const fetchStats = async () => {
      try {
        const response = await analyticsAPI.getToday()
        if (response.data.success) {
          setTodayStats(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error)
        // Keep default value on error
      }
    }
    
    fetchStats()
  }, [])

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased overflow-hidden selection:bg-primary selection:text-background-dark fixed inset-0">
      {/* Mobile Container Wrapper */}
      <div className="relative flex flex-col h-screen w-full max-w-md mx-auto bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden border-x border-white/5">
        {/* Header */}
        <header className="flex items-center justify-between px-6 pt-6 pb-2 bg-transparent z-20">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" style={{fontSize: '20px'}}>eco</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight dark:text-white">EcoScan</h1>
          </div>
          <button 
            onClick={() => {
              const token = localStorage.getItem('token')
              if (token) {
                navigate('/profile')
              } else {
                navigate('/login')
              }
            }}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/5 transition-colors text-slate-400 dark:text-slate-200"
          >
            <span className="material-symbols-outlined">account_circle</span>
          </button>
        </header>
        {/* Main Content (Scrollable) */}
        <main className="flex-1 overflow-y-auto no-scrollbar relative z-10 pb-32">
          {/* Hero Section */}
          <div className="px-4 py-4">
            <div className="relative w-full aspect-[4/5] rounded-3xl overflow-hidden group">
              {/* Image */}
              <div 
                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
                data-alt="Hand holding a smartphone scanning a recyclable can on a table" 
                style={{backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOnAWzNfE3QjIHFbfyOMQ3IBAZg4BgZAWsuTNv_KiV7p8gJODYf01jVjgzErQLRSEDga7R5WMYG1CMpOuGT3lgI7udYZ2dT8_Lo8xBr9Oe2YfXSCvdzRukLCrReFxxqUVtFpm2lRhNJd3ueEAG3R0P2bo43s8I1iPGXAvsZ4x2XZz5qt3AmQ8WxbqWbruZq6f2oF3_w8HLrgZ5f7gSVq65PGsRrI1GccXzngfo5aiyjxB5sty-P8OY9Mgmu9oLtV7fj-hi29SB8cg")'}}
              >
              </div>
              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-transparent to-transparent opacity-90"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-background-dark/30 to-transparent"></div>
              {/* Scanning UI Overlay */}
              <div className="absolute inset-0 p-6 flex flex-col justify-between">
                {/* Scan Frame Corners */}
                <div className="relative w-full h-full border-2 border-white/20 rounded-xl overflow-hidden">
                  {/* Corner Accents */}
                  <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-sm"></div>
                  <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-sm"></div>
                  <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-sm"></div>
                  <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-sm"></div>
                  {/* Moving Scan Line */}
                  <div className="absolute left-0 w-full h-[2px] bg-primary shadow-[0_0_15px_rgba(19,236,91,0.8)] scan-line"></div>
                  {/* AR Tag */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-primary/30 flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-primary animate-pulse"></div>
                      <span className="text-xs font-semibold text-primary tracking-wider uppercase">Detecting</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Stats & Info Section */}
          <div className="px-4 flex flex-col gap-4">
            {/* Stats Row */}
            <div className="flex gap-3">
              {/* Daily Counter */}
              <div className="flex-1 bg-surface-dark border border-white/5 rounded-2xl p-4 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all"></div>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <span className="material-symbols-outlined text-primary" style={{fontSize: '20px'}}>recycling</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Scanned Today</span>
                  </div>
                  <p className="text-3xl font-extrabold text-white tracking-tight">
                    {todayStats.total_scans.toLocaleString()}
                  </p>
                </div>
              </div>
              {/* Streak/Score (Bonus) */}
              <div className="w-1/3 bg-surface-dark border border-white/5 rounded-2xl p-4 flex flex-col items-center justify-center gap-1">
                <div className="w-10 h-10 rounded-full border-2 border-primary flex items-center justify-center text-primary font-bold">
                  Lvl 5
                </div>
                <span className="text-[10px] text-slate-400 font-medium uppercase mt-1">Impact</span>
              </div>
            </div>
            {/* Info Card */}
            <div className="bg-gradient-to-br from-[#1F3A2B] to-[#14261B] rounded-2xl p-1 shadow-lg">
              <div className="bg-surface-darker/50 rounded-xl p-4 flex gap-4 items-start backdrop-blur-sm">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center text-primary mt-1">
                  <span className="material-symbols-outlined">lightbulb</span>
                </div>
                <div className="flex flex-col gap-1">
                  <h3 className="text-white text-sm font-bold leading-tight">Did you know?</h3>
                  <p className="text-slate-300 text-xs font-medium leading-relaxed">
                    25% of recycling is lost due to contamination. We're fixing that with AI sorting.
                  </p>
                </div>
              </div>
            </div>
            {/* Spacer for scrolling */}
            <div className="h-8"></div>
          </div>
        </main>
        {/* Fixed Bottom Action Zone */}
        <div className="absolute bottom-0 left-0 right-0 z-30 pointer-events-none">
          {/* Gradient fade */}
          <div className="h-24 w-full bg-gradient-to-t from-background-dark via-background-dark/95 to-transparent"></div>
          {/* Interaction Area */}
          <div className="bg-background-dark px-6 pb-8 pt-2 pointer-events-auto">
            <button 
              onClick={() => navigate('/scanner')}
              className="group relative w-full h-14 bg-primary rounded-xl flex items-center justify-center gap-3 overflow-hidden shadow-neon transition-transform active:scale-95"
            >
              {/* Button Glow Animation */}
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out skew-y-12"></div>
              <span className="material-symbols-outlined text-background-dark relative z-10">photo_camera</span>
              <span className="text-background-dark text-lg font-bold tracking-wide relative z-10">Start Scanning</span>
            </button>
            {/* Bottom Nav Indicator */}
            <div className="flex justify-center mt-6">
              <div className="flex gap-8 items-center">
                <button className="flex flex-col items-center gap-1 text-primary">
                  <span className="material-symbols-outlined">home</span>
                  <span className="text-[10px] font-bold">Home</span>
                </button>
                <button 
                  onClick={() => {
                    const token = localStorage.getItem('token')
                    if (token) {
                      navigate('/history')
                    } else {
                      navigate('/login')
                    }
                  }}
                  className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">history</span>
                  <span className="text-[10px] font-medium">History</span>
                </button>
                <button 
                  onClick={() => navigate('/guide')}
                  className="flex flex-col items-center gap-1 text-slate-500 hover:text-white transition-colors"
                >
                  <span className="material-symbols-outlined">map</span>
                  <span className="text-[10px] font-medium">Map</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LandingPage

