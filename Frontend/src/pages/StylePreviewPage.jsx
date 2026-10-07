import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '../components/ui/Button'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { StockBadge, FloodBadge, Badge } from '../components/ui/Badge'
import { ProgressTracker } from '../components/ui/ProgressTracker'
import { EmptyState } from '../components/ui/EmptyState'
import { Search, ShoppingBag, ShieldAlert, Sparkles, Store, MapPin, PackageCheck } from 'lucide-react'

export const StylePreviewPage = () => {
  const [trackerStep, setTrackerStep] = useState('ready')
  const [stockCount, setStockCount] = useState(4)
  const [inputVal, setInputVal] = useState('')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-primary-500 via-primary-600 to-safety-600 text-white p-8 md:p-10 shadow-lift relative overflow-hidden"
      >
        <div className="relative z-10 space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" /> Nearbuy Design System Preview
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold font-display leading-tight">
            Local Commerce Meets Monsoon Safety
          </h1>
          <p className="text-primary-100 text-sm md:text-base leading-relaxed">
            Welcome to the Nearbuy UI theme showcase. Explore custom color palettes, responsive typography, live-stock pulsing indicators, flood alert badges, and smooth Framer Motion micro-interactions.
          </p>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-10 -bottom-10 w-72 h-72 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </motion.div>

      {/* 1. Color Palette Section */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold font-display text-slate-800">1. Color System</h2>
          <p className="text-sm text-slate-500">Custom warm terracotta commerce palette paired with calm monsoon safety teal.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card hoverEffect={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Warm Primary (Terracotta)</h3>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-primary-500 text-white text-xs font-bold flex items-center justify-between px-3">
                <span>Primary-500</span> <span>#E05236</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="h-6 rounded bg-primary-300 text-[10px] flex items-center justify-center text-slate-800 font-medium">300</div>
                <div className="h-6 rounded bg-primary-600 text-[10px] flex items-center justify-center text-white font-medium">600</div>
                <div className="h-6 rounded bg-primary-800 text-[10px] flex items-center justify-center text-white font-medium">800</div>
              </div>
            </div>
          </Card>

          <Card hoverEffect={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Monsoon Safety (Teal)</h3>
            <div className="space-y-2">
              <div className="h-10 rounded-lg bg-safety-500 text-white text-xs font-bold flex items-center justify-between px-3">
                <span>Safety-500</span> <span>#0D9488</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <div className="h-6 rounded bg-safety-300 text-[10px] flex items-center justify-center text-slate-800 font-medium">300</div>
                <div className="h-6 rounded bg-safety-700 text-[10px] flex items-center justify-center text-white font-medium">700</div>
                <div className="h-6 rounded bg-safety-900 text-[10px] flex items-center justify-center text-white font-medium">900</div>
              </div>
            </div>
          </Card>

          <Card hoverEffect={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Flood Urgency Scale</h3>
            <div className="space-y-2">
              <div className="h-7 rounded bg-flood-safe text-white text-xs font-semibold flex items-center justify-between px-3">
                <span>Safe Zone</span> <span>Green</span>
              </div>
              <div className="h-7 rounded bg-flood-watch text-white text-xs font-semibold flex items-center justify-between px-3">
                <span>Waterlog Watch</span> <span>Amber</span>
              </div>
              <div className="h-7 rounded bg-flood-alert text-white text-xs font-semibold flex items-center justify-between px-3">
                <span>Flood Alert</span> <span>Coral Red</span>
              </div>
            </div>
          </Card>

          <Card hoverEffect={false}>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Surface & Neutrals</h3>
            <div className="space-y-2">
              <div className="h-7 rounded bg-surface-50 border border-slate-200 text-slate-700 text-xs font-medium flex items-center justify-between px-3">
                <span>Surface-50</span> <span>Off-white</span>
              </div>
              <div className="h-7 rounded bg-surface-200 text-slate-800 text-xs font-medium flex items-center justify-between px-3">
                <span>Surface-200</span> <span>Slate-200</span>
              </div>
              <div className="h-7 rounded bg-slate-900 text-white text-xs font-medium flex items-center justify-between px-3">
                <span>Neutral Dark</span> <span>Slate-900</span>
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* 2. Typography Hierarchy */}
      <section className="space-y-4">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold font-display text-slate-800">2. Typography Scale</h2>
          <p className="text-sm text-slate-500">Outfit for headings paired with Inter for clear body copy.</p>
        </div>

        <Card hoverEffect={false} className="space-y-4">
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono">Display H1 — Outfit 36px</span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 font-display">
              Hyperlocal Shop Inventory at Your Fingertips
            </h1>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono">Display H2 — Outfit 28px</span>
            <h2 className="text-2xl font-bold text-slate-800 font-display">
              Real-Time Monsoon Flood Radar & Safe Routes
            </h2>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono">Display H3 — Outfit 20px</span>
            <h3 className="text-xl font-semibold text-slate-800 font-display">
              Guaranteed Pickup Within 30 Minutes
            </h3>
          </div>
          <div>
            <span className="text-xs text-slate-400 uppercase font-mono">Body Regular — Inter 14px</span>
            <p className="text-sm text-slate-600 leading-relaxed max-w-3xl">
              Buyers can view live stock counts updated directly by local vendors through barcode scans. During monsoon waterlogging, Nearbuy flags safe navigation zones so you can reserve items and pick them up safely.
            </p>
          </div>
        </Card>
      </section>

      {/* 3. Reusable UI Components */}
      <section className="space-y-6">
        <div className="border-b border-slate-200 pb-3">
          <h2 className="text-2xl font-bold font-display text-slate-800">3. Interactive UI Components</h2>
          <p className="text-sm text-slate-500">Buttons with Framer Motion spring micro-interactions, inputs, and state badges.</p>
        </div>

        {/* Buttons */}
        <Card hoverEffect={false} className="space-y-4">
          <h3 className="text-base font-semibold text-slate-800">Buttons & Micro-interactions (Hover / Tap)</h3>
          <div className="flex flex-wrap gap-3 items-center">
            <Button variant="primary" icon={ShoppingBag}>Primary Button</Button>
            <Button variant="safety" icon={MapPin}>Monsoon Safety</Button>
            <Button variant="secondary">Secondary Action</Button>
            <Button variant="outline">Outline Button</Button>
            <Button variant="ghost">Ghost Button</Button>
            <Button variant="danger" icon={ShieldAlert}>Report Hazard</Button>
            <Button variant="primary" isLoading={true}>Processing</Button>
          </div>
          <div className="flex flex-wrap gap-3 items-center pt-2">
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="md">Medium</Button>
            <Button variant="primary" size="lg">Large Action</Button>
          </div>
        </Card>

        {/* Form Inputs */}
        <Card hoverEffect={false} className="space-y-4">
          <h3 className="text-base font-semibold text-slate-800">Input Controls</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Search Nearby Products"
              icon={Search}
              placeholder="Try 'Umbrella', 'Rice 5kg', or 'Torch'..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <Input
              label="Shop Registration Code"
              placeholder="e.g. SHOP-9842"
              error={inputVal === 'error' ? 'Invalid shop registration code' : ''}
            />
          </div>
        </Card>

        {/* Badges & Live Stock Pulsing */}
        <Card hoverEffect={false} className="space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Live Stock Pulse Indicator</h3>
            <p className="text-xs text-slate-500 mb-3">Live stock counts feature active pulsing indicators to highlight real-time availability.</p>
            <div className="flex flex-wrap items-center gap-4">
              <StockBadge count={stockCount} />
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => setStockCount(0)}>Set 0 (Out)</Button>
                <Button variant="outline" size="sm" onClick={() => setStockCount(3)}>Set 3 (Low)</Button>
                <Button variant="outline" size="sm" onClick={() => setStockCount(12)}>Set 12 (In Stock)</Button>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4">
            <h3 className="text-base font-semibold text-slate-800 mb-1">Monsoon Flood Badges</h3>
            <p className="text-xs text-slate-500 mb-3">Subtle, non-strobing safety alerts with color-coded severity.</p>
            <div className="flex flex-wrap gap-3">
              <FloodBadge level="safe" />
              <FloodBadge level="watch" />
              <FloodBadge level="alert" />
            </div>
          </div>
        </Card>

        {/* Animated Reservation Progress Tracker */}
        <Card hoverEffect={false} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-semibold text-slate-800">Animated Reservation Tracker</h3>
              <p className="text-xs text-slate-500">Live order pickup progress from reservation to shop pickup.</p>
            </div>
            <div className="flex gap-1 bg-surface-100 p-1 rounded-xl">
              <button
                onClick={() => setTrackerStep('pending')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trackerStep === 'pending' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-600'
                }`}
              >
                1. Placed
              </button>
              <button
                onClick={() => setTrackerStep('ready')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trackerStep === 'ready' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-600'
                }`}
              >
                2. Ready
              </button>
              <button
                onClick={() => setTrackerStep('picked_up')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                  trackerStep === 'picked_up' ? 'bg-white shadow-soft text-primary-600' : 'text-slate-600'
                }`}
              >
                3. Picked Up
              </button>
            </div>
          </div>

          <ProgressTracker currentStep={trackerStep} />
        </Card>

        {/* Empty State Component */}
        <Card hoverEffect={false} className="space-y-4">
          <h3 className="text-base font-semibold text-slate-800">Designed Empty State Component</h3>
          <EmptyState
            icon={Store}
            title="No Shops Operating in 1km Radius"
            description="All nearby vendors are currently closed or experiencing severe monsoon waterlogging. Check safe routes to expanding radius."
            actionLabel="View Flood Safe Map"
            onAction={() => alert('Empty state action clicked!')}
          />
        </Card>
      </section>
    </div>
  )
}
