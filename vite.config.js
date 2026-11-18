import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'

function nsSoansPriceBackendPlugin() {
  const dbPath = path.resolve('src/data/priceDatabase.json')
  const historyPath = path.resolve('src/data/priceImportHistory.json')

  function readJsonSafe(filePath, fallback) {
    try {
      if (fs.existsSync(filePath)) {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'))
      }
    } catch (e) {
      console.error('Error reading JSON:', filePath, e)
    }
    return fallback
  }

  function writeJsonAtomic(filePath, data) {
    const tmpPath = `${filePath}.tmp`
    fs.writeFileSync(tmpPath, JSON.stringify(data, null, 2), 'utf8')
    fs.renameSync(tmpPath, filePath)
  }

  const attachMiddleware = (middlewares) => {
    middlewares.use('/api/admin/price-state', (req, res, next) => {
      if (req.method !== 'GET') return next()
      const overrides = readJsonSafe(dbPath, {})
      const history = readJsonSafe(historyPath, [])
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ overrides, history }))
    })

    middlewares.use('/api/admin/price-bulk-import', (req, res, next) => {
      if (req.method !== 'POST') return next()
      let body = ''
      req.on('data', (chunk) => {
        body += chunk.toString()
      })
      req.on('end', () => {
        try {
          const payload = JSON.parse(body || '{}')
          if (payload.overrides && typeof payload.overrides === 'object') {
            writeJsonAtomic(dbPath, payload.overrides)
          }
          if (Array.isArray(payload.replaceHistory)) {
            writeJsonAtomic(historyPath, payload.replaceHistory)
          } else if (payload.historyEntry) {
            const existingHistory = readJsonSafe(historyPath, [])
            const nextHistory = [payload.historyEntry, ...existingHistory]
            writeJsonAtomic(historyPath, nextHistory)
          }
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: true }))
        } catch (err) {
          res.statusCode = 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ success: false, error: err.message }))
        }
      })
    })
  }

  return {
    name: 'ns-soans-price-backend',
    configureServer(server) {
      attachMiddleware(server.middlewares)
    },
    configurePreviewServer(server) {
      attachMiddleware(server.middlewares)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), nsSoansPriceBackendPlugin()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom', 'zustand'],
          'vendor-ui': ['lucide-react', 'canvas-confetti']
        }
      }
    },
    chunkSizeWarningLimit: 1200
  },
  server: {
    port: 3000,
    open: false
  }
})
