import express from 'express'
import { body, validationResult } from 'express-validator'
import { authenticate, optionalAuth } from '../middleware/auth.js'
import { getDatabase } from '../database/index.js'

const router = express.Router()

// Create a scan
router.post('/', [
  optionalAuth,
  body('item_name').notEmpty().trim(),
  body('item_type').notEmpty().trim(),
  body('category').isIn(['recycle', 'compost', 'trash']),
  body('confidence').isFloat({ min: 0, max: 100 }),
  body('location').optional().trim(),
  body('image_url').optional().isURL()
], (req, res) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      })
    }

    const { item_name, item_type, category, confidence, location, image_url } = req.body
    const userId = req.user?.id || null

    const db = getDatabase()

    // Insert scan
    const result = db.prepare(`
      INSERT INTO scans (user_id, item_name, item_type, category, confidence, location, image_url)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(userId, item_name, item_type, category, confidence, location || null, image_url || null)

    const scan = db.prepare('SELECT * FROM scans WHERE id = ?').get(result.lastInsertRowid)

    // Update daily stats
    const today = new Date().toISOString().split('T')[0]
    const stats = db.prepare('SELECT * FROM daily_stats WHERE date = ?').get(today)
    
    if (stats) {
      db.prepare(`
        UPDATE daily_stats 
        SET total_scans = total_scans + 1,
            ${category}_count = ${category}_count + 1
        WHERE date = ?
      `).run(today)
    } else {
      db.prepare(`
        INSERT INTO daily_stats (date, total_scans, ${category}_count)
        VALUES (?, 1, 1)
      `).run(today)
    }

    res.status(201).json({
      success: true,
      message: 'Scan recorded successfully',
      data: { scan }
    })
  } catch (error) {
    console.error('Create scan error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to create scan',
      error: error.message
    })
  }
})

// Get user's scans (requires auth)
router.get('/my-scans', authenticate, (req, res) => {
  try {
    const { page = 1, limit = 20, category } = req.query
    const offset = (parseInt(page) - 1) * parseInt(limit)

    const db = getDatabase()

    let query = 'SELECT * FROM scans WHERE user_id = ?'
    let params = [req.user.id]

    if (category) {
      query += ' AND category = ?'
      params.push(category)
    }

    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    params.push(parseInt(limit), offset)

    const scans = db.prepare(query).all(...params)

    // Get total count
    let countQuery = 'SELECT COUNT(*) as total FROM scans WHERE user_id = ?'
    let countParams = [req.user.id]
    if (category) {
      countQuery += ' AND category = ?'
      countParams.push(category)
    }
    const { total } = db.prepare(countQuery).get(...countParams)

    res.json({
      success: true,
      data: {
        scans,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: total,
          totalPages: Math.ceil(total / parseInt(limit))
        }
      }
    })
  } catch (error) {
    console.error('Get scans error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch scans',
      error: error.message
    })
  }
})

// Get scan statistics
router.get('/stats', authenticate, (req, res) => {
  try {
    const db = getDatabase()

    // User stats
    const userStats = db.prepare(`
      SELECT 
        COUNT(*) as total_scans,
        SUM(CASE WHEN category = 'recycle' THEN 1 ELSE 0 END) as recycle_count,
        SUM(CASE WHEN category = 'compost' THEN 1 ELSE 0 END) as compost_count,
        SUM(CASE WHEN category = 'trash' THEN 1 ELSE 0 END) as trash_count,
        AVG(confidence) as avg_confidence
      FROM scans
      WHERE user_id = ?
    `).get(req.user.id)

    // Recent scans
    const recentScans = db.prepare(`
      SELECT * FROM scans 
      WHERE user_id = ?
      ORDER BY created_at DESC
      LIMIT 10
    `).all(req.user.id)

    res.json({
      success: true,
      data: {
        stats: userStats,
        recent_scans: recentScans
      }
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    })
  }
})

export default router

