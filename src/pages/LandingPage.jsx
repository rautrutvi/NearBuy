import React, { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ParticleCanvas } from '../components/ui/ParticleCanvas'
import { CyberCard } from '../components/ui/CyberCard'
import { Counter } from '../components/ui/Counter'
import { MarqueeTicker } from '../components/ui/MarqueeTicker'
import { InteractiveTimeline } from '../components/ui/InteractiveTimeline'
import { LiveRadarSimulator } from '../components/ui/LiveRadarSimulator'
import { Button } from '../components/ui/Button'
import { useAuthStore } from '../store/useAuthStore'
import {
  Store, MapPin, ShieldCheck, Zap, Smartphone, Award,
  ArrowRight, Star, Users, Package, TrendingUp,
  Radio, ShieldAlert, CheckCircle2, QrCode, Sparkles
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
    <div className="relative min-h-screen bg-slate-50 text-slate-800 overflow-x-hidden selection:bg-primary-500 selection:text-white font-sans">
      {/* Background Interactive Store Constellation Canvas */}
      <ParticleCanvas />

      {/* Warm Ambient Floating Light Orbs */}
      <div className="absolute top-10 left-1/4 w-[500px] h-[350px] bg-gradient-to-r from-orange-200/40 via-amber-200/30 to-teal-200/40 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-96 right-10 w-[400px] h-[400px] bg-teal-200/30 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute bottom-40 left-10 w-[450px] h-[450px] bg-violet-200/30 rounded-full blur-[140px] pointer-events-none" />

      {/* HERO SECTION */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-12 overflow-hidden"
      >
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center"
        >
          {/* Left Hero Text */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white/90 border border-primary-200 text-xs font-mono font-bold text-primary-700 shadow-soft backdrop-blur-md"
            >
              <Sparkles className="w-4 h-4 text-amber-500 animate-spin" />
              <span>HYPERLOCAL STORE INVENTORY &amp; MONSOON FLOOD RADAR</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold font-display tracking-tight text-slate-900 leading-[1.05]"
            >
              Shop Local,{' '}
              <span className="bg-gradient-to-r from-primary-500 via-amber-500 to-teal-600 bg-clip-text text-transparent">
                Stay Safe
              </span>{' '}
              Every Day
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-base md:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal"
            >
              Nearbuy connects you to verified neighborhood shops with live inventory stock counts, 30-minute free pickup reservations, and real-time community flood radar alerts.
            </motion.p>

            {/* Direct Action Buttons - Instantly Working */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="flex flex-wrap items-center justify-center lg:justify-start gap-3 pt-2"
            >
              <button
                onClick={() => goToRole('buyer')}
                className="relative group px-8 py-4 rounded-2xl bg-gradient-to-r from-primary-500 via-amber-500 to-teal-600 font-display font-extrabold text-white text-base shadow-lift hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="flex items-center gap-2.5">
                  OPEN BUYER SHOP <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </button>

              <button
                onClick={() => goToRole('vendor')}
                className="px-7 py-4 rounded-2xl bg-white border border-slate-200 hover:border-teal-500 text-slate-800 hover:text-teal-700 font-display font-extrabold text-base transition-all duration-300 shadow-soft hover:shadow-lg"
              >
                VENDOR PORTAL
              </button>

              <button
                onClick={() => goToRole('admin')}
                className="px-6 py-4 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-display font-bold text-sm transition-all"
              >
                ADMIN PANEL
              </button>
            </motion.div>
          </div>

          {/* Right Live Interactive Simulator Card */}
          <div className="lg:col-span-5">
            <LiveRadarSimulator />
          </div>
        </motion.div>
      </section>

      {/* INFINITE RUNNING TICKER RIBBON */}
      <MarqueeTicker />

      {/* BRIGHT METRICS & COUNTER STATS */}
      <section className="relative py-16 bg-white/70 backdrop-blur-sm border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { label: 'VERIFIED LOCAL SHOPS', value: 48, suffix: '+', color: 'text-primary-600' },
              { label: 'ACTIVE USERS TODAY', value: 1284, suffix: '', color: 'text-amber-600' },
              { label: 'RESERVATIONS TODAY', value: 237, suffix: '', color: 'text-teal-600' },
              { label: 'ACCURACY SCORE', value: 99.4, suffix: '%', color: 'text-emerald-600' },
            ].map((stat, i) => (
              <CyberCard key={stat.label} tag={`NODE_0${i + 1}`} glowColor={i % 2 === 0 ? 'primary' : 'teal'}>
                <p className={`text-4xl md:text-5xl font-extrabold font-display ${stat.color}`}>
                  <Counter to={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-xs font-mono font-bold text-slate-500 mt-2 tracking-wider">{stat.label}</p>
              </CyberCard>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE HOW IT WORKS TIMELINE */}
      <section className="py-20 px-4 bg-slate-100/60 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center space-y-3 mb-14">
            <span className="text-xs font-mono font-bold text-primary-700 bg-primary-100/80 px-4 py-1.5 rounded-full uppercase tracking-widest border border-primary-200">
              NEARBUY WORKFLOW
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900">
              SEARCH TO PICKUP IN{' '}
              <span className="bg-gradient-to-r from-primary-500 to-amber-500 bg-clip-text text-transparent">
                4 SIMPLE STEPS
              </span>
            </h2>
            <p className="text-slate-500 text-sm max-w-xl mx-auto">
              Interactive process breakdown — click any step to explore details.
            </p>
          </div>

          <InteractiveTimeline />
        </div>
      </section>

      {/* ROLE PORTAL GATEWAYS - ALL CLICKABLE & INSTANTLY WORKING */}
      <section className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center space-y-3 mb-14">
          <span className="text-xs font-mono font-bold text-teal-700 bg-teal-100/80 px-4 py-1.5 rounded-full uppercase tracking-widest border border-teal-200">
            CHOOSE YOUR INTERFACE
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold font-display text-slate-900">
            EXPLORE THE{' '}
            <span className="bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent">
              PORTALS
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Buyer Portal Card */}
          <CyberCard tag="BUYER.PORTAL" glowColor="primary">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-amber-500 flex items-center justify-center text-white shadow-lift">
                <Users className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-slate-900">Customer / Buyer</h3>
                <p className="text-xs text-slate-500 mt-1">Locate live stock, reserve for 30-min pickup, and view flood radar.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> Interactive Leaflet Flood Map</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> Multi-item Cart Drawer</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-primary-500 shrink-0" /> Unique Verification Codes</li>
              </ul>
              <Button variant="primary" className="w-full py-3 font-mono font-bold" icon={ArrowRight} onClick={() => goToRole('buyer')}>
                OPEN BUYER SHOP
              </Button>
            </div>
          </CyberCard>

          {/* Vendor Portal Card */}
          <CyberCard tag="VENDOR.PORTAL" glowColor="teal">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 flex items-center justify-center text-white shadow-safety">
                <Store className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-slate-900">Shopkeeper / Vendor</h3>
                <p className="text-xs text-slate-500 mt-1">Manage stock in real-time, scan barcodes, and fulfill pickup orders.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Camera Barcode Scanner UI</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Live Inventory Adjuster</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" /> Order Fulfillment Queue</li>
              </ul>
              <Button variant="safety" className="w-full py-3 font-mono font-bold" icon={QrCode} onClick={() => goToRole('vendor')}>
                OPEN VENDOR PORTAL
              </Button>
            </div>
          </CyberCard>

          {/* Admin Portal Card */}
          <CyberCard tag="ADMIN.PORTAL" glowColor="violet">
            <div className="space-y-5">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white shadow-lg">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <h3 className="text-2xl font-extrabold font-display text-slate-900">Super Admin</h3>
                <p className="text-xs text-slate-500 mt-1">Verify new merchant applications and publish community flood reports.</p>
              </div>
              <ul className="space-y-2 text-xs font-mono text-slate-600">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" /> Shop Approval Queue</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" /> Flood Telemetry Verification</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-violet-500 shrink-0" /> Platform Analytics Charts</li>
              </ul>
              <Button variant="secondary" className="w-full py-3 font-mono font-bold" icon={ShieldAlert} onClick={() => goToRole('admin')}>
                OPEN ADMIN PANEL
              </Button>
            </div>
          </CyberCard>
        </div>
      </section>
    </div>
  )
}
