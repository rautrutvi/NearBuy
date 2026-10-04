import React, { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ParticleCanvas } from '../components/ui/ParticleCanvas'
import { CyberCard } from '../components/ui/CyberCard'
import { Counter } from '../components/ui/Counter'
import { MarqueeTicker } from '../components/ui/MarqueeTicker'
import { InteractiveTimeline } from '../components/ui/InteractiveTimeline'
import { LiveRadarSimulator } from '../components/ui/LiveRadarSimulator'
import { Hologram3DCube } from '../components/ui/Hologram3DCube'
import { TiltCard3D } from '../components/ui/TiltCard3D'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import {
  Store, MapPin, ShieldCheck, Zap, Smartphone, Award,
  ArrowRight, Star, Users, Package, TrendingUp,
  Radio, ShieldAlert, CheckCircle2, QrCode, Sparkles, Terminal
} from 'lucide-react'

export const LandingPage = () => {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '20%'])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])

  const goToRole = (role) => {
    login({ name: `Demo ${role.toUpperCase()}`, email: `${role}@nearbuy.in` }, role)
    if (role === 'buyer') navigate('/buyer')
    else if (role === 'vendor') navigate('/vendor')
    else if (role === 'admin') navigate('/admin')
  }

  return (
    <div className="relative min-h-screen bg-[#050508] text-white overflow-x-hidden selection:bg-primary-500 selection:text-white font-sans">
      {/* Background Interactive Store Constellation Canvas */}
      <ParticleCanvas />

      {/* Cinematic Ambient Glow Beams */}
      <div className="absolute top-10 left-1/4 w-[600px] h-[400px] bg-gradient-to-r from-primary-600/20 via-amber-500/15 to-teal-500/20 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[500px] h-[500px] bg-teal-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[500px] h-[500px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[88vh] flex flex-col items-center justify-center px-4 py-16 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
        >
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-slate-900/90 border border-primary-500/40 text-xs font-mono font-bold text-primary-400 shadow-[0_0_25px_rgba(224,82,54,0.3)] backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
              <span>HYPERLOCAL STORE INVENTORY &amp; MONSOON FLOOD RADAR</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.05]"
            >
              Shop Local,{' '}
              <span className="bg-gradient-to-r from-primary-400 via-amber-300 to-teal-400 bg-clip-text text-transparent drop-shadow-[0_0_35px_rgba(224,82,54,0.5)]">
                Stay Safe
              </span>{' '}
              During Monsoon
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base md:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Nearbuy connects you to verified neighborhood shops with live inventory stock counts, 30-minute free pickup reservations, and real-time community flood radar alerts.
            </motion.p>

            {/* Direct Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3.5 pt-2"
            >
              <Link
                to="/buyer"
                onClick={() => login({ name: 'Demo BUYER', email: 'buyer@nearbuy.in' }, 'buyer')}
                className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 font-mono font-bold text-white text-xs uppercase tracking-wider shadow-[0_0_30px_rgba(224,82,54,0.5)] hover:shadow-[0_0_50px_rgba(224,82,54,0.8)] transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2.5"
              >
                <span>OPEN BUYER SHOP</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/vendor"
                onClick={() => login({ name: 'Demo VENDOR', email: 'vendor@nearbuy.in' }, 'vendor')}
                className="px-7 py-4 rounded-2xl bg-slate-900 border border-white/20 hover:border-teal-400 text-slate-200 hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-2xl hover:shadow-[0_0_30px_rgba(13,148,136,0.3)] flex items-center justify-center"
              >
                VENDOR PORTAL
              </Link>

              <Link
                to="/admin"
                onClick={() => login({ name: 'Demo ADMIN', email: 'admin@nearbuy.in' }, 'admin')}
                className="px-6 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-300 hover:text-white font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center"
              >
                ADMIN PANEL
              </Link>
            </motion.div>
          </div>

          {/* Right Live Interactive Simulator Card & 3D Hologram Cube */}
          <div className="lg:col-span-5 space-y-4">
            <div className="flex justify-center -mb-6">
              <Hologram3DCube size={150} />
            </div>
            <LiveRadarSimulator />
          </div>
        </motion.div>
      </section>

      {/* INFINITE RUNNING TICKER RIBBON */}
      <MarqueeTicker />

      {/* BRIGHT METRICS & COUNTER STATS */}
      <section className="relative py-20 bg-slate-950/80 border-b border-white/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'VERIFIED LOCAL SHOPS', value: 48, suffix: '+', color: 'text-primary-400' },
              { label: 'ACTIVE USERS TODAY', value: 1284, suffix: '', color: 'text-amber-400' },
              { label: 'RESERVATIONS TODAY', value: 237, suffix: '', color: 'text-teal-400' },
              { label: 'RADAR ACCURACY', value: 99.4, suffix: '%', color: 'text-emerald-400' },
            ].map((stat, i) => (
              <CyberCard key={stat.label} tag={`NODE_0${i + 1}`} glowColor={i % 2 === 0 ? 'primary' : 'teal'}>
                <p className={`text-4xl md:text-5xl font-extrabold font-display ${stat.color} drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]`}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-mono font-bold text-slate-400 mt-2 tracking-wider">{stat.label}</p>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE HOW IT WORKS TIMELINE */}
      <section className="py-24 px-4 bg-[#0a0a10] relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-16">
            <span className="text-xs font-mono font-bold text-primary-400 bg-primary-950/80 px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-500/40">
              NEARBUY WORKFLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white">
              SEARCH TO PICKUP IN{' '}
              <span className="bg-gradient-to-r from-primary-400 via-amber-300 to-teal-400 bg-clip-text text-transparent">
                4 SIMPLE STEPS
              </span>
            </h2>
            <p className="text-slate-400 text-sm max-w-xl mx-auto font-mono">
              Click any step below to explore live workflow mechanics.
            </p>
          </div>

          <InteractiveTimeline />
        </div>
      </section>

      {/* ROLE PORTAL GATEWAYS */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-16">
          <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-4 py-1.5 rounded-full uppercase tracking-widest border border-teal-500/40">
            CHOOSE YOUR INTERFACE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-white">
            EXPLORE THE{' '}
            <span className="bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent">
              PORTALS
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buyer Portal Card */}
          <TiltCard3D glowColor="primary" maxTilt={12} scale={1.03} depth={20}>
            <CyberCard tag="BUYER.PORTAL" glowColor="primary">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-[0_0_25px_rgba(224,82,54,0.5)]">
                  <Users className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-display text-white">Customer / Buyer</h3>
                  <p className="text-xs text-slate-400 mt-1">Locate live stock, reserve for 30-min pickup, and view flood radar.</p>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> 3D Holographic Monsoon Radar</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> Multi-item Cart Drawer</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-400 shrink-0" /> Unique Verification Codes</li>
                </ul>
                <Link
                  to="/buyer"
                  onClick={() => login({ name: 'Demo BUYER', email: 'buyer@nearbuy.in' }, 'buyer')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(224,82,54,0.4)] hover:shadow-[0_0_30px_rgba(224,82,54,0.7)] transition-all"
                >
                  <span>OPEN BUYER SHOP</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </CyberCard>
          </TiltCard3D>

          {/* Vendor Portal Card */}
          <TiltCard3D glowColor="teal" maxTilt={12} scale={1.03} depth={20}>
            <CyberCard tag="VENDOR.PORTAL" glowColor="teal">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(13,148,136,0.5)]">
                  <Store className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-extrabold font-display text-white">Shopkeeper / Vendor</h3>
                  <p className="text-xs text-slate-400 mt-1">Manage stock in real-time, scan barcodes, and fulfill pickup orders.</p>
                </div>
                <ul className="space-y-2 text-xs font-mono text-slate-300">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Camera Barcode Scanner UI</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Live Inventory Adjuster</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-400 shrink-0" /> Order Fulfillment Queue</li>
                </ul>
                <Link
                  to="/vendor"
                  onClick={() => login({ name: 'Demo VENDOR', email: 'vendor@nearbuy.in' }, 'vendor')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(13,148,136,0.4)] hover:shadow-[0_0_30px_rgba(13,148,136,0.7)] transition-all"
                >
                  <span>OPEN VENDOR PORTAL</span>
                  <QrCode className="w-4 h-4" />
                </Link>
              </div>
            </CyberCard>
          </TiltCard3D>

          {/* Admin Portal Card */}
          <TiltCard3D glowColor="violet" maxTilt={12} scale={1.03} depth={20}>
            <CyberCard tag="ADMIN.PORTAL" glowColor="violet">
              <div className="space-y-5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-[0_0_25px_rgba(139,92,246,0.5)]">
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
                <Link
                  to="/admin"
                  onClick={() => login({ name: 'Demo ADMIN', email: 'admin@nearbuy.in' }, 'admin')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 text-white font-mono font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(139,92,246,0.4)] hover:shadow-[0_0_30px_rgba(139,92,246,0.7)] transition-all"
                >
                  <span>OPEN ADMIN PANEL</span>
                  <ShieldAlert className="w-4 h-4" />
                </Link>
              </div>
            </CyberCard>
          </TiltCard3D>
        </div>
      </section>
    </div>
  )
}
