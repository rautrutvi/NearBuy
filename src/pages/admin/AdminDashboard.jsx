import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { FloodBadge } from '../../components/ui/Badge'
import {
  ShieldCheck, AlertTriangle, Building2, Activity, Users,
  CheckCircle2, XCircle, Eye, MapPin, Clock, X, AlertCircle,
  TrendingUp, Package, Star, ShieldAlert
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
  { label: 'Total Verified Shops', value: '48', icon: Building2, color: 'bg-slate-100 text-slate-700', trend: '+3 this week' },
  { label: 'Active Users Today', value: '1,284', icon: Users, color: 'bg-primary-50 text-primary-700', trend: '+12% vs yesterday' },
  { label: 'Reservations Today', value: '237', icon: Package, color: 'bg-safety-50 text-safety-700', trend: '+8% vs yesterday' },
  { label: 'Avg Shop Rating', value: '4.7★', icon: Star, color: 'bg-amber-50 text-amber-700', trend: 'Stable' },
]

export const AdminDashboard = () => {
  const location = useLocation()
  const [accessAlert, setAccessAlert] = useState(location.state?.message || null)
  const [activeTab, setActiveTab] = useState('shops')
  const [pendingShops, setPendingShops] = useState(PENDING_SHOPS)
  const [floodReports, setFloodReports] = useState(PENDING_FLOOD_REPORTS)
  const [processingId, setProcessingId] = useState(null)

  const handleShopVerify = async (shopId, approved) => {
    setProcessingId(shopId)
    await new Promise((r) => setTimeout(r, 600))
    setPendingShops((prev) => prev.filter((s) => s.id !== shopId))
    setProcessingId(null)
  }

  const handleFloodVerify = async (reportId, approved) => {
    setProcessingId(reportId)
    await new Promise((r) => setTimeout(r, 600))
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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Access Denied Alert Banner */}
      {accessAlert && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-rose-800 text-xs font-semibold"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>{accessAlert}</span>
          </div>
          <button onClick={() => setAccessAlert(null)}>
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-slate-900 to-slate-700 p-6 rounded-3xl text-white">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl md:text-3xl font-bold font-display">Admin Control Center</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white border border-white/20">Super Admin</span>
          </div>
          <p className="text-xs text-slate-300">Verify shops, validate flood reports, and monitor platform health.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </div>
          <span className="text-xs font-semibold text-emerald-400">Platform Live</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {PLATFORM_STATS.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} hoverEffect={false} className="space-y-2">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center`}>
                <Icon className="w-4 h-4" />
              </div>
              <p className="text-2xl font-extrabold font-display text-slate-900">{stat.value}</p>
              <p className="text-[11px] font-medium text-slate-500">{stat.label}</p>
              <p className="text-[11px] font-semibold text-emerald-600 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />{stat.trend}
              </p>
            </Card>
          )
        })}
      </div>

      {/* Tab Navigation */}
      <div className="flex gap-1 bg-surface-100 p-1.5 rounded-2xl border border-slate-200 w-full md:w-fit">
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeTab === tab.id
                  ? 'bg-white shadow-soft text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-slate-900'
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

      {/* TAB: Shop Verification */}
      {activeTab === 'shops' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">
            Pending Shop Verifications ({pendingShops.length})
          </h2>

          {pendingShops.length === 0 ? (
            <Card hoverEffect={false} className="p-10 text-center bg-emerald-50 border border-emerald-200">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
              <h3 className="font-bold text-emerald-800 font-display">All Shops Reviewed!</h3>
              <p className="text-xs text-emerald-700 mt-1">No pending shop applications to verify.</p>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingShops.map((shop) => (
                <Card key={shop.id} hoverEffect={false} className="space-y-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-bold text-base font-display text-slate-900 leading-tight">{shop.name}</h3>
                        <FloodBadge level={shop.floodZone} label={`Zone: ${shop.floodZone}`} />
                      </div>
                      <p className="text-xs font-semibold text-slate-600">Owner: {shop.owner}</p>
                    </div>
                    <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-1 rounded-lg shrink-0 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {shop.submittedAt}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 bg-surface-50 p-3 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" />
                      <span className="truncate">{shop.address}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shop.category}</span>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      className="flex-1"
                      isLoading={processingId === shop.id}
                      onClick={() => handleShopVerify(shop.id, false)}
                    >
                      Reject
                    </Button>
                    <Button
                      variant="safety"
                      size="sm"
                      icon={CheckCircle2}
                      className="flex-1"
                      isLoading={processingId === shop.id}
                      onClick={() => handleShopVerify(shop.id, true)}
                    >
                      Approve Shop
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </section>
      )}

      {/* TAB: Flood Reports */}
      {activeTab === 'floods' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">Community Flood Reports</h2>
          <div className="space-y-4">
            {floodReports.map((report) => (
              <Card key={report.id} hoverEffect={false} className="space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <ShieldAlert className={`w-5 h-5 ${report.severity === 'alert' ? 'text-rose-600' : 'text-amber-600'}`} />
                      <h3 className="font-bold text-base font-display text-slate-900">{report.areaName}</h3>
                    </div>
                    <p className="text-xs text-slate-500">Reported by: <strong className="text-slate-700">{report.reportedBy}</strong></p>
                    <p className="text-xs text-slate-500 mt-0.5">Water Depth: <strong className="text-slate-800">{report.waterDepthCm} cm</strong> · {report.reportedAt}</p>
                  </div>
                  <FloodBadge level={report.severity} />
                </div>

                {report.verifiedByAdmin ? (
                  <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl text-xs font-semibold text-emerald-800 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    {report.approved ? 'Report verified and published to safety map.' : 'Report dismissed as inaccurate.'}
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="danger"
                      size="sm"
                      icon={XCircle}
                      className="flex-1"
                      isLoading={processingId === report.id}
                      onClick={() => handleFloodVerify(report.id, false)}
                    >
                      Dismiss Report
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={ShieldAlert}
                      className="flex-1"
                      isLoading={processingId === report.id}
                      onClick={() => handleFloodVerify(report.id, true)}
                    >
                      Verify & Publish
                    </Button>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </section>
      )}

      {/* TAB: Platform Stats */}
      {activeTab === 'stats' && (
        <section className="space-y-4">
          <h2 className="text-lg font-bold font-display text-slate-900">Platform Analytics Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card hoverEffect={false} className="space-y-4">
              <h3 className="font-bold text-sm font-display text-slate-900">Shop Category Breakdown</h3>
              {[
                { label: 'Grocery / Kirana', count: 22, pct: 46 },
                { label: 'Pharmacy & Medical', count: 12, pct: 25 },
                { label: 'Hardware & Tools', count: 8, pct: 17 },
                { label: 'Electronics', count: 6, pct: 12 },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium text-slate-700">
                    <span>{item.label}</span>
                    <span className="font-bold">{item.count} shops ({item.pct}%)</span>
                  </div>
                  <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.pct}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className="h-full bg-gradient-to-r from-primary-500 to-safety-500 rounded-full"
                    />
                  </div>
                </div>
              ))}
            </Card>

            <Card hoverEffect={false} className="space-y-4">
              <h3 className="font-bold text-sm font-display text-slate-900">Flood Safety Zone Status</h3>
              {[
                { label: 'Safe Zones', value: '36 shops', color: 'bg-emerald-500', level: 'safe' },
                { label: 'Waterlogging Watch', value: '9 shops', color: 'bg-amber-500', level: 'watch' },
                { label: 'Severe Alert Zones', value: '3 shops', color: 'bg-rose-500', level: 'alert' },
              ].map((zone) => (
                <div key={zone.label} className="flex items-center justify-between p-3 rounded-xl bg-surface-50 border border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <span className={`w-3 h-3 rounded-full ${zone.color}`} />
                    <span className="text-xs font-semibold text-slate-700">{zone.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-900">{zone.value}</span>
                </div>
              ))}

              <div className="bg-safety-50 border border-safety-200 p-3 rounded-xl text-xs text-safety-900 font-medium">
                <ShieldCheck className="w-4 h-4 inline mr-1.5 text-safety-600" />
                Platform Flood Safety Score: <strong>99.4%</strong> accuracy verified.
              </div>
            </Card>
          </div>
        </section>
      )}
    </div>
  )
}
