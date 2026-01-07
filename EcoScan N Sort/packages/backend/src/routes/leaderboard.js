import express from 'express'
import { getDatabase } from '../database/index.js'

const router = express.Router()

// Get leaderboard
router.get('/', (req, res) => {
  try {
    const { type = 'school', limit = 10 } = req.query

    if (!['school', 'neighborhood'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid type. Must be "school" or "neighborhood"'
      })
    }

    const db = getDatabase()

    const leaderboard = db.prepare(`
      SELECT * FROM leaderboard
      WHERE type = ?
      ORDER BY score DESC, purity_score DESC
      LIMIT ?
    `).all(type, parseInt(limit))

    res.json({
      success: true,
      data: { leaderboard }
    })
  } catch (error) {
    console.error('Get leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    })
  }
})

// Update leaderboard entry (admin operation - in production, add auth middleware)
router.post('/update', (req, res) => {
  try {
    const { name, type, score, purity_score, total_scans, logo_url } = req.body

    if (!name || !type || !['school', 'neighborhood'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Name and valid type are required'
      })
    }

    const db = getDatabase()

    // Check if entry exists
    const existing = db.prepare('SELECT id FROM leaderboard WHERE name = ? AND type = ?').get(name, type)

    if (existing) {
      // Update existing
      db.prepare(`
        UPDATE leaderboard
        SET score = COALESCE(?, score),
            purity_score = COALESCE(?, purity_score),
            total_scans = COALESCE(?, total_scans),
            logo_url = COALESCE(?, logo_url),
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(score, purity_score, total_scans, logo_url, existing.id)

      const updated = db.prepare('SELECT * FROM leaderboard WHERE id = ?').get(existing.id)

      return res.json({
        success: true,
        message: 'Leaderboard entry updated',
        data: { entry: updated }
      })
    } else {
      // Create new
      const result = db.prepare(`
        INSERT INTO leaderboard (name, type, score, purity_score, total_scans, logo_url)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(
        name,
        type,
        score || 0,
        purity_score || 0.0,
        total_scans || 0,
        logo_url || null
      )

      const entry = db.prepare('SELECT * FROM leaderboard WHERE id = ?').get(result.lastInsertRowid)

      return res.status(201).json({
        success: true,
        message: 'Leaderboard entry created',
        data: { entry }
      })
    }
  } catch (error) {
    console.error('Update leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to update leaderboard',
      error: error.message
    })
  }
})

// Seed default leaderboard data
router.post('/seed', (req, res) => {
  try {
    const db = getDatabase()

    const defaultEntries = [
      { name: 'Lincoln High School', type: 'school', score: 9450, purity_score: 98.0, total_scans: 1250, logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB00HXViEZPxDHBbbf2pbTpaNlt_eVb_ko7tjTcN-puTVmnUkdcOJ1RBuZZ1S2L3e88Nq6Ir4J2PD9CNQ3b6vfyZqKcFVDOjaJ0VMHDKreTnY1bUOpR46n58YGbHMuretXYUGpE_MAdM_MmccJnOKg-JHFBM_wccjZ35aopGHy5Lp9lrUz0bCFsIWBtO7Ui31aadRW5FByQkNIVWFm6uTKIkNUgplZ6wZKEi54V1DnCquDiX1jnw33zQz8lpfdx3FbidGfr04rcQYc' },
      { name: 'Westside Elementary', type: 'school', score: 8200, purity_score: 94.0, total_scans: 1100, logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA_POifAFIGnZEaTU6N_jdgfXNdFp74UjT12sWBJd7JrRvGoDQl2x8TeP2QdoOWAkQl7S0muQd6-Bgsce1dlZn5p7h6TBLM003l6LQRjcThwFEHiOnWj8Wm9TRHuRdS4XRQQnpSkr0zU2eZe_GSAIqXc7x3j07v3gpngYwCWQiyUhSQnLUOA0o4LbdAge5ykX7p4Y5N6pbmWLaVveGJnYQ-oMbgqGkEqU0rRfLlT6MdOjbMzlvAB9bJFTBx2EM4iTu5tSb_BSAFjWI' },
      { name: 'Oak Creek Middle', type: 'school', score: 7800, purity_score: 91.0, total_scans: 950, logo_url: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkBTaJ1JTmpsO99Kfsm5jwrLUJoZrzJUOlzSvxiipeUlmpyAW1UrvOJfuK-3Q-CPzvMsXAsWkuq21kyLD4lEVrFmFdErUqoIWxgBfQfMpCuYEnvVTcNGU3FIMwtl7syRDCIPUr0SQtgzA3e42dZ3MDq7KQ2aMaUN2Ne8vNE_FtbAjO1y6c0Oc1k3evrng9vB37agjI96gfxBU3x231ITJPKdUtSRWZ8AscK7qb-5T-ZxxhaF4DqfBoTOjaXmqEwmBumNsdR_RwhWA' }
    ]

    const stmt = db.prepare(`
      INSERT OR REPLACE INTO leaderboard (name, type, score, purity_score, total_scans, logo_url)
      VALUES (?, ?, ?, ?, ?, ?)
    `)

    const insertMany = db.transaction((entries) => {
      for (const entry of entries) {
        stmt.run(entry.name, entry.type, entry.score, entry.purity_score, entry.total_scans, entry.logo_url)
      }
    })

    insertMany(defaultEntries)

    res.json({
      success: true,
      message: 'Leaderboard seeded successfully',
      data: { entries: defaultEntries.length }
    })
  } catch (error) {
    console.error('Seed leaderboard error:', error)
    res.status(500).json({
      success: false,
      message: 'Failed to seed leaderboard',
      error: error.message
    })
  }
})

export default router

