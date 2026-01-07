import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function SettingsPage() {
  const navigate = useNavigate()
  const [darkMode, setDarkMode] = useState(false)
  const [notifications, setNotifications] = useState(true)
  const [autoScan, setAutoScan] = useState(true)

  useEffect(() => {
    // Check if dark mode is enabled
    const isDark = document.documentElement.classList.contains('dark')
    setDarkMode(isDark)

    // Load saved preferences
    const savedNotifications = localStorage.getItem('notifications') !== 'false'
    const savedAutoScan = localStorage.getItem('autoScan') !== 'false'
    setNotifications(savedNotifications)
    setAutoScan(savedAutoScan)
  }, [])

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode
    setDarkMode(newDarkMode)
    if (newDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('darkMode', 'true')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('darkMode', 'false')
    }
  }

  const toggleNotifications = () => {
    const newValue = !notifications
    setNotifications(newValue)
    localStorage.setItem('notifications', newValue.toString())
  }

  const toggleAutoScan = () => {
    const newValue = !autoScan
    setAutoScan(newValue)
    localStorage.setItem('autoScan', newValue.toString())
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-background-dark min-h-screen">
      <div className="relative flex flex-col min-h-screen w-full mx-auto max-w-md bg-background-light dark:bg-background-dark shadow-2xl overflow-hidden">
        {/* Header */}
        <header className="sticky top-0 z-20 flex items-center justify-between px-4 py-3 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-black/5 dark:border-white/5">
          <button 
            onClick={() => navigate('/profile')}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-xl font-extrabold tracking-tight dark:text-white text-gray-900">Settings</h2>
          <div className="w-12"></div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-24 scrollbar-hide">
          {/* Appearance Section */}
          <section className="px-4 pt-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs mb-4">Appearance</h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <button
                onClick={toggleDarkMode}
                className="w-full flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">dark_mode</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold dark:text-white">Dark Mode</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Toggle dark theme</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${darkMode ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
              </button>
            </div>
          </section>

          {/* Scanning Preferences */}
          <section className="px-4 pt-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs mb-4">Scanning</h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <button
                onClick={toggleAutoScan}
                className="w-full flex items-center justify-between p-4 border-b border-black/5 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">qr_code_scanner</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold dark:text-white">Auto-scan</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Automatically detect items</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${autoScan ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${autoScan ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
              </button>
            </div>
          </section>

          {/* Notifications */}
          <section className="px-4 pt-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs mb-4">Notifications</h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <button
                onClick={toggleNotifications}
                className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">notifications</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-bold dark:text-white">Enable Notifications</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Get updates and tips</p>
                  </div>
                </div>
                <div className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-slate-300'}`}>
                  <div className={`w-5 h-5 rounded-full bg-white transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'} mt-0.5`}></div>
                </div>
              </button>
            </div>
          </section>

          {/* About Section */}
          <section className="px-4 pt-6 pb-6">
            <h3 className="text-lg font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 text-xs mb-4">About</h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5 overflow-hidden">
              <div className="p-4 border-b border-black/5 dark:border-white/5">
                <p className="text-sm font-bold dark:text-white mb-1">Version</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">1.0.0</p>
              </div>
              <div className="p-4">
                <p className="text-sm font-bold dark:text-white mb-1">EcoScan & Sort</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI-powered recycling scanner</p>
              </div>
            </div>
          </section>
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

export default SettingsPage

