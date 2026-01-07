import { useState } from 'react'

function HelpModal({ isOpen, onClose }) {
  if (!isOpen) return null

  const tips = [
    {
      icon: 'photo_camera',
      title: 'Good Lighting',
      description: 'Make sure the item is well-lit for better detection accuracy.'
    },
    {
      icon: 'center_focus_weak',
      title: 'Focus on Label',
      description: 'Point the camera at recycling symbols or product labels when possible.'
    },
    {
      icon: 'back_hand',
      title: 'Hold Steady',
      description: 'Keep your device steady for a few seconds to allow the AI to analyze.'
    },
    {
      icon: 'photo_library',
      title: 'Clean Items',
      description: 'Remove food residue and rinse containers before scanning for best results.'
    }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-background-dark rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Scanning Tips</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
        </div>

        <div className="space-y-4">
          {tips.map((tip, index) => (
            <div key={index} className="flex gap-4 p-4 bg-white dark:bg-surface-dark rounded-xl border border-black/5 dark:border-white/5">
              <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                <span className="material-symbols-outlined">{tip.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold dark:text-white mb-1">{tip.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">{tip.description}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full mt-6 h-12 bg-primary rounded-xl text-background-dark font-bold hover:bg-[#0fd650] transition-colors"
        >
          Got it!
        </button>
      </div>
    </div>
  )
}

export default HelpModal

