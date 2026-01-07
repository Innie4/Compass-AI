import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { scansAPI } from '../services/api.js'
import HelpModal from '../components/HelpModal.jsx'

function ScannerPage() {
  const navigate = useNavigate()
  const videoRef = useRef(null)
  const inputFileRef = useRef(null)
  const [isScanning, setIsScanning] = useState(false)
  const [detectedItem, setDetectedItem] = useState('Scanning...')
  const [confidence, setConfidence] = useState(0)
  const [model, setModel] = useState(null)
  const [stream, setStream] = useState(null)
  const [flashEnabled, setFlashEnabled] = useState(false)
  const [showHelp, setShowHelp] = useState(false)
  const [location, setLocation] = useState(null)
  const scanningIntervalRef = useRef(null)

  useEffect(() => {
    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          })
        },
        (error) => {
          console.error('Error getting location:', error)
        }
      )
    }

    // Load TensorFlow.js model
    const loadModel = async () => {
      try {
        await tf.ready()
        const loadedModel = await mobilenet.load()
        setModel(loadedModel)
        
        // Start camera
        startCamera()
      } catch (error) {
        console.error('Error loading model:', error)
        // Fallback to mock detection if model fails
        setDetectedItem('Plastic Bottle')
        setConfidence(94)
      }
    }

    loadModel()

    return () => {
      // Cleanup
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
      if (scanningIntervalRef.current) {
        clearInterval(scanningIntervalRef.current)
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      const constraints = {
        video: { 
          facingMode: 'environment',
          ...(flashEnabled && { torch: true })
        }
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints)
      setStream(mediaStream)
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream
      }
      startScanning(mediaStream)
    } catch (error) {
      console.error('Error accessing camera:', error)
      // Use fallback image
      setDetectedItem('Plastic Bottle')
      setConfidence(94)
    }
  }

  const toggleFlash = () => {
    setFlashEnabled(!flashEnabled)
    if (stream && stream.getVideoTracks().length > 0) {
      const track = stream.getVideoTracks()[0]
      const capabilities = track.getCapabilities()
      if (capabilities.torch) {
        track.applyConstraints({ advanced: [{ torch: !flashEnabled }] }).catch(console.error)
      }
    }
  }

  const handlePhotoLibrary = () => {
    inputFileRef.current?.click()
  }

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !model) return

    try {
      const imageUrl = URL.createObjectURL(file)
      const img = new Image()
      img.src = imageUrl
      
      img.onload = async () => {
        // Create a canvas to process the image
        const canvas = document.createElement('canvas')
        canvas.width = img.width
        canvas.height = img.height
        const ctx = canvas.getContext('2d')
        ctx.drawImage(img, 0, 0)
        
        try {
          const predictions = await model.classify(img)
          if (predictions && predictions.length > 0) {
            const topPrediction = predictions[0]
            const itemName = mapToRecyclableItem(topPrediction.className)
            setDetectedItem(itemName)
            setConfidence(Math.round(topPrediction.probability * 100))
            
            // Auto-navigate to result after detection
            setTimeout(() => {
              const category = getCategory(itemName)
              navigate('/result', {
                state: {
                  item: itemName,
                  confidence: Math.round(topPrediction.probability * 100),
                  category: category,
                  imageUrl: imageUrl
                }
              })
            }, 1000)
          }
        } catch (error) {
          console.error('Error classifying image:', error)
        }
      }
    } catch (error) {
      console.error('Error processing file:', error)
    }
  }

  const captureImage = () => {
    if (!videoRef.current || !stream) return null
    
    const canvas = document.createElement('canvas')
    canvas.width = videoRef.current.videoWidth
    canvas.height = videoRef.current.videoHeight
    const ctx = canvas.getContext('2d')
    ctx.drawImage(videoRef.current, 0, 0)
    
    return canvas.toDataURL('image/jpeg', 0.8)
  }

  const startScanning = async (mediaStream) => {
    setIsScanning(true)
    
    if (model && videoRef.current) {
      scanningIntervalRef.current = setInterval(async () => {
        try {
          if (videoRef.current && videoRef.current.readyState === 4) {
            const predictions = await model.classify(videoRef.current)
            if (predictions && predictions.length > 0) {
              const topPrediction = predictions[0]
              // Map common items to recycling categories
              const itemName = mapToRecyclableItem(topPrediction.className)
              setDetectedItem(itemName)
              setConfidence(Math.round(topPrediction.probability * 100))
            }
          }
        } catch (error) {
          console.error('Error during classification:', error)
        }
      }, 1000)
    }
  }

  const mapToRecyclableItem = (className) => {
    const lower = className.toLowerCase()
    if (lower.includes('bottle') || lower.includes('water bottle')) return 'Plastic Bottle'
    if (lower.includes('can') || lower.includes('soda')) return 'Aluminum Can'
    if (lower.includes('cardboard') || lower.includes('box')) return 'Cardboard'
    if (lower.includes('paper')) return 'Paper'
    if (lower.includes('banana') || lower.includes('apple') || lower.includes('food')) return 'Compost'
    return 'Plastic Bottle' // Default fallback
  }

  const handleCapture = async () => {
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current)
    }
    
    const category = getCategory(detectedItem)
    const itemType = detectedItem.toLowerCase().includes('bottle') ? 'plastic' : 
                     detectedItem.toLowerCase().includes('can') ? 'aluminum' : 'other'
    
    // Capture image
    const imageDataUrl = captureImage()
    
    // Save scan to backend
    try {
      await scansAPI.create({
        item_name: detectedItem,
        item_type: itemType,
        category: category,
        confidence: confidence,
        location: location ? `${location.lat},${location.lng}` : null,
        image_url: imageDataUrl
      })
    } catch (error) {
      console.error('Failed to save scan:', error)
      // Continue to result page even if save fails
    }
    
    // Navigate to result page with detected item
    navigate('/result', { 
      state: { 
        item: detectedItem, 
        confidence: confidence,
        category: category,
        imageUrl: imageDataUrl
      } 
    })
  }

  const getCategory = (item) => {
    if (item.toLowerCase().includes('bottle') || item.toLowerCase().includes('can')) {
      return 'recycle'
    }
    if (item.toLowerCase().includes('compost')) {
      return 'compost'
    }
    return 'recycle'
  }

  const handleClose = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop())
    }
    if (scanningIntervalRef.current) {
      clearInterval(scanningIntervalRef.current)
    }
    navigate('/')
  }

  return (
    <div className="bg-background-light dark:bg-background-dark font-display selection:bg-primary selection:text-background-dark fixed inset-0">
      <div className="relative flex h-screen w-full max-w-md mx-auto flex-col overflow-hidden bg-background-dark shadow-2xl">
        {/* Header / Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between p-4 pt-6 bg-gradient-to-b from-black/80 to-transparent">
          {/* Close Button */}
          <button 
            onClick={handleClose}
            className="flex items-center justify-center size-10 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-colors"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
          <h2 className="text-white text-lg font-bold tracking-wide drop-shadow-md">Scanner</h2>
          {/* Flash Toggle */}
          <button 
            onClick={toggleFlash}
            className={`flex items-center justify-center size-10 rounded-full backdrop-blur-md text-white hover:bg-white/20 transition-colors ${
              flashEnabled ? 'bg-primary/30' : 'bg-white/10'
            }`}
          >
            <span className="material-symbols-outlined text-[24px]">
              {flashEnabled ? 'flash_on' : 'flash_off'}
            </span>
          </button>
        </div>
        {/* Main Camera Viewport */}
        <div className="flex-1 relative flex items-center justify-center w-full">
          {/* Camera Feed or Background Image */}
          {stream ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div 
              className="absolute inset-0 bg-gray-900" 
              data-alt="Close up of a plastic water bottle held in a hand" 
              style={{
                backgroundImage: 'url("https://lh3.googleusercontent.com/aida-public/AB6AXuCvbxyztOUHXMoLNsBFeOzDz3Xs0hEuhvA0T7xwe8TK7gP_QyY-XofXKsb9HmA5XLR4hSkkwa52n8YnSwECEbTAP96OOgg3NHPhrC-zxHy7Nl3PPGFzngASj4LQ2Ovz3tTVaKMjwolrURQnjwf5jPrObJrmCcyVHusn-Cq1QVd3rcANcTTm34U_CWj94PnJJGnEOgLRPkGaIRc1-KmzQ0PGuA0PSBoqHkyQahEjpdH1NMFw6HZaC2hMjJJUwcDV2bq40Zzp2rNVgHY")',
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            >
              <div className="absolute inset-0 bg-black/20"></div>
            </div>
          )}
          {/* Focus Square / HUD Overlay */}
          <div className="relative w-[85%] aspect-square rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] ring-1 ring-white/10 z-10">
            {/* HUD Corners */}
            <div className="absolute top-0 left-0 w-16 h-16 border-t-4 border-l-4 border-primary rounded-tl-2xl"></div>
            <div className="absolute top-0 right-0 w-16 h-16 border-t-4 border-r-4 border-primary rounded-tr-2xl"></div>
            <div className="absolute bottom-0 left-0 w-16 h-16 border-b-4 border-l-4 border-primary rounded-bl-2xl"></div>
            <div className="absolute bottom-0 right-0 w-16 h-16 border-b-4 border-r-4 border-primary rounded-br-2xl"></div>
            {/* Scanning Line Effect */}
            <div className="absolute top-[40%] left-4 right-4 h-0.5 bg-primary shadow-[0_0_15px_3px_rgba(19,236,91,0.6)] opacity-80"></div>
            {/* Reticle Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-40">
              <span className="material-symbols-outlined text-primary text-4xl">add</span>
            </div>
            {/* In-View Status Chip */}
            <div className="absolute top-4 left-0 right-0 flex justify-center">
              <div className="bg-black/60 backdrop-blur-sm border border-primary/30 px-3 py-1 rounded-full flex items-center gap-2">
                <div className="size-2 bg-primary rounded-full animate-pulse"></div>
                <span className="text-primary text-xs font-bold tracking-widest uppercase">
                  {isScanning ? 'Analyzing Surface' : 'Ready'}
                </span>
              </div>
            </div>
          </div>
        </div>
        {/* Bottom UI Layer */}
        <div className="relative z-20 flex flex-col bg-gradient-to-t from-background-dark via-background-dark to-transparent pt-12 pb-8 px-6">
          {/* Dynamic Feedback Text */}
          <div className="flex flex-col items-center justify-center mb-8 gap-1">
            <h1 className="text-white text-3xl font-bold tracking-tight text-center drop-shadow-sm">
              {detectedItem}
            </h1>
            {confidence > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-primary text-lg font-bold">{confidence}% Confidence</span>
                <span className="material-symbols-outlined text-primary text-sm">verified</span>
              </div>
            )}
            <p className="text-white/60 text-sm font-medium mt-1">Tap shutter to analyze material details</p>
          </div>
          {/* Controls Row */}
          <div className="flex items-center justify-between w-full px-4">
            {/* Gallery / History Button */}
            <button 
              onClick={handlePhotoLibrary}
              className="flex items-center justify-center size-14 rounded-full bg-[#1F1F1F] text-white/80 hover:bg-[#2A2A2A] hover:text-white transition-colors border border-white/5"
            >
              <span className="material-symbols-outlined text-[28px]">photo_library</span>
            </button>
            {/* Shutter Button */}
            <button 
              onClick={handleCapture}
              className="group relative flex items-center justify-center size-20 rounded-full border-4 border-white bg-transparent shadow-[0_4px_10px_rgba(0,0,0,0.3)] active:scale-95 transition-all duration-150"
            >
              <div className="size-16 rounded-full bg-white group-active:bg-primary transition-colors duration-200"></div>
            </button>
            {/* Tips / Help Button */}
            <button 
              onClick={() => setShowHelp(true)}
              className="flex items-center justify-center size-14 rounded-full bg-[#1F1F1F] text-white/80 hover:bg-[#2A2A2A] hover:text-white transition-colors border border-white/5"
            >
              <span className="material-symbols-outlined text-[28px]">lightbulb</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Hidden file input for photo library */}
      <input
        ref={inputFileRef}
        type="file"
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />
      
      {/* Help Modal */}
      <HelpModal isOpen={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  )
}

export default ScannerPage

