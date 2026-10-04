import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, Clock, Navigation, CheckCircle2 } from 'lucide-react'

const STEPS = [
  {
    step: '01',
    title: 'Search Real-Time Inventory',
    subtitle: 'Check live stock at nearby Kirana, Pharmacy & Hardware stores before stepping out.',
    icon: Search,
    color: 'from-orange-500 to-amber-500',
    details: 'Filter by category (Monsoon Essentials, Groceries, Medicines) or type product names. Live stock count badges display exact units remaining.',
  },
  {
    step: '02',
    title: 'Reserve Items for Free',
    subtitle: 'Lock in your items with a single tap. No upfront payment required.',
    icon: ShoppingBag,
    color: 'from-teal-500 to-emerald-500',
    details: 'Your reservation holds shopkeeper stock for 30 minutes. Receive a unique verification code instantly on your phone.',
  },
  {
    step: '03',
    title: 'Monsoon Safe Routing',
    subtitle: 'Check the Leaflet flood radar map to avoid waterlogged roads & underpasses.',
    icon: Navigation,
    color: 'from-sky-500 to-indigo-500',
    details: 'Community-verified waterlogging zones show safe routes so you reach the shop dry and risk-free.',
  },
  {
    step: '04',
    title: 'Express Counter Pickup',
    subtitle: 'Show your verification code at shop counter, pay cash, and grab your item.',
    icon: Clock,
    color: 'from-violet-500 to-purple-500',
    details: 'Track live reservation progress: Pending -> Ready for Pickup -> Picked Up.',
  },
]

export const InteractiveTimeline = () => {
  const [activeStep, setActiveStep] = useState(0)

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Step Buttons Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {STEPS.map((s, idx) => {
          const Icon = s.icon
          const isActive = activeStep === idx

          return (
            <motion.button
              key={s.step}
              onClick={() => setActiveStep(idx)}
              whileHover={{ scale: 1.03, y: -4 }}
              whileTap={{ scale: 0.97 }}
              className={`relative text-left p-6 rounded-3xl border-2 transition-all duration-300 ${
                isActive
                  ? 'bg-white shadow-2xl border-primary-500 text-slate-900 scale-105 z-10'
                  : 'bg-white/80 hover:bg-white border-slate-200 text-slate-600 shadow-soft'
              }`}
            >
              {/* Step indicator header */}
              <div className="flex items-center justify-between mb-4">
                <span className={`text-xs font-mono font-extrabold px-3 py-1 rounded-full ${
                  isActive ? 'bg-primary-500 text-white shadow-md' : 'bg-slate-100 text-slate-500'
                }`}>
                  STEP {s.step}
                </span>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${s.color} text-white flex items-center justify-center shadow-lg`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              <h4 className="font-bold font-display text-base text-slate-900 leading-snug">{s.title}</h4>
              <p className="text-xs text-slate-500 mt-2 line-clamp-2">{s.subtitle}</p>

              {/* Active glow bar */}
              {isActive && (
                <motion.div
                  layoutId="activeBar"
                  className="absolute -bottom-1 left-6 right-6 h-1.5 rounded-full bg-gradient-to-r from-primary-500 to-teal-500 shadow-lift"
                />
              )}
            </motion.button>
          )
        })}
      </div>

      {/* Expanded Active Step Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -15 }}
          transition={{ duration: 0.3 }}
          className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-8 text-white border border-white/10 shadow-2xl relative overflow-hidden"
        >
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-teal-400 bg-teal-950/80 px-3 py-1 rounded-full border border-teal-500/40">
                  STEP {STEPS[activeStep].step} DETAIL
                </span>
                <span className="text-xs text-slate-400 font-mono">Nearbuy Hyperlocal Workflow</span>
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold font-display text-white">
                {STEPS[activeStep].title}
              </h3>
              <p className="text-sm text-slate-300 leading-relaxed">
                {STEPS[activeStep].details}
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-5 py-3 rounded-2xl border border-white/20 shrink-0">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <span className="text-xs font-bold text-white font-mono">100% FREE FOR BUYERS</span>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
