import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Store, AlertTriangle, ShieldCheck, MapPin, Radio, Eye, Layers, Compass, ExternalLink, Zap } from 'lucide-react'

export const FloodMap = ({
  shops = [],
  floodReports = [],
  userLocation = { lat: 19.076, lng: 72.8777 },
  onSelectShop,
}) => {
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [viewMode, setViewMode] = useState('3d') // '3d' | 'top' | 'isometric'
  const [filterLayer, setFilterLayer] = useState('all') // 'all' | 'shops' | 'hazards'

  // Map coordinate bounds to percentage on our 3D tactical radar grid
  // Center around 19.076, 72.8777
  const toGridPercent = (lat, lng) => {
    const latSpan = 0.024
    const lngSpan = 0.024
    const x = ((lng - (userLocation.lng - lngSpan / 2)) / lngSpan) * 100
    const y = ((userLocation.lat + latSpan / 2 - lat) / latSpan) * 100
    return {
      x: Math.max(8, Math.min(92, x)),
      y: Math.max(8, Math.min(92, y)),
    }
  }

  const viewTransform = {
    '3d': { rotateX: 52, rotateZ: -18, scale: 0.95 },
    'isometric': { rotateX: 60, rotateZ: -45, scale: 0.9 },
    'top': { rotateX: 0, rotateZ: 0, scale: 1 },
  }[viewMode]

  return (
    <div className="relative w-full h-[520px] rounded-3xl overflow-hidden bg-[#07070f] border border-white/15 shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none">
      
      {/* HUD Header Toolbar */}
      <div className="absolute top-4 left-4 right-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
        <div className="flex items-center gap-2 bg-[#0d0d18]/90 backdrop-blur-xl px-4 py-2 rounded-2xl border border-white/10 text-xs font-mono shadow-xl">
          <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          <span className="text-white font-bold tracking-wider">3D MONSOON RADAR HUD</span>
          <span className="text-[10px] text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-500/30">
            ONLINE · 4 SECTORS
          </span>
        </div>

        {/* View Mode & Filter Controls */}
        <div className="flex items-center gap-2 bg-[#0d0d18]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-white/10 shadow-xl text-xs font-mono">
          <button
            onClick={() => setViewMode('3d')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              viewMode === '3d'
                ? 'bg-gradient-to-r from-primary-500 to-amber-500 text-white shadow-[0_0_12px_rgba(224,82,54,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            3D Tilt
          </button>
          <button
            onClick={() => setViewMode('isometric')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'isometric'
                ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-[0_0_12px_rgba(13,148,136,0.4)]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Isometric
          </button>
          <button
            onClick={() => setViewMode('top')}
            className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
              viewMode === 'top'
                ? 'bg-white/20 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            2D Tactical
          </button>
        </div>
      </div>

      {/* 3D Perspective Stage */}
      <div
        className="w-full h-full flex items-center justify-center overflow-hidden"
        style={{ perspective: 1200 }}
      >
        <motion.div
          animate={viewTransform}
          transition={{ type: 'spring', stiffness: 200, damping: 24 }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative w-[580px] h-[580px] rounded-3xl border-2 border-teal-500/20 bg-gradient-to-br from-[#0c0c18] via-[#090914] to-[#05050b] shadow-[0_0_80px_rgba(13,148,136,0.15)]"
        >
          {/* Cyber Grid Lines */}
          <div
            className="absolute inset-0 rounded-3xl opacity-30"
            style={{
              backgroundImage: `
                linear-gradient(to right, rgba(45, 212, 191, 0.25) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(45, 212, 191, 0.25) 1px, transparent 1px)
              `,
              backgroundSize: '48px 48px',
            }}
          />

          {/* Concentric Radar Distance Rings */}
          {[120, 240, 380, 520].map((size, idx) => (
            <div
              key={size}
              className="absolute rounded-full border border-teal-500/20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
              style={{ width: size, height: size }}
            >
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold text-teal-400/60 bg-[#0c0c18] px-1 rounded">
                {(idx + 1) * 500}m
              </span>
            </div>
          ))}

          {/* Rotating Holographic Radar Sweep Beam */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] rounded-full pointer-events-none"
            style={{
              background: 'conic-gradient(from 0deg, rgba(45, 212, 191, 0.35) 0deg, rgba(45, 212, 191, 0.08) 45deg, transparent 90deg, transparent 360deg)',
            }}
          />

          {/* User Location Center Beacon */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 cursor-pointer"
            style={{ transform: viewMode !== 'top' ? 'translateZ(35px) rotateX(-50deg)' : 'none' }}
            onClick={() => setSelectedEntity({ type: 'user', name: 'Your Location', address: 'Ward 4 Walking Radius (Current GPS)' })}
          >
            <div className="relative flex flex-col items-center group">
              <span className="animate-ping absolute w-8 h-8 rounded-full bg-primary-500/50" />
              <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-[0_0_20px_#f97316] border border-white/40">
                <MapPin className="w-5 h-5" />
              </div>
              <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-900/90 border border-primary-500/40 text-[9px] font-mono font-bold text-primary-300 whitespace-nowrap shadow-lg">
                YOU (GPS)
              </span>
            </div>
          </div>

          {/* Safe Detour Navigation Route (Neon Glowing Path) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
            <path
              d="M 290 290 Q 220 220 180 160 T 110 120"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="drop-shadow-[0_0_8px_#2dd4bf]"
            />
            <path
              d="M 290 290 Q 360 260 410 200 T 470 150"
              fill="none"
              stroke="#2dd4bf"
              strokeWidth="3"
              strokeDasharray="6 4"
              className="drop-shadow-[0_0_8px_#2dd4bf]"
            />
          </svg>

          {/* Flood Waterlogging Hazard Zones */}
          {floodReports.map((report, idx) => {
            const pos = toGridPercent(report.location.lat, report.location.lng)
            const isAlert = report.severity === 'alert'
            const color = isAlert ? '#ef4444' : '#f59e0b'

            return (
              <div
                key={report.id || idx}
                className="absolute z-15 cursor-pointer"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => setSelectedEntity({ type: 'flood', ...report })}
              >
                {/* 3D Depth Rings Ripple */}
                <div className="relative flex items-center justify-center">
                  <motion.div
                    animate={{ scale: [1, 2, 1], opacity: [0.6, 0.1, 0.6] }}
                    transition={{ repeat: Infinity, duration: 2.5, delay: idx * 0.4 }}
                    className="absolute w-28 h-28 rounded-full border-2"
                    style={{ borderColor: color, backgroundColor: `${color}15` }}
                  />
                  
                  {/* Upright Floating Warning Sign in 3D */}
                  <div
                    style={{ transform: viewMode !== 'top' ? 'translateZ(40px) rotateX(-50deg)' : 'none' }}
                    className="flex flex-col items-center group hover:scale-110 transition-transform"
                  >
                    <div
                      className="px-2.5 py-1.5 rounded-xl border flex items-center gap-1.5 shadow-2xl font-mono text-[10px] font-bold"
                      style={{
                        backgroundColor: isAlert ? '#450a0a' : '#451a03',
                        borderColor: color,
                        color: color,
                        boxShadow: `0 0 20px ${color}60`,
                      }}
                    >
                      <AlertTriangle className="w-3.5 h-3.5 animate-bounce" />
                      <span>{report.waterDepthCm} cm</span>
                    </div>
                    <span className="text-[9px] font-mono text-slate-300 bg-black/80 px-2 py-0.5 rounded mt-1 shadow-md whitespace-nowrap">
                      {report.areaName.slice(0, 18)}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}

          {/* 3D Shop Beacons */}
          {shops.map((shop, idx) => {
            const pos = toGridPercent(shop.location.lat, shop.location.lng)
            const isSafe = shop.floodStatus === 'safe'
            const beaconColor = isSafe ? '#10b981' : shop.floodStatus === 'watch' ? '#f59e0b' : '#ef4444'

            return (
              <div
                key={shop.id || idx}
                className="absolute z-20 cursor-pointer"
                style={{
                  left: `${pos.x}%`,
                  top: `${pos.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                onClick={() => {
                  setSelectedEntity({ type: 'shop', ...shop })
                  if (onSelectShop) onSelectShop(shop)
                }}
              >
                {/* 3D Vertical Holographic Beacon Pillar */}
                <div
                  style={{ transform: viewMode !== 'top' ? 'translateZ(45px) rotateX(-50deg)' : 'none' }}
                  className="flex flex-col items-center group hover:scale-115 transition-transform duration-200"
                >
                  {/* Floating Store Badge */}
                  <div className="relative px-3 py-1.5 rounded-2xl bg-[#0e0e1a]/95 border border-white/20 text-white flex items-center gap-2 shadow-[0_10px_25px_rgba(0,0,0,0.8)] group-hover:border-teal-400 group-hover:shadow-[0_0_20px_rgba(45,212,191,0.5)] transition-all">
                    <div
                      className="w-5 h-5 rounded-lg flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: beaconColor }}
                    >
                      <Store className="w-3 h-3" />
                    </div>
                    <div className="text-left font-mono">
                      <p className="text-[11px] font-bold text-white group-hover:text-teal-300 transition-colors leading-tight truncate max-w-[110px]">
                        {shop.name}
                      </p>
                      <p className="text-[9px] text-slate-400 flex items-center gap-1">
                        <span>{shop.distanceKm}km</span> · <span className="text-amber-400 font-bold">★{shop.rating}</span>
                      </p>
                    </div>
                  </div>

                  {/* Ground Anchor Light Pin */}
                  <div
                    className="w-2.5 h-2.5 rounded-full mt-1 animate-pulse"
                    style={{ backgroundColor: beaconColor, boxShadow: `0 0 12px ${beaconColor}` }}
                  />
                </div>
              </div>
            )
          })}
        </motion.div>
      </div>

      {/* Selected Entity Hologram Overlay Card */}
      <AnimatePresence>
        {selectedEntity && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="absolute bottom-4 left-4 right-4 z-40 bg-[#0e0e1a]/95 backdrop-blur-2xl rounded-2xl border border-white/15 p-4 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-white"
          >
            {selectedEntity.type === 'shop' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-500 flex items-center justify-center text-white shrink-0 shadow-[0_0_20px_rgba(13,148,136,0.4)]">
                    <Store className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-white font-display">{selectedEntity.name}</h4>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full uppercase font-bold ${
                        selectedEntity.floodStatus === 'safe'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-950 text-amber-400 border border-amber-500/30'
                      }`}>
                        Route: {selectedEntity.floodStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{selectedEntity.address}</p>
                    <p className="text-xs font-mono text-teal-400 mt-1 flex items-center gap-3">
                      <span>📍 {selectedEntity.distanceKm} km walking</span>
                      <span>★ {selectedEntity.rating} ({selectedEntity.reviewsCount} reviews)</span>
                      <span>{selectedEntity.isOpen ? '● Open Now' : '○ Closed'}</span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (onSelectShop) onSelectShop(selectedEntity)
                      setSelectedEntity(null)
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(224,82,54,0.4)] hover:scale-105 transition-all"
                  >
                    View Store Items
                  </button>
                  <button
                    onClick={() => setSelectedEntity(null)}
                    className="px-3 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 text-xs font-mono"
                  >
                    Dismiss
                  </button>
                </div>
              </>
            ) : selectedEntity.type === 'flood' ? (
              <>
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-rose-950/80 border border-rose-500/40 flex items-center justify-center text-rose-400 shrink-0">
                    <AlertTriangle className="w-6 h-6 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-rose-300 font-display flex items-center gap-2">
                      Waterlogging Hazard: {selectedEntity.areaName}
                    </h4>
                    <p className="text-xs text-slate-300 font-mono mt-0.5">
                      Water Depth: <strong className="text-white">{selectedEntity.waterDepthCm} cm</strong> · Severity: <strong className="uppercase text-rose-400">{selectedEntity.severity}</strong>
                    </p>
                    <p className="text-xs text-teal-300 font-mono mt-1">
                      Recommended Safe Detour: <strong>{selectedEntity.safeDetour}</strong>
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold"
                >
                  Got It
                </button>
              </>
            ) : (
              <>
                <div>
                  <h4 className="font-bold text-sm text-white font-display">You are Here (GPS Radius)</h4>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">Coverage: 2.0 km Walking Range · Sector 7 Central Junction</p>
                </div>
                <button
                  onClick={() => setSelectedEntity(null)}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-mono font-bold"
                >
                  Close
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Legend Footer */}
      <div className="absolute bottom-3 right-4 z-20 flex items-center gap-3 bg-[#0d0d18]/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[10px] font-mono text-slate-300">
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" /> Safe Route</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400 inline-block" /> Watch</span>
        <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" /> Flood Waterlogged</span>
      </div>
    </div>
  )
}
