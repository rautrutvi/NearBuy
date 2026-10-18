import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { TiltCard3D } from './TiltCard3D'
import { LiveRadarSimulator } from './LiveRadarSimulator'
import {
  ShoppingBag, ShieldAlert, Sparkles, Store, Umbrella, CheckCircle2,
  ArrowRight, Radio, Tag, Eye
} from 'lucide-react'

export const Hero3DShoppingStage = () => {
  const [stageMode, setStageMode] = useState('3d_stage') // '3d_stage' | 'radar_sim'

  return (
    <div className="w-full max-w-xl mx-auto space-y-4">
      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-wider">
            {stageMode === '3d_stage' ? 'Interactive 3D Stage' : 'Live Monsoon Simulator'}
          </span>
        </div>

        <div className="flex bg-[#0e0a1a] p-1 rounded-2xl border border-purple-500/20 shadow-xl text-xs font-mono">
          <button
            onClick={() => setStageMode('3d_stage')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              stageMode === '3d_stage'
                ? 'bg-gradient-to-r from-primary-500 via-purple-600 to-lavender-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>3D Shopping</span>
          </button>

          <button
            onClick={() => setStageMode('radar_sim')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 ${
              stageMode === 'radar_sim'
                ? 'bg-gradient-to-r from-purple-600 to-lavender-500 text-white font-bold shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Radio className="w-3.5 h-3.5" />
            <span>Radar Sim</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <AnimatePresence mode="wait">
        {stageMode === '3d_stage' ? (
          <motion.div
            key="3d_stage"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <TiltCard3D maxTilt={14} scale={1.03} depth={30} glowColor="violet">
              <div className="relative rounded-3xl overflow-hidden border border-purple-500/30 bg-[#090714] shadow-[0_20px_50px_rgba(168,85,247,0.25)] group">
                
                {/* Photorealistic 3D Stage Image */}
                <div className="relative h-[380px] sm:h-[420px] w-full overflow-hidden">
                  <img
                    src="/images/shopping_3d_hero.jpg"
                    alt="3D Online Shopping Stage"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Vignette for UI Text Contrast */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090714] via-transparent to-black/40" />

                  {/* Top Live Ticker Tag */}
                  <div className="absolute top-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                    <div className="px-3 py-1.5 rounded-xl bg-black/70 backdrop-blur-md border border-purple-500/30 text-[11px] font-mono font-bold text-white flex items-center gap-2 shadow-lg">
                      <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                      <span>HYPERLOCAL 3D STAGE</span>
                    </div>

                    <div className="px-3 py-1.5 rounded-xl bg-purple-950/80 backdrop-blur-md border border-purple-500/40 text-[11px] font-mono font-bold text-purple-300 shadow-lg">
                      FREE 30-MIN HOLD
                    </div>
                  </div>

                  {/* Floating 3D Depth Card 1: Grocery & Monsoon Cart */}
                  <motion.div
                    animate={{ y: [-6, 6, -6] }}
                    transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
                    style={{ transform: 'translateZ(35px)' }}
                    className="absolute bottom-20 left-4 right-4 sm:right-auto sm:max-w-xs p-3.5 rounded-2xl bg-[#110b24e6] backdrop-blur-xl border border-purple-500/30 shadow-2xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-md">
                        <ShoppingBag className="w-5 h-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-bold text-white truncate font-display">Premium Toor Dal (1 kg)</h4>
                          <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/80 px-1.5 py-0.5 rounded border border-purple-500/40">
                            IN STOCK
                          </span>
                        </div>
                        <p className="text-[10px] font-mono text-slate-400 mt-0.5">Vardhman Grain Stores · 0.3 km</p>
                      </div>
                    </div>
                  </motion.div>

                  {/* Floating 3D Depth Tag 2: Flood-Free Route */}
                  <motion.div
                    animate={{ y: [6, -6, 6] }}
                    transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut', delay: 0.5 }}
                    style={{ transform: 'translateZ(40px)' }}
                    className="absolute top-16 right-4 hidden sm:flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-950/90 backdrop-blur-xl border border-purple-500/40 text-[11px] font-mono text-purple-200 shadow-xl"
                  >
                    <Umbrella className="w-3.5 h-3.5 text-primary-400" />
                    <span>Flood Safe: 0 cm on Link Rd</span>
                  </motion.div>
                </div>

                {/* Bottom Interactive Bar */}
                <div className="p-4 bg-[#090714]/95 border-t border-purple-500/20 flex items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-400 block">Verified Local Merchant</span>
                    <span className="text-xs font-bold text-white font-display">6 Nearby Shops Online</span>
                  </div>

                  <Link
                    to="/buyer"
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 via-purple-600 to-lavender-500 text-white font-mono font-bold text-xs uppercase tracking-wider shadow-lg hover:shadow-purple-500/40 transition-all flex items-center gap-2 group-hover:scale-105"
                  >
                    <span>EXPLORE STORES</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </TiltCard3D>
          </motion.div>
        ) : (
          <motion.div
            key="radar_sim"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.4 }}
          >
            <LiveRadarSimulator />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
