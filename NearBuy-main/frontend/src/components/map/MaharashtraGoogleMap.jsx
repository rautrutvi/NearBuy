import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ZoomIn, ZoomOut, MapPin, Store, AlertTriangle, Layers,
  Compass, Maximize2, ShieldCheck, Navigation, ExternalLink,
  Sparkles, CheckCircle2, ChevronRight, X
} from 'lucide-react'

// Maharashtra Bounding Box (Southwest to Northeast)
const MAHARASHTRA_BOUNDS = [
  [15.4, 72.3], // Sindhudurg / South Coast
  [22.4, 81.2], // Nandurbar / MP border to Nagpur / East Vidarbha
]

// Google Maps Tile URL Options (No API key needed)
const GOOGLE_TILE_LAYERS = {
  streets: {
    name: 'Google Streets',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '© Google Maps',
  },
  hybrid: {
    name: 'Google Satellite',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '© Google Maps Satellite',
  },
  terrain: {
    name: 'Google Terrain',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    maxZoom: 20,
    attribution: '© Google Maps Terrain',
  },
}

export const MaharashtraGoogleMap = ({
  shops = [],
  floodReports = [],
  userLocation = { lat: 19.3837, lng: 72.8282 },
  onSelectShop,
}) => {
  const mapContainerRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const tileLayerRef = useRef(null)
  const markersLayerRef = useRef(null)
  const hazardsLayerRef = useRef(null)

  const [activeTileType, setActiveTileType] = useState('streets') // 'streets' | 'hybrid' | 'terrain'
  const [currentZoom, setCurrentZoom] = useState(16)
  const [selectedShop, setSelectedShop] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all') // 'all' | 'safe' | 'food' | 'pharmacy'

  // Initialize Leaflet Map locked to Maharashtra
  useEffect(() => {
    if (!mapContainerRef.current) return

    // Prevent re-initialization if map already exists
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove()
      mapInstanceRef.current = null
    }

    const defaultCenter = [userLocation?.lat || 19.3837, userLocation?.lng || 72.8282]

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 16,
      minZoom: 6, // Prevents zooming out beyond Maharashtra state
      maxZoom: 20, // Allows zooming down to storefront level
      maxBounds: MAHARASHTRA_BOUNDS, // Restricts panning strictly to Maharashtra
      maxBoundsViscosity: 1.0, // Elastic hard lock to state boundaries
      zoomControl: false, // We use custom sleek zoom controls
      attributionControl: true,
    })

    // Add Google Maps Tile Layer
    const currentLayerConfig = GOOGLE_TILE_LAYERS[activeTileType]
    const tileLayer = L.tileLayer(currentLayerConfig.url, {
      maxZoom: currentLayerConfig.maxZoom,
      subdomains: currentLayerConfig.subdomains,
      attribution: currentLayerConfig.attribution,
    }).addTo(map)

    tileLayerRef.current = tileLayer

    // Create Layer Groups for markers and hazard overlays
    markersLayerRef.current = L.layerGroup().addTo(map)
    hazardsLayerRef.current = L.layerGroup().addTo(map)

    // Track zoom level changes
    map.on('zoomend', () => {
      setCurrentZoom(map.getZoom())
    })

    mapInstanceRef.current = map

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [])

  // Switch Tile Layer (Streets / Satellite Hybrid / Terrain)
  useEffect(() => {
    if (!mapInstanceRef.current) return

    if (tileLayerRef.current) {
      mapInstanceRef.current.removeLayer(tileLayerRef.current)
    }

    const config = GOOGLE_TILE_LAYERS[activeTileType]
    const newTileLayer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom,
      subdomains: config.subdomains,
      attribution: config.attribution,
    }).addTo(mapInstanceRef.current)

    tileLayerRef.current = newTileLayer
  }, [activeTileType])

  // Update Markers & Overlays whenever shops, flood reports, or filters change
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current || !hazardsLayerRef.current) return

    markersLayerRef.current.clearLayers()
    hazardsLayerRef.current.clearLayers()

    const map = mapInstanceRef.current

    // 1. User Location Pulse Pin
    const userPinHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
        <span style="position: absolute; width: 32px; height: 32px; border-radius: 50%; background: rgba(249, 115, 22, 0.4); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>
        <div style="width: 32px; height: 32px; border-radius: 12px; background: linear-gradient(135deg, #f97316, #e11d48); display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(249,115,22,0.8); border: 2px solid white; color: white;">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <span style="margin-top: 4px; padding: 2px 6px; background: rgba(15, 23, 42, 0.9); border: 1px solid rgba(249,115,22,0.4); border-radius: 999px; font-size: 10px; font-weight: 700; font-family: monospace; color: #fdba74; white-space: nowrap; box-shadow: 0 4px 10px rgba(0,0,0,0.5);">
          YOU (GPS)
        </span>
      </div>
    `
    const userIcon = L.divIcon({
      html: userPinHtml,
      className: 'user-pulse-icon',
      iconSize: [32, 50],
      iconAnchor: [16, 25],
    })

    L.marker([userLocation?.lat || 19.3837, userLocation?.lng || 72.8282], { icon: userIcon })
      .addTo(markersLayerRef.current)
      .bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; color: #0f172a;">
          <strong style="font-size: 14px; color: #ea580c;">📍 Your Current Location</strong>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #64748b;">Ambadi Road, Vasai West, Maharashtra</p>
          <span style="font-size: 11px; font-weight: 600; color: #10b981;">Walking Radius: 2.0 km</span>
        </div>
      `)

    // 2. Flood Waterlogging Hazard Warning Circles
    floodReports.forEach((report) => {
      if (!report.location) return
      const isAlert = report.severity === 'alert'
      const circleColor = isAlert ? '#ef4444' : '#f59e0b'

      const circle = L.circle([report.location.lat, report.location.lng], {
        radius: isAlert ? 150 : 100,
        color: circleColor,
        fillColor: circleColor,
        fillOpacity: 0.25,
        weight: 2,
        dashArray: '6, 6',
      }).addTo(hazardsLayerRef.current)

      circle.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; max-width: 240px; color: #0f172a;">
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px;">
            <span style="background: ${isAlert ? '#fee2e2' : '#fef3c7'}; color: ${circleColor}; padding: 2px 8px; border-radius: 6px; font-size: 11px; font-weight: 700; text-transform: uppercase;">
              ⚠️ ${report.severity}
            </span>
            <span style="font-size: 12px; font-weight: bold;">${report.waterDepthCm} cm Depth</span>
          </div>
          <strong style="font-size: 13px; display: block; color: #0f172a;">${report.areaName}</strong>
          <p style="margin: 4px 0 0 0; font-size: 11px; color: #64748b;">
            Safe detour: <span style="color: #0d9488; font-weight: 600;">${report.safeDetour}</span>
          </p>
        </div>
      `)
    })

    // 3. Shop Markers
    shops.forEach((shop) => {
      if (!shop.location) return

      // Category filter check
      if (activeFilter === 'food' && shop.category !== 'Fast Food') return
      if (activeFilter === 'pharmacy' && shop.category !== 'Pharmacy') return
      if (activeFilter === 'safe' && shop.floodStatus !== 'safe') return

      const isCluckin = shop.id === 'shop-cluckin'
      const isPharmacy = shop.category === 'Pharmacy'
      const pinColor = isCluckin ? '#ef4444' : isPharmacy ? '#0284c7' : '#10b981'
      const iconEmoji = isCluckin ? '🍗' : isPharmacy ? '💊' : '🛒'

      const shopPinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s;" onmouseover="this.style.transform='scale(1.15)'" onmouseout="this.style.transform='scale(1)'">
          <div style="width: 38px; height: 38px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); background-color: ${pinColor}; border: 2px solid white; box-shadow: 0 4px 14px rgba(0,0,0,0.35); display: flex; align-items: center; justify-content: center;">
            <span style="transform: rotate(45deg); font-size: 18px;">${iconEmoji}</span>
          </div>
          <div style="margin-top: 3px; padding: 2px 7px; background: rgba(15, 23, 42, 0.95); border: 1px solid rgba(255,255,255,0.2); border-radius: 6px; box-shadow: 0 4px 8px rgba(0,0,0,0.4); text-align: center; max-width: 120px;">
            <span style="font-size: 10px; font-weight: 700; font-family: monospace; color: white; display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
              ${shop.name.split(' - ')[0]}
            </span>
          </div>
        </div>
      `

      const customIcon = L.divIcon({
        html: shopPinHtml,
        className: 'custom-shop-marker',
        iconSize: [38, 55],
        iconAnchor: [19, 45],
        popupAnchor: [0, -42],
      })

      const marker = L.marker([shop.location.lat, shop.location.lng], { icon: customIcon })
        .addTo(markersLayerRef.current)

      marker.on('click', () => {
        setSelectedShop(shop)
        map.flyTo([shop.location.lat, shop.location.lng], 18, { duration: 0.8 })
      })
    })
  }, [shops, floodReports, activeFilter, userLocation])

  // Quick Zoom Functions
  const handleZoomIn = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapInstanceRef.current) mapInstanceRef.current.zoomOut()
  }

  const handleFlyToMaharashtra = () => {
    if (mapInstanceRef.current) {
      // Fit to entire Maharashtra state bounds
      mapInstanceRef.current.fitBounds(MAHARASHTRA_BOUNDS, {
        padding: [20, 20],
        duration: 1.2,
      })
    }
  }

  const handleFlyToVasaiShops = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([userLocation?.lat || 19.3837, userLocation?.lng || 72.8282], 17, {
        duration: 1.2,
      })
    }
  }

  const handleSelectShopCard = (shop) => {
    setSelectedShop(shop)
    if (mapInstanceRef.current && shop.location) {
      mapInstanceRef.current.flyTo([shop.location.lat, shop.location.lng], 18, { duration: 0.9 })
    }
  }

  return (
    <div className="relative w-full h-[620px] rounded-3xl overflow-hidden bg-[#0c0c16] border border-white/15 shadow-2xl flex flex-col select-none">
      
      {/* Top Header Bar: Google Maps Controls & Maharashtra Scope */}
      <div className="absolute top-4 left-4 right-4 z-[500] flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
        
        {/* State Badge & Brand */}
        <div className="flex items-center gap-2.5 bg-[#0f172a]/95 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/15 shadow-xl text-xs font-mono">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white font-bold tracking-wide flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-teal-400" />
            MAHARASHTRA GOOGLE MAP
          </span>
          <span className="text-[10px] text-amber-300 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-500/40 font-bold">
            ZOOMABLE · STATE LOCKED
          </span>
        </div>

        {/* Layer Switcher (Streets, Satellite, Terrain) */}
        <div className="flex items-center gap-1.5 bg-[#0f172a]/95 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 shadow-xl text-xs font-mono">
          <button
            onClick={() => setActiveTileType('streets')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTileType === 'streets'
                ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Google Streets
          </button>
          <button
            onClick={() => setActiveTileType('hybrid')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTileType === 'hybrid'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Satellite
          </button>
          <button
            onClick={() => setActiveTileType('terrain')}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
              activeTileType === 'terrain'
                ? 'bg-gradient-to-r from-violet-500 to-indigo-500 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Terrain
          </button>
        </div>
      </div>

      {/* Floating Left Side: Zoom Preset Shortcuts & Filter Chips */}
      <div className="absolute top-20 left-4 z-[500] flex flex-col gap-2 pointer-events-auto">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl p-2 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-1.5 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 uppercase tracking-wider">
            Quick Zoom
          </span>
          <button
            onClick={handleFlyToVasaiShops}
            className="px-3 py-1.5 rounded-xl bg-primary-600/30 text-primary-300 hover:bg-primary-600/50 border border-primary-500/40 text-left font-bold transition-all flex items-center gap-1.5"
            title="Zoom directly into Ambadi Road shops"
          >
            <MapPin className="w-3.5 h-3.5 text-primary-400" />
            Vasai West (Stores)
          </button>
          <button
            onClick={handleFlyToMaharashtra}
            className="px-3 py-1.5 rounded-xl bg-slate-800/80 text-slate-300 hover:bg-slate-700 hover:text-white border border-white/10 text-left font-bold transition-all flex items-center gap-1.5"
            title="Zoom out to whole Maharashtra state"
          >
            <Maximize2 className="w-3.5 h-3.5 text-amber-400" />
            Maharashtra State
          </button>
        </div>

        {/* Category Filters */}
        <div className="bg-[#0f172a]/95 backdrop-blur-xl p-2 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-1 font-mono text-xs">
          <span className="text-[10px] text-slate-400 font-bold px-2 py-0.5 uppercase tracking-wider">
            Filter Pins
          </span>
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1 rounded-xl text-left font-bold transition-all ${
              activeFilter === 'all' ? 'bg-white/20 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ● All ({shops.length})
          </button>
          <button
            onClick={() => setActiveFilter('food')}
            className={`px-3 py-1 rounded-xl text-left font-bold transition-all ${
              activeFilter === 'food' ? 'bg-rose-500/30 text-rose-300 border border-rose-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            🍗 Fast Food
          </button>
          <button
            onClick={() => setActiveFilter('pharmacy')}
            className={`px-3 py-1 rounded-xl text-left font-bold transition-all ${
              activeFilter === 'pharmacy' ? 'bg-sky-500/30 text-sky-300 border border-sky-500/40' : 'text-slate-400 hover:text-white'
            }`}
          >
            💊 Pharmacy
          </button>
        </div>
      </div>

      {/* Floating Right Side: Interactive Zoom In / Zoom Out Controls */}
      <div className="absolute top-20 right-4 z-[500] flex flex-col gap-2 pointer-events-auto">
        <div className="bg-[#0f172a]/95 backdrop-blur-xl p-1.5 rounded-2xl border border-white/15 shadow-xl flex flex-col gap-1 items-center font-mono">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Zoom In"
          >
            <ZoomIn className="w-5 h-5 text-teal-300" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-md"
            title="Zoom Out"
          >
            <ZoomOut className="w-5 h-5 text-slate-300" />
          </button>
          <div className="text-[10px] text-slate-400 py-1 font-bold">
            {currentZoom}x
          </div>
        </div>
      </div>

      {/* Bottom Horizontal Store Quick-Selector Strip */}
      <div className="absolute bottom-4 left-4 right-4 z-[500] flex items-center gap-2 overflow-x-auto pb-1 pointer-events-auto">
        {shops.map((shop) => (
          <button
            key={shop.id}
            onClick={() => handleSelectShopCard(shop)}
            className={`shrink-0 flex items-center gap-2.5 px-3.5 py-2 rounded-2xl backdrop-blur-xl border font-mono text-xs transition-all shadow-xl ${
              selectedShop?.id === shop.id
                ? 'bg-primary-600/90 text-white border-primary-400 scale-105 shadow-[0_0_20px_rgba(224,82,54,0.5)]'
                : 'bg-[#0f172a]/90 text-slate-300 border-white/15 hover:bg-[#1e293b] hover:text-white'
            }`}
          >
            <span className="text-base">{shop.id === 'shop-cluckin' ? '🍗' : shop.category === 'Pharmacy' ? '💊' : '🛒'}</span>
            <div className="text-left">
              <p className="font-bold leading-tight max-w-[120px] truncate">{shop.name.split(' - ')[0]}</p>
              <p className="text-[10px] opacity-75">{shop.distanceKm} km · ★ {shop.rating}</p>
            </div>
          </button>
        ))}
      </div>

      {/* Full Size Leaflet Map Element Container */}
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Selected Store Holographic Modal Overlay */}
      <AnimatePresence>
        {selectedShop && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-20 left-4 right-4 z-[600] max-w-xl mx-auto bg-[#0f172a]/98 backdrop-blur-2xl rounded-3xl border border-white/20 p-5 shadow-2xl text-white"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedShop.image}
                  alt={selectedShop.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-white/15 shadow-md"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base font-display text-white">{selectedShop.name}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold bg-teal-950 text-teal-400 border border-teal-500/30">
                      {selectedShop.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono mt-1">{selectedShop.address}</p>
                  <p className="text-xs font-mono text-teal-300 mt-1 flex items-center gap-3">
                    <span>📍 {selectedShop.distanceKm} km walking</span>
                    <span className="text-amber-400 font-bold">★ {selectedShop.rating} ({selectedShop.reviewsCount})</span>
                    <span className={selectedShop.isOpen ? 'text-emerald-400 font-bold' : 'text-rose-400'}>
                      {selectedShop.isOpen ? '● Open Now' : '○ Closed'}
                    </span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedShop(null)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
              <a
                href={`https://www.google.com/maps/dir/?api=1&destination=${selectedShop.location?.lat},${selectedShop.location?.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-slate-300 hover:text-white transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5 text-teal-400" />
                Open in Google Maps Directions
              </a>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    if (onSelectShop) onSelectShop(selectedShop)
                    setSelectedShop(null)
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-md hover:scale-105 transition-all"
                >
                  View Store Products
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
