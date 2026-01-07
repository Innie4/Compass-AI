import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { scansAPI } from '../services/api.js'

function HistoryPage() {
  const navigate = useNavigate()
  const [scans, setScans] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all') // all, recycle, compost, trash
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)

  useEffect(() => {
    fetchScans()
  }, [filter, page])

  const fetchScans = async () => {
    try {
      const params = {
        page,
        limit: 20,
        ...(filter !== 'all' && { category: filter })
      }
      
      const response = await scansAPI.getMyScans(params)
      if (response.data.success) {
        if (page === 1) {
          setScans(response.data.data.scans)
        } else {
          setScans(prev => [...prev, ...response.data.data.scans])
        }
        setHasMore(response.data.data.pagination.page < response.data.data.pagination.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch scans:', error)
      if (error.response?.status === 401) {
        navigate('/login')
      }
    } finally {
      setLoading(false)
    }
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'compost':
        return 'compost'
      case 'trash':
        return 'delete'
      default:
        return 'recycling'
    }
  }

  const getCategoryColor = (category) => {
    switch (category) {
      case 'compost':
        return 'bg-amber-600'
      case 'trash':
        return 'bg-gray-600'
      default:
        return 'bg-primary'
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now - date
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    if (days < 7) return `${days}d ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  if (loading && scans.length === 0) {
    return (
      <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased min-h-screen flex items-center justify-center">
        <div className="text-center">
          <span className="material-symbols-outlined text-primary text-4xl animate-spin">refresh</span>
        </div>
      </div>
    )
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
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">Scan History</h2>
          <div className="w-12"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {/* Filter Tabs */}
          <div className="p-4">
            <div className="p-1 bg-gray-200 dark:bg-white/5 rounded-lg flex gap-1">
              <button
                onClick={() => { setFilter('all'); setPage(1); setScans([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-bold shadow-sm transition-all ${
                  filter === 'all'
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark'
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                All
              </button>
              <button
                onClick={() => { setFilter('recycle'); setPage(1); setScans([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  filter === 'recycle'
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark font-bold shadow-sm'
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Recycle
              </button>
              <button
                onClick={() => { setFilter('compost'); setPage(1); setScans([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  filter === 'compost'
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark font-bold shadow-sm'
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Compost
              </button>
              <button
                onClick={() => { setFilter('trash'); setPage(1); setScans([]); setLoading(true); }}
                className={`flex-1 py-1.5 px-3 rounded text-sm font-medium transition-all ${
                  filter === 'trash'
                    ? 'bg-white dark:bg-primary text-gray-900 dark:text-background-dark font-bold shadow-sm'
                    : 'text-gray-500 dark:text-white/60 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                Trash
              </button>
            </div>
          </div>

          {/* Scans List */}
          {scans.length === 0 && !loading ? (
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                <span className="material-symbols-outlined text-4xl">history</span>
              </div>
              <h3 className="text-lg font-bold mb-2">No scans yet</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm text-center mb-6">
                Start scanning items to see your history here
              </p>
              <button
                onClick={() => navigate('/scanner')}
                className="px-6 py-3 bg-primary rounded-xl text-background-dark font-bold hover:bg-[#0fd650] transition-colors"
              >
                Start Scanning
              </button>
            </div>
          ) : (
            <div className="px-4 space-y-3">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="bg-white dark:bg-surface-dark rounded-xl p-4 border border-black/5 dark:border-white/5 flex items-center gap-4"
                >
                  <div className={`w-12 h-12 rounded-full ${getCategoryColor(scan.category)} flex items-center justify-center text-white flex-shrink-0`}>
                    <span className="material-symbols-outlined">{getCategoryIcon(scan.category)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold dark:text-white truncate">{scan.item_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {formatDate(scan.created_at)}
                      </span>
                      <span className="text-xs text-primary font-medium">
                        {Math.round(scan.confidence)}% confidence
                      </span>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="px-2 py-1 rounded text-[10px] font-bold uppercase bg-primary/20 text-primary border border-primary/20">
                      {scan.category}
                    </span>
                  </div>
                </div>
              ))}

              {hasMore && (
                <button
                  onClick={() => { setPage(prev => prev + 1); setLoading(true); }}
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-white dark:bg-surface-dark border border-black/5 dark:border-white/5 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors disabled:opacity-50"
                >
                  {loading ? 'Loading...' : 'Load More'}
                </button>
              )}
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

export default HistoryPage

