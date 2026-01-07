import { useState } from 'react'

function ErrorReportModal({ isOpen, onClose, itemData }) {
  const [issue, setIssue] = useState('')
  const [details, setDetails] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    
    // Simulate API call - in production, send to backend
    setTimeout(() => {
      setSubmitting(false)
      setSubmitted(true)
      setTimeout(() => {
        onClose()
        setIssue('')
        setDetails('')
        setSubmitted(false)
      }, 2000)
    }, 1000)
  }

  if (submitted) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
        <div 
          className="bg-background-light dark:bg-background-dark rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl text-center"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center text-primary mx-auto mb-4">
            <span className="material-symbols-outlined text-4xl">check_circle</span>
          </div>
          <h2 className="text-2xl font-bold dark:text-white mb-2">Thank You!</h2>
          <p className="text-slate-600 dark:text-slate-400">Your report has been submitted. We'll review it shortly.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-background-light dark:bg-background-dark rounded-2xl p-6 max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold dark:text-white">Report an Error</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
          >
            <span className="material-symbols-outlined text-slate-600 dark:text-slate-300">close</span>
          </button>
        </div>

        {itemData && (
          <div className="mb-4 p-3 bg-white dark:bg-surface-dark rounded-lg border border-black/5 dark:border-white/5">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Item:</p>
            <p className="font-bold dark:text-white">{itemData.item}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Category: {itemData.category}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              What's the issue?
            </label>
            <select
              value={issue}
              onChange={(e) => setIssue(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select an issue...</option>
              <option value="wrong_category">Wrong recycling category</option>
              <option value="missing_item">Item not recognized</option>
              <option value="incorrect_info">Incorrect information</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-slate-700 dark:text-slate-300">
              Additional details
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 rounded-xl bg-white dark:bg-surface-dark border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary resize-none"
              placeholder="Please provide more information..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-12 rounded-xl border border-slate-300 dark:border-white/20 text-slate-700 dark:text-slate-300 font-medium hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-12 bg-primary rounded-xl text-background-dark font-bold hover:bg-[#0fd650] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? 'Submitting...' : 'Submit Report'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ErrorReportModal

