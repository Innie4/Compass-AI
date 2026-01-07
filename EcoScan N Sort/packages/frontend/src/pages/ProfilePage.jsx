import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authAPI, scansAPI } from '../services/api.js'

function ProfilePage() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get user info
        const userResponse = await authAPI.getMe()
        if (userResponse.data.success) {
          setUser(userResponse.data.data.user)
        }

        // Get user stats
        const statsResponse = await scansAPI.getStats()
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data.stats)
        }
      } catch (error) {
        console.error('Failed to fetch profile data:', error)
        // If not authenticated, redirect to login
        if (error.response?.status === 401) {
          navigate('/login')
        }
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/')
  }

  if (loading) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-background-dark min-h-screen">
      <div className="relative flex flex-col min-h-screen w-full mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate('/')}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">Profile</h2>
          <div className="w-12"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {/* Profile Header */}
          <section className="p-6 pt-8">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-primary mb-4 border-4 border-primary/30">
                <span className="material-symbols-outlined text-5xl">account_circle</span>
              </div>
              <h3 className="text-2xl font-bold mb-1">{user.username}</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{user.email}</p>
              <div className="mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-xs font-bold uppercase">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
              </div>
            </div>
          </section>

          {/* Stats Section */}
          {stats && (
            <section className="px-4 mb-6">
              <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs mb-4">Your Impact</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm">recycling</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Total Scans</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">{stats.total_scans || 0}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm">verified</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Avg Confidence</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">
                    {stats.avg_confidence ? Math.round(stats.avg_confidence) : 0}%
                  </p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm">recycling</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Recycled</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">{stats.recycle_count || 0}</p>
                </div>
                <div className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5">
                  <div className="flex items-center gap-2 mb-2 text-slate-400">
                    <span className="material-symbols-outlined text-primary text-sm">compost</span>
                    <span className="text-xs font-bold uppercase tracking-wider">Composted</span>
                  </div>
                  <p className="text-2xl font-extrabold text-white">{stats.compost_count || 0}</p>
                </div>
              </div>
            </section>
          )}

          {/* Menu Items */}
          <section className="px-4">
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <button 
                onClick={() => navigate('/history')}
                className="w-full flex items-center gap-4 p-4 border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">history</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold dark:text-white">Scan History</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">View all your scans</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button 
                onClick={() => navigate('/leaderboard')}
                className="w-full flex items-center gap-4 p-4 border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">emoji_events</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold dark:text-white">Leaderboard</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">See top performers</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button 
                onClick={() => navigate('/settings')}
                className="w-full flex items-center gap-4 p-4 border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">settings</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold dark:text-white">Settings</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">App preferences</p>
                </div>
                <span className="material-symbols-outlined text-slate-400">chevron_right</span>
              </button>

              <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-4 p-4 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center text-red-500">
                  <span className="material-symbols-outlined">logout</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="text-sm font-bold text-red-500">Log Out</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Sign out of your account</p>
                </div>
              </button>
            </div>
          </section>

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
            <span className="material-symbols-outlined text-gray-400 group-hover:text-primary transition-colors">map</span>
            <span className="text-[10px] font-medium text-gray-400 group-hover:text-primary transition-colors">Guide</span>
          </button>
        </nav>
      </div>
    </div>
  )
}

export default ProfilePage

