import React, { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform, useSpring, useMotionValue } from 'framer-motion'
import { ParticleCanvas } from '../components/ui/ParticleCanvas'
import { CyberCard } from '../components/ui/CyberCard'
import { Counter } from '../components/ui/Counter'
import { Button } from '../components/ui/Button'
import { FloodBadge, StockBadge } from '../components/ui/Badge'
import {
  Store, MapPin, ShieldCheck, Zap, Smartphone, Award,
  ArrowRight, Star, Users, Package, TrendingUp, ChevronDown,
  Terminal, Activity, Radio, Cpu, Layers, ShieldAlert, CheckCircle2, QrCode
} from 'lucide-react'

// Holographic 3D Floating Item Card
const FloatingHoloItem = ({ title, category, price, stock, badgeLevel, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.8, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
    transition={{
      y: { repeat: Infinity, duration: 4 + delay, ease: 'easeInOut' },
      opacity: { duration: 0.6, delay },
      scale: { duration: 0.6, delay },
    }}
    className="relative group rounded-2xl p-[1px] bg-gradient-to-r from-primary-500/40 via-safety-400/40 to-cyan-500/40 shadow-2xl backdrop-blur-xl"
  >
    <div className="bg-slate-950/80 p-4 rounded-2xl border border-white/10 flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500/20 to-safety-500/20 border border-primary-500/30 flex items-center justify-center shrink-0">
        <Package className="w-6 h-6 text-primary-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" /> {category}
        </p>
        <h4 className="font-bold text-sm font-display text-white truncate">{title}</h4>
        <p className="text-xs text-slate-400">₹{price} · {stock} units in stock</p>
      </div>
      <FloodBadge level={badgeLevel} />
    </div>
  </motion.div>
)

export const LandingPage = () => {
  const navigate = useNavigate()
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '25%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  const [activeTab, setActiveTab] = useState('radar')

  return (
    <div className="relative min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-primary-500 selection:text-white font-sans">
      {/* Interactive Particle Network Canvas & Cyber Grid */}
      <ParticleCanvas />

      {/* Cyberpunk Top Bar Overlay */}
      <header className="relative z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          {/* Logo with Glowing Neon Icon */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-primary-500 to-safety-500 blur opacity-70 group-hover:opacity-100 transition duration-300" />
              <div className="relative w-11 h-11 rounded-2xl bg-slate-950 border border-white/20 text-white flex items-center justify-center shadow-2xl">
                <Store className="w-6 h-6 text-primary-400" />
              </div>
            </div>
            <div>
              <span className="font-extrabold text-xl font-display tracking-tight text-white flex items-center gap-1.5">
                NEARBUY <span className="text-xs font-mono px-2 py-0.5 rounded bg-primary-500/20 text-primary-400 border border-primary-500/40">2026.v2</span>
              </span>
              <span className="text-[10px] block font-mono font-semibold text-safety-400 tracking-widest uppercase">
                HYPERLOCAL MONSOON RADAR OS
              </span>
            </div>
          </div>

          {/* Center Tech Status Pill */}
          <div className="hidden md:flex items-center gap-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-emerald-400 font-bold">GRID ONLINE</span>
            </span>
            <span className="text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Radio className="w-4 h-4 text-safety-400 animate-pulse" />
              FLOOD SAFETY: <strong className="text-white">ACTIVE</strong>
            </span>
          </div>

          {/* Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-slate-300 hover:text-white border border-white/10 hover:border-white/30 transition-all bg-white/5"
            >
              [ LOGIN ]
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="relative group px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white overflow-hidden shadow-[0_0_20px_rgba(220,38,38,0.4)]"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary-500 via-amber-500 to-safety-500 group-hover:scale-105 transition-transform duration-300" />
              <span className="relative z-10 flex items-center gap-1.5">
                ACCESS SYSTEM <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* HERO SECTION - BYTEVERSE FUTURISTIC HUD STYLE */}
      <section
        ref={heroRef}
        className="relative min-h-[92vh] flex flex-col items-center justify-center px-4 py-20 overflow-hidden"
      >
        {/* Glow ambient lights */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[350px] bg-primary-500/20 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[450px] bg-safety-500/15 rounded-full blur-[120px] pointer-events-none" />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-5xl mx-auto text-center space-y-8"
        >
          {/* Cyberpunk Status Tag */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-slate-900/90 border border-primary-500/40 text-xs font-mono text-primary-400 shadow-[0_0_25px_rgba(224,82,54,0.3)] backdrop-blur-md"
          >
            <Terminal className="w-4 h-4 text-primary-400 animate-pulse" />
            <span>LIVE HYPERLOCAL STOCK &amp; MONSOON FLOOD RADAR</span>
          </motion.div>

          {/* Kinetic Glowing Main Title */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-8xl font-extrabold font-display tracking-tight text-white leading-[1.02]"
          >
            HYPERLOCAL <br />
            <span className="bg-gradient-to-r from-primary-400 via-amber-300 to-safety-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(224,82,54,0.5)]">
              STOCK RADAR
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="text-base md:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed font-sans font-normal"
          >
            Real-time shop inventory tracking paired with live community flood telemetry.
            Reserve critical monsoon supplies before waterlogging blocks access.
          </motion.p>

          {/* Futuristic Hero CTA Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-4 pt-4"
          >
            <button
              onClick={() => navigate('/signup')}
              className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-amber-500 to-safety-500 font-display font-extrabold text-white text-base shadow-[0_0_30px_rgba(224,82,54,0.5)] hover:shadow-[0_0_50px_rgba(224,82,54,0.8)] transition-all duration-300 transform hover:-translate-y-1"
            >
              <span className="flex items-center gap-3">
                LAUNCH BUYER APP <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>

            <button
              onClick={() => navigate('/signup')}
              className="px-8 py-4 rounded-2xl bg-slate-900 border border-white/20 hover:border-safety-400 text-slate-200 hover:text-white font-display font-extrabold text-base transition-all duration-300 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_30px_rgba(13,148,136,0.3)]"
            >
              REGISTER SHOP AS VENDOR
            </button>
          </motion.div>

          {/* Floating Hologram Items Preview Bar */}
          <div className="pt-10 grid grid-cols-1 md:grid-cols-3 gap-4 text-left max-w-4xl mx-auto">
            <FloatingHoloItem title="Windproof Large Umbrella" category="MONSOON ESSENTIALS" price={349} stock={14} badgeLevel="safe" delay={0} />
            <FloatingHoloItem title="Kolam Raw Rice 5kg" category="GROCERY" price={320} stock={8} badgeLevel="watch" delay={0.2} />
            <FloatingHoloItem title="LED Waterproof Torch" category="HARDWARE" price={299} stock={3} badgeLevel="alert" delay={0.4} />
          </div>
        </motion.div>
      </section>

      {/* METRICS & TELEMETRY SECTION */}
      <section className="relative py-20 border-y border-white/10 bg-slate-950/80">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'VERIFIED LOCAL SHOPS', value: 48, suffix: '+', color: 'text-primary-400' },
              { label: 'ACTIVE USERS TODAY', value: 1284, suffix: '', color: 'text-amber-400' },
              { label: 'RESERVATIONS FULFILLED', value: 237, suffix: '', color: 'text-safety-400' },
              { label: 'RADAR ACCURACY SCORE', value: 99.4, suffix: '%', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <CyberCard key={stat.label} tag={`NODE_0${i + 1}`} glowColor={i % 2 === 0 ? 'primary' : 'teal'}>
                <p className={`text-4xl md:text-5xl font-extrabold font-display ${stat.color} drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-mono font-semibold text-slate-400 mt-2 tracking-wider">{stat.label}</p>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* THREE-COLUMN CYBER SYSTEM ROLES */}
      <section className="py-28 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-4 mb-16">
          <span className="text-xs font-mono font-bold text-safety-400 bg-safety-950/80 border border-safety-500/40 px-4 py-1.5 rounded-full uppercase tracking-widest">
            // ROLE ARCHITECTURE
          </span>
          <h2 className="text-4xl md:text-6xl font-extrabold font-display text-white">
            CHOOSE YOUR <span className="bg-gradient-to-r from-primary-400 to-safety-400 bg-clip-text text-transparent">ACCESS LEVEL</span>
          </h2>
          <p className="text-slate-400 text-sm max-w-xl mx-auto">
            Tailored interfaces for consumers, merchant inventory control, and emergency admin verification.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buyer Card */}
          <CyberCard tag="BUYER.OS" glowColor="primary">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(224,82,54,0.5)]">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-white">Customer / Buyer</h3>
                <p className="text-xs text-slate-400 mt-1">Locate live stock, reserve for 30-min pickup, navigate flood zones.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> Interactive Leaflet Flood Map</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> Multi-item Cart Drawer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> Verification Code Generation</li>
              </ul>
              <Button variant="primary" className="w-full py-3 font-mono font-bold" icon={ArrowRight} onClick={() => navigate('/signup')}>
                EXPLORE AS BUYER
              </Button>
            </div>
          </CyberCard>

          {/* Vendor Card */}
          <CyberCard tag="VENDOR.OS" glowColor="teal">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-safety-400 to-teal-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(13,148,136,0.5)]">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-white">Shopkeeper / Vendor</h3>
                <p className="text-xs text-slate-400 mt-1">Manage stock in real-time, scan barcodes, fulfill incoming pickup reservations.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-safety-400 shrink-0" /> Camera Barcode Scanner UI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-safety-400 shrink-0" /> Live Inventory Adjuster</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-safety-400 shrink-0" /> Order Fulfillment Queue</li>
              </ul>
              <Button variant="safety" className="w-full py-3 font-mono font-bold" icon={QrCode} onClick={() => navigate('/signup')}>
                REGISTER SHOP
              </Button>
            </div>
          </CyberCard>

          {/* Admin Card */}
          <CyberCard tag="ADMIN.OS" glowColor="violet">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-white shadow-[0_0_25px_rgba(139,92,246,0.5)]">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-white">Super Admin</h3>
                <p className="text-xs text-slate-400 mt-1">Verify new merchant applications and publish community flood reports.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-300">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" /> Shop Approval Queue</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" /> Flood Telemetry Verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-400 shrink-0" /> Platform Analytics Charts</li>
              </ul>
              <Button variant="secondary" className="w-full py-3 font-mono font-bold bg-white text-slate-900 hover:bg-slate-200" icon={ShieldAlert} onClick={() => navigate('/login')}>
                ADMIN ACCESS
              </Button>
            </div>
          </CyberCard>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/10 bg-slate-950 py-10 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-primary-500 text-white flex items-center justify-center font-bold">
              N
            </div>
            <span>NEARBUY 2026 · HYPERLOCAL MONSOON SAFETY OS</span>
          </div>
          <div className="flex gap-6">
            <button onClick={() => navigate('/login')} className="hover:text-primary-400">[ SIGN IN ]</button>
            <button onClick={() => navigate('/signup')} className="hover:text-safety-400">[ REGISTER ]</button>
            <button onClick={() => navigate('/style-preview')} className="hover:text-amber-400">[ THEME DESIGN ]</button>
          </div>
        </div>
      </footer>
    </div>
  )
}
