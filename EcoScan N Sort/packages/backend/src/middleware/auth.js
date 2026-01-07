import jwt from 'jsonwebtoken'
import { getDatabase } from '../database/index.js'

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided. Authorization required.' 
      })
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
      
      // Verify user still exists
      const db = getDatabase()
      const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(decoded.userId)
      
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'User not found. Token invalid.' 
        })
      }
      
      req.user = user
      next()
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Token expired. Please login again.' 
        })
      }
      if (error.name === 'JsonWebTokenError') {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token.' 
        })
      }
      throw error
    }
  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error', 
      error: error.message 
    })
  }
}

export const optionalAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization
    
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-in-production')
        const db = getDatabase()
        const user = db.prepare('SELECT id, email, username FROM users WHERE id = ?').get(decoded.userId)
        
        if (user) {
          req.user = user
        }
      } catch (error) {
        // Ignore token errors for optional auth
      }
    }
    
    next()
  } catch (error) {
    next()
  }
}

