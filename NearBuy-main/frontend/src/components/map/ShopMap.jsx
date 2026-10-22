import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const DEFAULT_CENTER = [19.3830, 72.8283]

// Escape shop or landmark text before injecting into marker HTML
const esc = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]))

// Helper to parse coordinates from varied object shapes
const getPos = (item) => {
  const lat = item?.location?.lat ?? item?.latitude ?? item?.lat
  const lng = item?.location?.lng ?? item?.longitude ?? item?.lng
  return typeof lat === 'number' && typeof lng === 'number' ? [lat, lng] : null
}

// Curated prominent landmarks in Vasai West around Vasai Road station and Ambadi Road
export const VASAI_LANDMARKS = [
  {
    id: 'lm-station',
    name: 'Vasai Road Railway Station (W)',
    category: 'Transit',
    tag: 'Western Railway Terminus',
    icon: '🚉',
    lat: 19.3822,
    lng: 72.8322,
    address: 'Station Rd, Navghar Manikpur, Vasai West 401202',
    description: 'Central Western Railway suburban rail terminus connecting Mumbai, Virar, and Dahanu.',
  },
  {
    id: 'lm-vartak',
    name: 'Annasaheb Vartak College',
    category: 'Education',
    tag: 'College Campus & Grounds',
    icon: '🎓',
    lat: 19.3840,
    lng: 72.8288,
    address: 'Ambadi Rd, Vishal Nagar, Vasai West 401202',
    description: 'Premier higher education college campus with spacious sports ground on Ambadi Road.',
  },
  {
    id: 'lm-gujarati-hospital',
    name: 'Shree Gujarati Samaj Hospital',
    category: 'Healthcare',
    tag: 'Hospital & Emergency',
    icon: '🏥',
    lat: 19.3836,
    lng: 72.8242,
    address: 'Near Gokul Park, Vasai Rd W, Sai Nagar, Vasai West 401202',
    description: 'Multi-specialty community charitable hospital with 24/7 emergency care and pathology unit.',
  },
  {
    id: 'lm-golden-park',
    name: 'Golden Park Hospital',
    category: 'Healthcare',
    tag: 'Trauma & Medical Care',
    icon: '⚕️',
    lat: 19.3814,
    lng: 72.8276,
    address: 'Near Sai Nagar, Navghar Manikpur, Vasai West 401202',
    description: 'Comprehensive general hospital and trauma center near Anand Nagar junction.',
  },
  {
    id: 'lm-bus-depot',
    name: 'Vasai West Bus Depot & Auto Stand',
    category: 'Transit',
    tag: 'Public Transit Terminal',
    icon: '🚏',
    lat: 19.3828,
    lng: 72.8315,
    address: 'Station Road Exit, Vasai West 401202',
    description: 'Central interchange terminal for MSRTC/VVMT municipal buses and auto-rickshaw hubs.',
  },
  {
    id: 'lm-kt-vision',
    name: 'KT Vision Multiplex & Arcade',
    category: 'Entertainment',
    tag: 'Cinema & Shopping',
    icon: '🎬',
    lat: 19.3798,
    lng: 72.8294,
    address: 'Veer Savarkar Marg, Anand Nagar, Vasai West 401202',
    description: 'Major cinema multiplex and shopping arcade in Veer Savarkar Nagar.',
  },
  {
    id: 'lm-indoorz',
    name: 'Indoorz Sports Arena',
    category: 'Sports',
    tag: 'Sports Turf & Fitness',
    icon: '⚽',
    lat: 19.3808,
    lng: 72.8270,
    address: 'Near Shreyas Hospital, Navghar Road, Vasai West 401202',
    description: 'Indoor turf sports arena for box cricket, football, and fitness activities.',
  },
]

// Map view layers: Streets, Satellite Hybrid, and Terrain
export const TILE_LAYERS = {
  streets: {
    id: 'streets',
    name: 'Streets',
    icon: '🗺️',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    },
  },
  satellite: {
    id: 'satellite',
    name: 'Satellite',
    icon: '🛰️',
    url: 'https://mt{s}.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    options: {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '© Google Maps Satellite',
    },
  },
  terrain: {
    id: 'terrain',
    name: 'Terrain',
    icon: '⛰️',
    url: 'https://mt{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    options: {
      subdomains: ['0', '1', '2', '3'],
      maxZoom: 20,
      attribution: '© Google Maps Terrain',
    },
  },
}

// Clean shop marker with open/closed status styling
const shopIcon = (shop) => {
  const color = shop.isOpen ? '#10b981' : '#64748b'
  return L.divIcon({
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="position:absolute;transform:translate(-50%,-100%);width:max-content;display:flex;flex-direction:column;align-items:center;cursor:pointer">
      <div style="background:#0e0e1a;color:#fff;border:2px solid ${color};border-radius:12px;padding:3px 8px;font:600 11px system-ui,sans-serif;white-space:nowrap;max-width:150px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 4px 12px rgba(0,0,0,.6)">${esc(shop.name)}</div>
      <div style="width:10px;height:10px;border-radius:50%;background:${color};margin-top:2px;box-shadow:0 0 10px ${color}"></div>
    </div>`,
  })
}

// Distinct Indigo/Violet marker for landmarks
const landmarkIcon = (landmark) => {
  return L.divIcon({
    className: '',
    iconSize: [0, 0],
    iconAnchor: [0, 0],
    html: `<div style="position:absolute;transform:translate(-50%,-100%);width:max-content;display:flex;flex-direction:column;align-items:center;cursor:pointer">
      <div style="background:#13112a;color:#e0e7ff;border:1.5px solid #818cf8;border-radius:12px;padding:3px 8px;font:600 11px system-ui,sans-serif;white-space:nowrap;max-width:160px;overflow:hidden;text-overflow:ellipsis;box-shadow:0 4px 14px rgba(99,102,241,0.45);display:flex;align-items:center;gap:4px">
        <span style="font-size:12px">${landmark.icon || '📍'}</span>
        <span>${esc(landmark.name)}</span>
      </div>
      <div style="width:8px;height:8px;border-radius:50%;background:#818cf8;margin-top:2px;box-shadow:0 0 8px #818cf8"></div>
    </div>`,
  })
}

export const ShopMap = ({
  shops = [],
  landmarks = VASAI_LANDMARKS,
  userLocation = null,
  onSelectShop,
  height = 520,
}) => {
  const elRef = useRef(null)
  const mapRef = useRef(null)
  const layerRef = useRef(null)
  const landmarksLayerRef = useRef(null)
  const tileLayerRef = useRef(null)
  const currentLayerIdRef = useRef('streets')
  const onSelectRef = useRef(onSelectShop)
  const lastFitKey = useRef('')

  const [activeLayer, setActiveLayer] = useState('streets')
  const [showLandmarks, setShowLandmarks] = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    onSelectRef.current = onSelectShop
  })

  // Initialize the Leaflet map once
  useEffect(() => {
    if (!elRef.current) return

    const map = L.map(elRef.current, {
      scrollWheelZoom: false,
      zoomControl: false,
    }).setView(DEFAULT_CENTER, 14)

    // Position custom zoom controls in bottom-right corner
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    // Add initial base tile layer
    const initialConfig = TILE_LAYERS[activeLayer] || TILE_LAYERS.streets
    const initialTile = L.tileLayer(initialConfig.url, initialConfig.options).addTo(map)
    tileLayerRef.current = initialTile
    currentLayerIdRef.current = activeLayer

    // Wheel zoom on click, dismiss selected when clicking empty map area
    map.on('click', () => {
      map.scrollWheelZoom.enable()
      setSelected(null)
    })
    map.on('mouseout', () => map.scrollWheelZoom.disable())

    layerRef.current = L.layerGroup().addTo(map)
    landmarksLayerRef.current = L.layerGroup().addTo(map)
    mapRef.current = map

    const t = setTimeout(() => map.invalidateSize(), 50)
    return () => {
      clearTimeout(t)
      map.remove()
      mapRef.current = null
      layerRef.current = null
      landmarksLayerRef.current = null
      tileLayerRef.current = null
      lastFitKey.current = ''
    }
  }, [])

  // Swap tile layers dynamically when activeLayer changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    if (currentLayerIdRef.current === activeLayer && tileLayerRef.current) return

    const config = TILE_LAYERS[activeLayer] || TILE_LAYERS.streets

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current)
    }

    const newTile = L.tileLayer(config.url, config.options).addTo(map)
    newTile.bringToBack()
    tileLayerRef.current = newTile
    currentLayerIdRef.current = activeLayer
  }, [activeLayer])

  // Redraw Landmarks when landmark dataset or visibility toggle changes
  useEffect(() => {
    const layer = landmarksLayerRef.current
    if (!layer) return
    layer.clearLayers()

    if (!showLandmarks) return

    landmarks.forEach((landmark) => {
      if (typeof landmark.lat !== 'number' || typeof landmark.lng !== 'number') return
      const pos = [landmark.lat, landmark.lng]
      L.marker(pos, { icon: landmarkIcon(landmark) })
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e)
          setSelected({ type: 'landmark', ...landmark })
        })
        .addTo(layer)
    })
  }, [landmarks, showLandmarks])

  // Redraw shop markers and user position
  useEffect(() => {
    const map = mapRef.current
    const layer = layerRef.current
    if (!map || !layer) return
    layer.clearLayers()
    const points = []

    shops.forEach((shop) => {
      const pos = getPos(shop)
      if (!pos) return
      points.push(pos)
      L.marker(pos, { icon: shopIcon(shop) })
        .on('click', (e) => {
          L.DomEvent.stopPropagation(e)
          setSelected({ type: 'shop', ...shop })
          onSelectRef.current?.(shop)
        })
        .addTo(layer)
    })

    if (typeof userLocation?.lat === 'number' && typeof userLocation?.lng === 'number') {
      L.circleMarker([userLocation.lat, userLocation.lng], {
        radius: 8,
        color: '#ffffff',
        weight: 3,
        fillColor: '#2557d6',
        fillOpacity: 1,
      }).bindTooltip('You (Current Location)').addTo(layer)
    }

    // Zoom to fit all shops smoothly
    const fitKey = shops.map((s) => s.id).join(',')
    if (fitKey !== lastFitKey.current && points.length > 0) {
      lastFitKey.current = fitKey
      if (points.length === 1) map.setView(points[0], 15)
      else map.fitBounds(points, { padding: [70, 70], maxZoom: 16 })
    }
  }, [shops, userLocation])

  const openStore = () => {
    if (!selected) return
    const { type, ...shop } = selected
    onSelectShop?.(shop)
    setSelected(null)
  }

  const selectedPos = selected ? getPos(selected) : null

  return (
    <div
      className="relative w-full overflow-hidden rounded-3xl border border-white/15 shadow-2xl"
      style={{ height, isolation: 'isolate' }}
    >
      {/* Map DOM Element */}
      <div ref={elRef} style={{ height: '100%', width: '100%' }} />

      {/* Top-Left: View Mode Switcher & Landmarks Toggle */}
      <div
        style={{ zIndex: 1000 }}
        className="absolute left-3 top-3 flex flex-wrap items-center gap-1.5 rounded-2xl bg-[#0c0c18]/90 p-1.5 backdrop-blur-md border border-white/15 shadow-2xl"
      >
        {/* Layer Buttons: Streets, Satellite, Terrain */}
        <div className="flex items-center gap-1 bg-white/5 p-0.5 rounded-xl border border-white/5">
          {Object.values(TILE_LAYERS).map((layer) => {
            const isActive = activeLayer === layer.id
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => setActiveLayer(layer.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-teal-500 to-cyan-500 text-white shadow-[0_0_12px_rgba(20,184,166,0.5)] font-bold'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                }`}
                title={`Switch to ${layer.name} view`}
              >
                <span>{layer.icon}</span>
                <span className="hidden sm:inline">{layer.name}</span>
              </button>
            )
          })}
        </div>

        {/* Vertical Divider */}
        <div className="h-5 w-[1px] bg-white/20 mx-0.5 hidden xs:block" />

        {/* Landmarks Visibility Toggle */}
        <button
          type="button"
          onClick={() => setShowLandmarks((prev) => !prev)}
          className={`px-2.5 py-1 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
            showLandmarks
              ? 'bg-indigo-600/35 text-indigo-200 border border-indigo-400/50 shadow-[0_0_12px_rgba(99,102,241,0.35)]'
              : 'bg-white/5 text-slate-400 hover:text-white border border-transparent'
          }`}
          title="Toggle Landmarks on Map"
        >
          <span>📍</span>
          <span className="hidden sm:inline">Landmarks</span>
          <span
            className={`w-1.5 h-1.5 rounded-full transition-colors ${
              showLandmarks ? 'bg-indigo-400 animate-pulse' : 'bg-slate-500'
            }`}
          />
        </button>
      </div>

      {/* Top-Right: Active Stores Count Badge */}
      <div
        style={{ zIndex: 1000 }}
        className="absolute right-3 top-3 flex items-center gap-2 rounded-xl bg-[#0c0c18]/90 px-3 py-1.5 text-[11px] text-slate-200 backdrop-blur-md border border-white/10 shadow-lg font-mono"
      >
        <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
          {shops.length} Local Stores Online
        </span>
      </div>

      {/* Bottom Detail Card for Selected Shop or Landmark */}
      {selected && (
        <div
          style={{ zIndex: 1100 }}
          className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 rounded-2xl border border-white/15 bg-[#0e0e1a]/95 backdrop-blur-xl p-4 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between transition-all"
        >
          {selected.type === 'shop' ? (
            <>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="truncate text-sm font-bold text-white">{selected.name}</h4>
                  <span className="rounded-full bg-teal-500/20 px-2 py-0.5 text-[10px] font-mono font-semibold text-teal-300 border border-teal-500/30">
                    {selected.category || 'Grocery'}
                  </span>
                </div>
                {selected.address && <p className="mt-0.5 text-xs text-slate-400 truncate">{selected.address}</p>}
                <p className="mt-1 flex flex-wrap gap-x-3 text-xs text-teal-400 font-mono">
                  {selected.distanceKm != null && <span>{selected.distanceKm} km away</span>}
                  {selected.rating != null && <span>★ {selected.rating}</span>}
                  {selected.isOpen != null && <span>{selected.isOpen ? '● Open now' : '○ Closed'}</span>}
                  {selected.phone && <span className="text-slate-300">📞 {selected.phone}</span>}
                </p>
              </div>
              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {selectedPos && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPos[0]},${selectedPos[1]}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-slate-200 hover:bg-white/20 hover:text-white transition-colors"
                  >
                    <span>Directions</span>
                    <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                    </svg>
                  </a>
                )}
                <button
                  type="button"
                  onClick={openStore}
                  className="rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 px-4 py-2 text-xs font-bold text-white hover:from-teal-400 hover:to-emerald-400 shadow-[0_0_12px_rgba(20,184,166,0.4)] transition-all"
                >
                  View Store Items
                </button>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </>
          ) : (
            <>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-lg">{selected.icon || '📍'}</span>
                  <h4 className="truncate text-sm font-bold text-indigo-200">{selected.name}</h4>
                  {selected.tag && (
                    <span className="rounded-full bg-indigo-500/25 px-2 py-0.5 text-[10px] font-mono font-semibold text-indigo-300 border border-indigo-500/40">
                      {selected.tag}
                    </span>
                  )}
                </div>
                {selected.address && <p className="mt-0.5 text-xs text-slate-400 truncate">{selected.address}</p>}
                {selected.description && <p className="mt-0.5 text-xs text-slate-300">{selected.description}</p>}
                <p className="mt-1 text-[11px] text-slate-400 font-mono">
                  Coordinates: {selected.lat.toFixed(4)}° N, {selected.lng.toFixed(4)}° E · Vasai West Landmark
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-2">
                <a
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selected.lat},${selected.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 px-4 py-2 text-xs font-bold text-white hover:from-indigo-500 hover:to-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
                >
                  <span>Get Directions</span>
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6M15 3h6v6M10 14L21 3" />
                  </svg>
                </a>
                <button
                  type="button"
                  onClick={() => setSelected(null)}
                  className="rounded-xl bg-white/10 px-3 py-2 text-xs text-slate-300 hover:bg-white/20 transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}