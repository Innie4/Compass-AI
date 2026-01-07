import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { leaderboardAPI } from '../services/api.js'

function LeaderboardPage() {
  const navigate = useNavigate()
  const [leaderboard, setLeaderboard] = useState([])
  const [activeTab, setActiveTab] = useState('school')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchLeaderboard()
  }, [activeTab])

  const fetchLeaderboard = async () => {
    setLoading(true)
    try {
      const response = await leaderboardAPI.get(activeTab, 50) // Get top 50
      if (response.data.success) {
        setLeaderboard(response.data.data.leaderboard)
      }
    } catch (error) {
      console.error('Failed to fetch leaderboard:', error)
      // Try to seed if empty
      try {
        await leaderboardAPI.seed()
        const response = await leaderboardAPI.get(activeTab, 50)
        if (response.data.success) {
          setLeaderboard(response.data.data.leaderboard)
        }
      } catch (seedError) {
        console.error('Failed to seed leaderboard:', seedError)
      }
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index) => {
    if (index === 0) return '🥇'
    if (index === 1) return '🥈'
    if (index === 2) return '🥉'
    return null
  }

  const getRankColor = (index) => {
    if (index === 0) return 'text-yellow-500'
    if (index === 1) return 'text-gray-400'
    if (index === 2) return 'text-orange-700 dark:text-orange-400'
    return 'text-gray-400'
  }

  return (
    <div className="bg-background-light dark:bg-background-dark text-[#111] dark:text-white font-display antialiased selection:bg-primary selection:text-background-dark min-h-screen">
      <div className="relative flex flex-col min-h-screen w-full mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate('/guide')}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">Leaderboard</h2>
          <div className="w-12"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {/* Tabs */}
          <div className="p-4">
            <div className="p-1 bg-gray-200 dark:bg-white/5 rounded-lg flex">
              <button 
                onClick={() => { setActiveTab('school'); setLeaderboard([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-bold shadow-sm transition-all ${
                  activeTab === 'school' 
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark' 
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Schools
              </button>
              <button 
                onClick={() => { setActiveTab('neighborhood'); setLeaderboard([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  activeTab === 'neighborhood' 
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark font-bold shadow-sm' 
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Neighborhoods
              </button>
            </div>
          </div>

          {/* Leaderboard List */}
          {loading && leaderboard.length === 0 ? (
            <div className="flex items-center justify-center py-16">
              <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">emoji_events</span>
              </div>
              <h3 className="text-lg font-bold mb-2">No entries yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center">
                Be the first to join the leaderboard!
              </p>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`relative flex items-center p-4 rounded-lg ${
                    index === 0 
                      ? 'bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/30' 
                      : 'bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5'
                  }`}
                >
                  {/* Rank */}
                  <div className={`flex-shrink-0 w-10 text-center font-black text-lg ${getRankColor(index)}`}>
                    {getRankIcon(index) || (index + 1)}
                  </div>

                  {/* Logo/Avatar */}
                  <div className={`w-12 h-12 rounded-full bg-gray-700 mx-3 overflow-hidden flex-shrink-0 ${
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
                      <div className="w-full h-full bg-gray-600 flex items-center justify-center">
                        <span className="material-symbols-outlined text-white text-xl">
                          {activeTab === 'school' ? 'school' : 'location_city'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold truncate dark:text-white">{entry.name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <p className={`text-xs font-medium ${
                        index === 0 ? 'text-yellow-500' : 'text-gray-500 dark:text-[#92c9a4]'
                      }`}>
                        {entry.purity_score.toFixed(0)}% Purity
                      </p>
                      <span className="text-gray-400">•</span>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {entry.total_scans.toLocaleString()} scans
                      </p>
                    </div>
                  </div>

                  {/* Score */}
                  <div className="text-right flex-shrink-0">
                    <span className="block text-lg font-black dark:text-white">
                      {entry.score.toLocaleString()}
                    </span>
                    <span className="block text-[10px] uppercase text-gray-500 dark:text-gray-400">pts</span>
                  </div>

                  {/* Trophy for #1 */}
                  {index === 0 && (
                    <span className="material-symbols-outlined absolute -top-2 -right-1 text-yellow-400 text-xl drop-shadow-md">
                      emoji_events
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Spacer */}
          <div className="h-6"></div>
        </main>

        {/* Bottom Navigation */}
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
          <button 
            onClick={() => navigate('/guide')}
            className="flex flex-col items-center gap-1 group"
          >
            <span className="material-symbols-outlined text-primary">map</span>
            <span className="text-[10px] font-medium text-primary">Guide</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default LeaderboardPage

