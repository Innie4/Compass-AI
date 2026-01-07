import express from 'express'
import { getDatabase } from '../database/index.js'
import { optionalAuth } from '../middleware/auth.js'

const router = express.Router()

// Get today's scan count
router.get('/today', optionalAuth, (req, res) => {
  try {
    const db = getDatabase()
    const today = new Date().toISOString().split('T')[0]

    // Get today's stats
    let stats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today)

    if (!stats) {
      // If no stats for today, create empty entry
      db.prepare(`
        INSERT INTO daily_stats (date, total_scans, unique_users, recycle_count, compost_count, trash_count)
        VALUES (?, 0, 0, 0, 0, 0)
      `).run(today)
      stats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today)
    }

    res.json({
      success: true,
      data: {
        date: today,
        total_scans: stats.total_scans || 0,
        unique_users: stats.unique_users || 0,
        recycle_count: stats.recycle_count || 0,
        compost_count: stats.compost_count || 0,
        trash_count: stats.trash_count || 0
      }
    })
  } catch (error) {
    console.error('Get today stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s statistics',
      error: error.message
    })
  }
})

// Get global statistics
router.get('/global', (req, res) => {
  try {
    const db = getDatabase()

    // Total scans
    const totalScans = db.prepare('SELECT COUNT(*) as count FROM scans').get()

    // Total users
    const totalUsers = db.prepare('SELECT COUNT(*) as count FROM users').get()

    // Category breakdown
    const categoryBreakdown = db.prepare(`
      SELECT 
        category,
        COUNT(*) as count,
        AVG(confidence) as avg_confidence
      FROM scans
      GROUP BY category
    `).all()

    // Recent scans count (last 24 hours)
    const recentScans = db.prepare(`
      SELECT COUNT(*) as count
      FROM scans
      WHERE created_at >= datetime('now', '-1 day')
    `).get()

    res.json({
      success: true,
      data: {
        total_scans: totalScans.count,
        total_users: totalUsers.count,
        recent_24h_scans: recentScans.count,
        category_breakdown: categoryBreakdown
      }
    })
  } catch (error) {
    console.error('Get global stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global statistics',
      error: error.message
    })
  }
})

// Get daily stats for a date range
router.get('/daily', (req, res) => {
  try {
    const { start_date, end_date } = req.query

    if (!start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: 'start_date and end_date query parameters are required (YYYY-MM-DD format)'
      })
    }

    const db = getDatabase()

    const dailyStats = db.prepare(`
      SELECT * FROM daily_stats
      WHERE date BETWEEN ? AND ?
      ORDER BY date DESC
    `).all(start_date, end_date)

    res.json({
      success: true,
      data: { daily_stats: dailyStats }
    })
  } catch (error) {
    console.error('Get daily stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily statistics',
      error: error.message
    })
  }
})

export default router

