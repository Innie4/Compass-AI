import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import ErrorReportModal from '../components/ErrorReportModal.jsx'

function ResultPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { item = 'PET Plastic Bottle', confidence = 98, category = 'recycle', imageUrl } = location.state || {}
  const [showErrorReport, setShowErrorReport] = useState(false)

  const getCategoryColor = () => {
    switch (category) {
      case 'compost':
        return 'bg-amber-600'
      case 'trash':
        return 'bg-gray-600'
      default:
        return 'bg-primary'
    }
  }

  const getCategoryIcon = () => {
    switch (category) {
      case 'compost':
        return 'compost'
      case 'trash':
        return 'delete'
      default:
        return 'recycling'
    }
  }

  const getCategoryText = () => {
    switch (category) {
      case 'compost':
        return 'Compost It'
      case 'trash':
        return 'Landfill / Trash'
      default:
        return 'Recycle It'
    }
  }

  const getCategorySubtext = () => {
    switch (category) {
      case 'compost':
        return 'Add to your compost bin'
      case 'trash':
        return 'Place in trash bin'
      default:
        return 'Accepted in your local curbside bin'
    }
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-slate-900 dark:text-white antialiased selection:bg-primary selection:text-background-dark min-h-screen">
      <div className="relative flex h-full min-h-screen w-full flex-col overflow-x-hidden max-w-md mx-auto bg-background-light dark:bg-background-dark pb-24">
        {/* TopAppBar */}
        <div className="flex items-center p-4 justify-between sticky top-0 z-20 bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md">
          <button 
            onClick={() => navigate('/scanner')}
            className="text-slate-900 dark:text-white flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">arrow_back</span>
          </button>
          <h2 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] flex-1 text-center pr-12">Analysis Result</h2>
        </div>
        {/* Main Content */}
        <div className="px-4 flex flex-col gap-6">
          {/* Verdict Banner */}
          <div className={`w-full ${getCategoryColor()} rounded-2xl p-6 shadow-lg shadow-primary/20 flex flex-col items-center justify-center text-center animate-fade-in relative overflow-hidden group`}>
            {/* Abstract decorative circle */}
            <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute -left-8 -bottom-8 w-24 h-24 bg-black/5 rounded-full blur-xl"></div>
            <span className={`material-symbols-outlined text-[48px] ${category === 'recycle' ? 'text-background-dark' : 'text-white'} mb-2 font-bold z-10`}>
              {getCategoryIcon()}
            </span>
            <h1 className={`${category === 'recycle' ? 'text-background-dark' : 'text-white'} text-3xl font-extrabold tracking-tight uppercase z-10`}>
              {getCategoryText()}
            </h1>
            <p className={`${category === 'recycle' ? 'text-background-dark/80' : 'text-white/80'} font-medium text-sm mt-1 z-10`}>
              {getCategorySubtext()}
            </p>
          </div>
          {/* Item Snapshot & Info */}
          <div className="flex flex-col @container">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-slate-200 dark:border-white/5">
              <div className="relative shrink-0">
                <div 
                  className="bg-center bg-no-repeat bg-cover rounded-lg h-24 w-24 shadow-inner" 
                  data-alt="Close up photo of a clear plastic water bottle with label" 
                  style={{
                    backgroundImage: imageUrl 
                      ? `url("${imageUrl}")` 
                      : 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuDPxBK2_xu10VSckD0IsLSSsGQcFMubYtX1FFqrBhipGaP35GCCbjzgwjWHwZ1iAhxYWP7PzOZoNBsLKHorWBUhHGxFVwLt-_qcBq7PQ2fnyJZvy4G8AsiUDHzOffQXE3uoe4hDwxQC2d9QuDohXtk3uKgk6cWICH_REhQn9AEI5EBYArmVtqOlA13zhRVrT3dO2fEyKVeL4CLPYW7HoZFnE6bUa0xz_fG2WqkQ7ilmiJ3-HnUvQUY3bf6J8ZKczSBBohQDotHjitg")'
                  }}
                >
                </div>
                <div className="absolute -bottom-2 -right-2 bg-background-dark border border-white/10 rounded-full p-1.5 flex items-center justify-center">
                  <span className="material-symbols-outlined text-primary text-[16px]">check</span>
                </div>
              </div>
              <div className="flex flex-col text-center sm:text-left flex-1 min-w-0">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/20 text-primary border border-primary/20">
                    {item.includes('Plastic') ? 'Plastic #1' : item.includes('Can') ? 'Aluminum' : 'Item'}
                  </span>
                </div>
                <p className="text-slate-900 dark:text-white text-xl font-bold leading-tight tracking-tight truncate w-full">{item}</p>
                <p className="text-slate-500 dark:text-[#92c9a4] text-sm font-medium leading-normal mt-1">High confidence match ({confidence}%)</p>
              </div>
            </div>
          </div>
          {/* Why Section */}
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">info</span>
              Why?
            </h3>
            <div className="bg-white dark:bg-surface-dark p-4 rounded-xl border border-slate-200 dark:border-white/5">
              <p className="text-slate-600 dark:text-slate-300 text-base font-normal leading-relaxed">
                This is <span className="text-slate-900 dark:text-white font-semibold">{item}</span>, which is {category === 'recycle' ? 'highly recyclable' : category === 'compost' ? 'suitable for composting' : 'not recyclable'} in Alameda County. {category === 'recycle' ? 'The clear plastic body is easily processed into new materials.' : category === 'compost' ? 'It will break down naturally in a compost environment.' : 'It should be disposed of in regular trash.'}
              </p>
            </div>
          </div>
          {/* Preparation Checklist */}
          <div className="flex flex-col">
            <h3 className="text-slate-900 dark:text-white text-lg font-bold leading-tight tracking-[-0.015em] pb-3 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">checklist</span>
              Preparation
            </h3>
            <div className="bg-white dark:bg-surface-dark rounded-xl border border-slate-200 dark:border-white/5 overflow-hidden">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-white/5">
                <div className="bg-primary/20 p-2 rounded-full shrink-0 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">water_drop</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-bold text-base">Empty liquids</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Ensure the bottle is completely empty.</span>
                </div>
              </div>
              {/* Step 2 */}
              <div className="flex items-start gap-4 p-4 border-b border-slate-100 dark:border-white/5">
                <div className="bg-primary/20 p-2 rounded-full shrink-0 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">cleaning_services</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-bold text-base">Rinse lightly</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">A quick rinse prevents contamination.</span>
                </div>
              </div>
              {/* Step 3 */}
              <div className="flex items-start gap-4 p-4">
                <div className="bg-primary/20 p-2 rounded-full shrink-0 text-primary flex items-center justify-center">
                  <span className="material-symbols-outlined text-[20px]">delete_outline</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-slate-900 dark:text-white font-bold text-base">Remove cap</span>
                  <span className="text-slate-500 dark:text-slate-400 text-sm">Put the small plastic cap in the trash.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Sticky Footer Actions */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background-light via-background-light to-transparent dark:from-background-dark dark:via-background-dark dark:to-transparent z-50 flex flex-col gap-3 items-center max-w-md mx-auto">
          <button 
            onClick={() => navigate('/scanner')}
            className="w-full bg-primary hover:bg-green-400 active:scale-[0.98] transition-all text-background-dark font-bold text-lg h-14 rounded-xl shadow-lg shadow-primary/25 flex items-center justify-center gap-2"
          >
            <span className="material-symbols-outlined">center_focus_weak</span>
            Scan Another Item
          </button>
          <button 
            onClick={() => setShowErrorReport(true)}
            className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">flag</span>
            Found a mistake? Report it
          </button>
        </div>
      </div>
      
      {/* Error Report Modal */}
      <ErrorReportModal 
        isOpen={showErrorReport} 
        onClose={() => setShowErrorReport(false)}
        itemData={{ item, category, confidence }}
      />
    </div>
  )
}

export default ResultPage

