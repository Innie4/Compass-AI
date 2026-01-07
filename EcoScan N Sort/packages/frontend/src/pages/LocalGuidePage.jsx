import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { leaderboardAPI } from '../services/api.js'

function LocalGuidePage() {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [activeTab, setActiveTab] = useState('school')

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await leaderboardAPI.get(activeTab, 10)
        if (response.data.success) {
          setLeaderboard(response.data.data.leaderboard)
        }
      } catch (error) {
        console.error('Failed to fetch leaderboard:', error)
        // Seed default data if fetch fails
        try {
          await leaderboardAPI.seed()
          const response = await leaderboardAPI.get(activeTab, 10)
          if (response.data.success) {
            setLeaderboard(response.data.data.leaderboard)
          }
        } catch (seedError) {
          console.error('Failed to seed leaderboard:', seedError)
        }
      }
    }
    
    fetchLeaderboard()
  }, [activeTab])

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111] dark:text-white font-display antialiased selection:bg-primary selection:text-background-dark min-h-screen">
      <div className="relative flex flex-col min-h-screen w-full mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Top App Bar */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">Local Guide</h2>
          <button 
            onClick={() => {
              const token = localStorage.getItem('token')
              if (token) {
                navigate('/profile')
              } else {
                navigate('/login')
              }
            }}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 hover:bg-primary/20 transition-colors"
          >
            <span className="material-symbols-outlined text-primary">account_circle</span>
          </button>
        </header>
        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {/* Map Card Section */}
          <section className="p-4 pt-6">
            <div className="flex flex-col rounded-xl overflow-hidden shadow-lg bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5">
              {/* Map Image Container - Using Google Maps Embed */}
              <div className="relative w-full h-48 bg-gray-200 dark:bg-gray-800">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.8372174351554!2d-122.4194!3d37.7749!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzfCsDQ2JzI5LjYiTiAxMjLCsDI1JzA5LjkiVw!5e0!3m2!1sen!2sus!4v1234567890123!5m2!1sen!2sus"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'brightness(0.9)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Map view showing recycling locations"
                ></iframe>
                <div className="absolute top-3 right-3 bg-white dark:bg-background-dark px-2 py-1 rounded-md shadow-sm flex items-center gap-1">
                  <span className="material-symbols-outlined text-primary text-sm">battery_charging_full</span>
                  <span className="text-xs font-bold uppercase tracking-wider">E-Waste</span>
                </div>
              </div>
              {/* Card Content */}
              <div className="p-4 flex flex-col gap-3">
                <div>
                  <h3 className="text-xl font-bold leading-tight mb-1">Nearest E-Waste Drop-off</h3>
                  <p className="text-gray-500 dark:text-[#92c9a4] text-sm font-medium flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">near_me</span>
                    1.2 miles away • Open until 6 PM
                  </p>
                </div>
                <button 
                  onClick={() => {
                    // Open Google Maps with navigation to nearest e-waste location
                    const lat = 37.7749  // San Francisco coordinates (default)
                    const lng = -122.4194
                    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
                    window.open(url, '_blank')
                  }}
                  className="w-full mt-1 flex items-center justify-center gap-2 rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold uppercase tracking-wide hover:bg-[#0fd650] transition-colors active:scale-[0.98]"
                >
                  <span className="material-symbols-outlined text-lg">navigation</span>
                  Navigate
                </button>
              </div>
            </div>
          </section>
          {/* Did You Know? Header */}
          <div className="flex items-center px-4 pt-2 pb-2">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs">Did You Know?</h3>
          </div>
          {/* Facts Carousel */}
          <section className="w-full mb-6">
            <div className="flex overflow-x-auto scrollbar-hide pl-4 pr-4 gap-4 pb-2">
              {/* Card 1 */}
              <div className="flex-none w-72 flex flex-col bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-primary">bolt</span>
                </div>
                <div className="mb-3 w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">energy_savings_leaf</span>
                </div>
                <h4 className="text-lg font-bold mb-1 dark:text-white">Energy Saver</h4>
                <p className="text-sm text-gray-600 dark:text-[#92c9a4] leading-relaxed">
                  Recycling one aluminum can saves enough energy to run a TV for 3 hours.
                </p>
              </div>
              {/* Card 2 */}
              <div className="flex-none w-72 flex flex-col bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-blue-400">water_drop</span>
                </div>
                <div className="mb-3 w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <span className="material-symbols-outlined">recycling</span>
                </div>
                <h4 className="text-lg font-bold mb-1 dark:text-white">Plastic Fact</h4>
                <p className="text-sm text-gray-600 dark:text-[#92c9a4] leading-relaxed">
                  Only 9% of plastic is recycled globally. Check numbers before tossing!
                </p>
              </div>
              {/* Card 3 */}
              <div className="flex-none w-72 flex flex-col bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity">
                  <span className="material-symbols-outlined text-6xl text-yellow-400">emoji_events</span>
                </div>
                <div className="mb-3 w-10 h-10 rounded-full bg-yellow-500/20 flex items-center justify-center text-yellow-400">
                  <span className="material-symbols-outlined">public</span>
                </div>
                <h4 className="text-lg font-bold mb-1 dark:text-white">Global Impact</h4>
                <p className="text-sm text-gray-600 dark:text-[#92c9a4] leading-relaxed">
                  Swapping to reusable bags can save over 22,000 plastic bags in a lifetime.
                </p>
              </div>
            </div>
          </section>
          {/* Leaderboard Section */}
          <section className="px-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs">Community Leaderboard</h3>
              <button 
                onClick={() => navigate('/leaderboard')}
                className="text-xs text-primary font-bold cursor-pointer hover:underline"
              >
                View All
              </button>
            </div>
            {/* Tabs */}
            <div className="p-1 mb-6 bg-gray-200 dark:bg-white/5 rounded-lg flex">
              <button 
                onClick={() => setActiveTab('school')}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-bold shadow-sm transition-all ${
                  activeTab === 'school' 
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark' 
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Schools
              </button>
              <button 
                onClick={() => setActiveTab('neighborhood')}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  activeTab === 'neighborhood' 
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark font-bold shadow-sm' 
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Neighborhoods
              </button>
            </div>
            {/* Leaderboard List */}
            <div className="flex flex-col gap-3">
              {leaderboard.map((entry, index) => (
              <div key={entry.id} className={`relative flex items-center p-3 rounded-lg ${
                index === 0 
                  ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30' 
                  : 'bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5'
              }`}>
                <div className={`flex-shrink-0 w-8 text-center font-black text-lg ${
                  index === 0 ? 'text-yellow-500' : 
                  index === 1 ? 'text-gray-400' : 
                  index === 2 ? 'text-orange-700/70 dark:text-orange-400' : 
                  'text-gray-400'
                }`}>
                  {index + 1}
                </div>
                <div className={`w-10 h-10 rounded-full bg-gray-700 mx-3 overflow-hidden ${
                  index === 0 ? 'border border-yellow-500/50' : ''
                }`}>
                  {entry.logo_url ? (
                    <div 
                      className="w-full h-full bg-cover bg-center" 
                      data-alt={`${entry.name} logo`}
                      style={{ backgroundImage: `url("${entry.logo_url}")` }}
                    >
                    </div>
                  ) : (
                    <div className="w-full h-full bg-gray-600"></div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate dark:text-white">{entry.name}</p>
                  <p className={`text-xs font-medium ${
                    index === 0 ? 'text-yellow-500' : 'text-gray-500 dark:text-[#92c9a4]'
                  }`}>
                    {entry.purity_score.toFixed(0)}% Purity Score
                  </p>
                </div>
                <div className="text-right">
                  <span className="block text-sm font-black dark:text-white">
                    {entry.score.toLocaleString()}
                  </span>
                  <span className="block text-[10px] uppercase text-gray-500 dark:text-gray-400">pts</span>
                </div>
                {index === 0 && (
                  <span className="material-symbols-outlined absolute -top-2 -right-1 text-yellow-400 text-xl drop-shadow-md">emoji_events</span>
                )}
              </div>
              ))}
            </div>
          </section>
          {/* Spacer for Bottom Nav */}
          <div className="h-6"></div>
        </main>
        {/* Bottom Navigation Bar */}
        <nav className="absolute bottom-0 w-full bg-white/90 dark:bg-background-dark/95 backdrop-blur-lg border-t border-black/5 dark:border-white/5 pb-5 pt-2 px-6 flex justify-between items-center z-30">
          <button 
            onClick={() => navigate('/')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">home</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">Home</span>
          </button>
          <button 
            onClick={() => navigate('/scanner')}
            className="flex flex-col items-center gap-1 group"
          >
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(19,236,91,0.4)] -mt-6 border-4 border-background-light dark:border-background-dark">
              <span className="material-symbols-outlined text-background-dark text-2xl">qr_code_scanner</span>
            </div>
          </button>
          <button className="flex flex-col items-center gap-1 group">
            <span className="material-symbols-outlined text-primary">map</span>
            <span className="text-[10px] font-medium text-primary">Guide</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default LocalGuidePage

