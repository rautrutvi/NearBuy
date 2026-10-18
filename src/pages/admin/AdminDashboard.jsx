import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FloodBadge } from '../../components/ui/Badge'
import { TiltCard3D } from '../../components/ui/TiltCard3D'
import { adminService } from '../../api/adminService'
import {
  ShieldCheck, AlertTriangle, Building2, Activity, Users,
  CheckCircle2, XCircle, MapPin, Clock, X, AlertCircle,
  TrendingUp, Package, Star, ShieldAlert, Terminal, Radio, Cpu
} from 'lucide-react'

const PENDING_SHOPS = [
  {
    id: 'new-1',
    name: 'Ravi Electronics & Mobile Accessories',
    owner: 'Ravi Shankar',
    address: 'Sector 7, Industrial Zone',
    phone: '+91 97001 23456',
    category: 'Electronics',
    submittedAt: '2 hours ago',
    floodZone: 'safe',
  },
  {
    id: 'new-2',
    name: 'Preeti Organic Vegetables & Fruits',
    owner: 'Preeti Deshpande',
    address: 'Ganesh Nagar, Plot 12',
    phone: '+91 98765 00123',
    category: 'Grocery',
    submittedAt: '5 hours ago',
    floodZone: 'watch',
  },
]

const PENDING_FLOOD_REPORTS = [
  {
    id: 'fr-1',
    areaName: 'Subhash Nagar Railway Underpass',
    reportedBy: 'Amit Kulkarni (Verified Buyer)',
    severity: 'alert',
    waterDepthCm: 45,
    reportedAt: '15 mins ago',
    verifiedByAdmin: false,
  },
  {
    id: 'fr-2',
    areaName: 'Market Yard Chowk Junction',
    reportedBy: 'Shop Owner: Sharma Kirana',
    severity: 'watch',
    waterDepthCm: 18,
    reportedAt: '40 mins ago',
    verifiedByAdmin: false,
  },
]

const PLATFORM_STATS = [
  { label: 'Total Verified Shops', value: '48', icon: Building2, color: 'text-teal-400', border: 'border-teal-500/30', trend: '+3 this week' },
  { label: 'Active Users Today', value: '1,284', icon: Users, color: 'text-amber-400', border: 'border-amber-500/30', trend: '+12% vs yesterday' },
  { label: 'Reservations Today', value: '237', icon: Package, color: 'text-primary-400', border: 'border-primary-500/30', trend: '+8% vs yesterday' },
  { label: 'Avg Shop Rating', value: '4.7★', icon: Star, color: 'text-violet-400', border: 'border-violet-500/30', trend: 'Stable 99.4%' },
]

export const AdminDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)
  const [activeTab, setActiveTab] = useState('shops')
  const [pendingShops, setPendingShops] = useState(PENDING_SHOPS)
  const [floodReports, setFloodReports] = useState(PENDING_FLOOD_REPORTS)
  const [platformStats, setPlatformStats] = useState(PLATFORM_STATS)
  const [processingId, setProcessingId] = useState(null)

  useEffect(() => {
    loadAdminData()
  }, [])

  const loadAdminData = async () => {
    try {
      const [shops, floods, stats] = await Promise.all([
        adminService.getPendingShops(),
        adminService.getPendingFloodZones(),
        adminService.getAdminStats(),
      ])
      if (Array.isArray(shops) && shops.length > 0) setPendingShops(shops)
      if (Array.isArray(floods) && floods.length > 0) setFloodReports(floods)
      if (stats && stats.totalUsers) {
        setPlatformStats([
          { label: 'Total Verified Shops', value: String(stats.totalShops || 48), icon: Building2, color: 'text-teal-400', border: 'border-teal-500/30', trend: `${stats.pendingShops || 0} pending` },
          { label: 'Active Users Today', value: Number(stats.totalUsers || 1284).toLocaleString(), icon: Users, color: 'text-amber-400', border: 'border-amber-500/30', trend: 'Verified platform' },
          { label: 'Reservations Total', value: String(stats.totalReservations || 237), icon: Package, color: 'text-primary-400', border: 'border-primary-500/30', trend: 'Live system' },
          { label: 'Active Flood Zones', value: String(stats.activeFloodZones || 3), icon: AlertTriangle, color: 'text-violet-400', border: 'border-violet-500/30', trend: `${stats.pendingFloodZones || 0} reports pending` },
        ])
      }
    } catch (e) {
      console.warn('Failed to load admin data from backend', e?.message)
    }
  }

  const handleShopVerify = async (shopId, approved) => {
    setProcessingId(shopId)
    try {
      const numericId = typeof shopId === 'string' ? parseInt(shopId.replace(/\D/g, '') || '0') : shopId
      if (numericId > 0) {
        await adminService.verifyShop(numericId, approved ? 'APPROVED' : 'REJECTED')
      }
    } catch (e) {
      console.warn('Backend shop verification failed, applying locally', e?.message)
    }
    localStorage.setItem('nearbuy_vendor_approved', approved ? 'true' : 'false')
    setPendingShops((prev) => prev.filter((s) => s.id !== shopId))
    setProcessingId(null)
  }

  const handleFloodVerify = async (reportId, approved) => {
    setProcessingId(reportId)
    try {
      const numericId = typeof reportId === 'string' ? parseInt(reportId.replace(/\D/g, '') || '0') : reportId
      if (numericId > 0) {
        await adminService.verifyFloodZone(numericId, approved ? 'VERIFIED' : 'REJECTED')
      }
    } catch (e) {
      console.warn('Backend flood zone verification failed, applying locally', e?.message)
    }
    setFloodReports((prev) =>
      prev.map((r) => r.id === reportId ? { ...r, verifiedByAdmin: true, approved } : r)
    )
    setProcessingId(null)
  }

  const tabs = [
    { id: 'shops', label: 'Shop Verification', icon: Building2, badge: pendingShops.length },
    { id: 'floods', label: 'Flood Reports', icon: AlertTriangle, badge: floodReports.filter(f => !f.verifiedByAdmin).length },
    { id: 'stats', label: 'Platform Stats', icon: Activity, badge: null },
  ]

  return (
    <div className="min-h-screen bg-transparent text-white px-4 py-8 relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[350px] bg-violet-600/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[450px] h-[350px] bg-amber-600/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">

        {/* Alert Banner */}
        {accessAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-950/70 border border-amber-500/50 p-4 rounded-2xl flex items-center justify-between text-amber-300 text-xs font-mono"
          >
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span>{accessAlert}</span>
            </div>
            <button onClick={() => setAccessAlert(null)} className="text-amber-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}

        {/* Header Banner */}
        <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-violet-500/40 via-amber-500/40 to-teal-500/40 shadow-2xl">
          <div className="bg-[#0c0c14]/90 backdrop-blur-xl p-6 rounded-[23px] border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="w-2.5 h-2.5 rounded-full bg-violet-400 animate-ping" />
                <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
                  Admin Mission Control
                </h1>
                <span className="px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-violet-950/80 text-violet-300 border border-violet-500/40">
                  SUPER ADMIN: rautrutvi@gmail.com
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                Verify merchant registrations · Validate community flood telemetry · Supervise network health
              </p>
            </div>

            <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-2xl border border-white/10">
              <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span className="text-xs font-mono text-emerald-400 font-bold">RADAR TELEMETRY LIVE</span>
            </div>
          </div>
        </div>

        {/* Stats Row with 3D Physics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {platformStats.map((stat) => {
            const Icon = stat.icon
            return (
              <TiltCard3D key={stat.label} glowColor="violet" maxTilt={14} scale={1.03} depth={15}>
                <div className={`p-5 rounded-2xl bg-[#0d0d16] border ${stat.border} shadow-xl space-y-2 h-full`}>
                  <div style={{ transform: 'translateZ(15px)' }} className="flex items-center justify-between">
                    <Icon className={`w-5 h-5 ${stat.color}`} />
                    <span className="text-[10px] font-mono text-emerald-400">{stat.trend}</span>
                  </div>
                  <p style={{ transform: 'translateZ(20px)' }} className="text-3xl font-extrabold font-display text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.2)]">
                    {stat.value}
                  </p>
                  <p style={{ transform: 'translateZ(10px)' }} className="text-xs font-mono text-slate-400">
                    {stat.label}
                  </p>
                </div>
              </TiltCard3D>
            )
          })}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-white/10 w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-[0_0_15px_rgba(139,92,246,0.4)]'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
                {tab.badge > 0 && (
                  <span className="bg-primary-500 text-white text-[10px] font-bold rounded-full px-1.5 py-0.5 leading-none">
                    {tab.badge}
                  </span>
                )}
              </button>
            )
          })}
        </div>

        {/* TAB 1: Pending Shop Verification */}
        {activeTab === 'shops' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold font-display text-white">
              Pending Merchant Applications ({pendingShops.length})
            </h2>

            {pendingShops.length === 0 ? (
              <div className="p-12 text-center bg-[#0d0d16] rounded-3xl border border-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="font-bold text-lg font-display text-white">All Applications Reviewed</h3>
                <p className="text-xs font-mono text-slate-400 mt-1">No pending shops awaiting verification.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingShops.map((shop) => (
                  <div key={shop.id} className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4 shadow-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-bold text-base font-display text-white">{shop.name}</h3>
                          <FloodBadge level={shop.floodZone} label={`Zone: ${shop.floodZone}`} />
                        </div>
                        <p className="text-xs font-mono text-slate-300">Owner: {shop.owner} ({shop.phone})</p>
                      </div>
                      <span className="text-[10px] font-mono text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-lg border border-amber-500/30 shrink-0">
                        {shop.submittedAt}
                      </span>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-900 border border-white/10 text-xs font-mono text-slate-300 space-y-1">
                      <p className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-primary-400" /> {shop.address}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-teal-400" /> Category: {shop.category}
                      </p>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        disabled={processingId === shop.id}
                        onClick={() => handleShopVerify(shop.id, false)}
                        className="flex-1 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                      <button
                        disabled={processingId === shop.id}
                        onClick={() => handleShopVerify(shop.id, true)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(13,148,136,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="w-4 h-4" /> Approve Shop
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* TAB 2: Flood Telemetry Verification */}
        {activeTab === 'floods' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold font-display text-white">
              Community Flood Telemetry Queue
            </h2>
            <div className="space-y-4">
              {floodReports.map((report) => (
                <div key={report.id} className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4 shadow-xl">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <ShieldAlert className={`w-5 h-5 ${report.severity === 'alert' ? 'text-rose-500' : 'text-amber-500'}`} />
                        <h3 className="font-bold text-base font-display text-white">{report.areaName}</h3>
                      </div>
                      <p className="text-xs font-mono text-slate-400">Reported by: <strong className="text-slate-200">{report.reportedBy}</strong></p>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">Water Depth: <strong className="text-amber-400">{report.waterDepthCm} cm</strong> · {report.reportedAt}</p>
                    </div>
                    <FloodBadge level={report.severity} />
                  </div>

                  {report.verifiedByAdmin ? (
                    <div className="bg-emerald-950/70 border border-emerald-500/40 p-3 rounded-xl text-xs font-mono text-emerald-300 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      {report.approved ? 'Telemetry verified and published to safety radar map.' : 'Dismissed as false report.'}
                    </div>
                  ) : (
                    <div className="flex gap-2">
                      <button
                        disabled={processingId === report.id}
                        onClick={() => handleFloodVerify(report.id, false)}
                        className="flex-1 py-2.5 rounded-xl bg-rose-950/80 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-mono text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                      >
                        <XCircle className="w-4 h-4" /> Dismiss
                      </button>
                      <button
                        disabled={processingId === report.id}
                        onClick={() => handleFloodVerify(report.id, true)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(224,82,54,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-1.5"
                      >
                        <ShieldCheck className="w-4 h-4" /> Verify &amp; Publish to Radar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* TAB 3: Analytics */}
        {activeTab === 'stats' && (
          <section className="space-y-4">
            <h2 className="text-lg font-bold font-display text-white">Platform Telemetry Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4">
                <h3 className="font-bold text-sm font-mono text-slate-300">Shop Category Distribution</h3>
                {[
                  { label: 'Grocery / Kirana Stores', count: 22, pct: 46 },
                  { label: 'Pharmacy & Medical Supplies', count: 12, pct: 25 },
                  { label: 'Hardware, Tools & Torches', count: 8, pct: 17 },
                  { label: 'Electronics & Radios', count: 6, pct: 12 },
                ].map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                      <span>{item.label}</span>
                      <span className="text-white font-bold">{item.count} shops ({item.pct}%)</span>
                    </div>
                    <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                      <div
                        style={{ width: `${item.pct}%` }}
                        className="h-full bg-gradient-to-r from-primary-500 via-amber-500 to-teal-500 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4">
                <h3 className="font-bold text-sm font-mono text-slate-300">Monsoon Flood Hazard Status</h3>
                {[
                  { label: 'Safe Dry Zones', value: '36 shops', color: 'bg-emerald-400' },
                  { label: 'Waterlogging Watch Zones', value: '9 shops', color: 'bg-amber-400' },
                  { label: 'Severe Alert Underpasses', value: '3 shops', color: 'bg-rose-500' },
                ].map((zone) => (
                  <div key={zone.label} className="flex items-center justify-between p-3 rounded-xl bg-slate-900 border border-white/10">
                    <div className="flex items-center gap-2.5">
                      <span className={`w-3 h-3 rounded-full ${zone.color}`} />
                      <span className="text-xs font-mono text-slate-300">{zone.label}</span>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{zone.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      </div>
    </div>
  )
}
