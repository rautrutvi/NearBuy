import React from 'react'
import { motion } from 'framer-motion'
import { Clock, CheckCircle2, ShoppingBag } from 'lucide-react'

export const ProgressTracker = ({ currentStep = 'pending' }) => {
  const steps = [
    { id: 'pending', label: 'Reservation Placed', icon: Clock },
    { id: 'ready', label: 'Ready at Shop', icon: ShoppingBag },
    { id: 'picked_up', label: 'Picked Up', icon: CheckCircle2 },
  ]

  const stepIndexes = {
    pending: 0,
    ready: 1,
    picked_up: 2,
  }

  const activeIndex = stepIndexes[currentStep] ?? 0
  const progressPercent = (activeIndex / (steps.length - 1)) * 100

  return (
    <div className="w-full py-4">
      {/* Progress Bar Container */}
      <div className="relative flex items-center justify-between mb-3">
        {/* Background Track */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-slate-200 -translate-y-1/2 z-0 rounded-full" />
        
        {/* Animated Progress Fill */}
        <motion.div
          className="absolute top-1/2 left-0 h-1 bg-gradient-to-r from-primary-500 to-safety-500 -translate-y-1/2 z-0 rounded-full"
          initial={{ width: '0%' }}
          animate={{ width: `${progressPercent}%` }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
        />

        {/* Step Nodes */}
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex
          const isCurrent = idx === activeIndex
          const Icon = step.icon

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: isCurrent ? 1.15 : 1 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                  isCompleted
                    ? 'bg-safety-500 border-safety-500 text-white shadow-md'
                    : isCurrent
                    ? 'bg-white border-primary-500 text-primary-600 shadow-lift'
                    : 'bg-white border-slate-300 text-slate-400'
                }`}
              >
                <Icon className="w-4 h-4" />
              </motion.div>

              <span
                className={`mt-2 text-xs font-medium text-center max-w-[90px] ${
                  isCurrent ? 'text-primary-700 font-semibold' : isCompleted ? 'text-slate-700' : 'text-slate-400'
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
