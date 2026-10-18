import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { QrCode, Camera, CheckCircle2, ShieldAlert, RotateCcw, Terminal, Lock, ArrowLeft, Clock } from 'lucide-react'
import { productService } from '../../api/productService'
import { shopService } from '../../api/shopService'

export const BarcodeScanner = () => {
  const [manualCode, setManualCode] = useState('')
  const [result, setResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [soldItems, setSoldItems] = useState([])
  const [isApproved, setIsApproved] = useState(false)
  const [isLoadingStatus, setIsLoadingStatus] = useState(true)

  useEffect(() => {
    checkApprovalStatus()
  }, [])

  const checkApprovalStatus = async () => {
    try {
      const shops = await shopService.getMyShops()
      if (Array.isArray(shops) && shops.length > 0) {
        const approved = shops[0].verifiedStatus === 'APPROVED' || shops[0].verified === true
        setIsApproved(approved)
      } else {
        const localApproved = localStorage.getItem('nearbuy_vendor_approved') === 'true'
        setIsApproved(localApproved)
      }
    } catch (e) {
      console.warn('Failed to verify vendor approval status', e?.message)
      const localApproved = localStorage.getItem('nearbuy_vendor_approved') === 'true'
      setIsApproved(localApproved)
    } finally {
      setIsLoadingStatus(false)
    }
  }

  const handleLookup = async (code) => {
    if (!isApproved) return
    if (!code.trim()) return
    setIsScanning(true)
    await new Promise((r) => setTimeout(r, 500))
    const product = await productService.getProductByBarcode(code.trim())
    setResult(product ? { ...product, found: true } : { found: false, code })
    setIsScanning(false)
  }

  const handleSell = () => {
    if (!result?.found || !isApproved) return
    setSoldItems([{ ...result, soldAt: new Date().toLocaleTimeString() }, ...soldItems])
    setResult(null)
    setManualCode('')
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-white px-4 py-8 relative overflow-hidden">
      <div className="max-w-2xl mx-auto space-y-6 relative z-10">

        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-teal-500 to-emerald-500 text-white flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(13,148,136,0.5)]">
            <QrCode className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-extrabold font-display text-white">Camera Barcode Scanner</h1>
          <p className="text-xs font-mono text-slate-400">Scan or enter barcode to log a live checkout sale.</p>
        </div>

        {!isApproved && !isLoadingStatus && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl p-[1.5px] bg-gradient-to-r from-amber-500 to-rose-500 shadow-2xl"
          >
            <div className="bg-[#0e0c14] p-6 rounded-[22px] border border-amber-500/40 text-center space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase bg-amber-950 text-amber-300 border border-amber-500/40">
                  SCANNER RESTRICTED
                </span>
                <h2 className="text-xl font-bold font-display text-white">
                  Merchant Approval Required
                </h2>
                <p className="text-xs font-mono text-slate-300 max-w-md mx-auto pt-1 leading-relaxed">
                  Barcode checkout and selling are locked until your merchant profile is approved by Administrator{' '}
                  <strong className="text-amber-400">rautrutvi@gmail.com</strong>.
                </p>
              </div>
              <div className="pt-2">
                <Link
                  to="/vendor"
                  className="inline-flex items-center gap-2 py-2.5 px-5 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-mono font-bold text-white transition-all"
                >
                  <ArrowLeft className="w-4 h-4" /> Return to Vendor Dashboard
                </Link>
              </div>
            </div>
          </motion.div>
        )}

        {/* Viewfinder */}
        <div className="relative w-full h-56 bg-[#0c0c14] rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl border border-white/15">
          {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 left-4 -rotate-90', 'bottom-4 right-4 rotate-180'].map((pos, i) => (
            <div key={i} className={`absolute ${pos} w-8 h-8 border-l-4 border-t-4 ${isApproved ? 'border-teal-400' : 'border-amber-400/50'} rounded-tl-lg`} />
          ))}

          {/* Animated laser scan line */}
          {isApproved && (
            <motion.div
              animate={{ y: [-80, 80, -80] }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'linear' }}
              className="absolute w-3/4 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent opacity-90 shadow-[0_0_15px_#2dd4bf]"
            />
          )}

          <div className="text-center z-10 px-4">
            <Camera className={`w-10 h-10 ${isApproved ? 'text-slate-500 animate-pulse' : 'text-slate-600'} mx-auto mb-2`} />
            <p className="text-xs font-mono text-slate-400">
              {isApproved ? (
                <>
                  OPTICAL SENSOR ACTIVE<br />
                  <span className="text-teal-400 font-bold">Use manual entry below to simulate instant scan</span>
                </>
              ) : (
                <span className="text-amber-400/80">SENSOR OFFLINE · AWAITING ADMIN CLEARANCE</span>
              )}
            </p>
          </div>
        </div>

        {/* Manual Barcode Input */}
        <div className="p-6 rounded-2xl bg-[#0d0d16] border border-white/10 space-y-4">
          <h3 className="font-bold text-sm font-mono text-white flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" /> Manual Barcode Input
          </h3>
          <div className="flex gap-2">
            <input
              type="text"
              disabled={!isApproved}
              value={manualCode}
              onChange={(e) => setManualCode(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(manualCode)}
              placeholder={isApproved ? "e.g. 8901234500001" : "Locked (Pending Approval)"}
              className="flex-1 bg-slate-900 border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-teal-400 font-mono disabled:opacity-50"
            />
            <button
              disabled={!isApproved || isScanning}
              onClick={() => handleLookup(manualCode)}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(13,148,136,0.4)] disabled:opacity-50"
            >
              {isScanning ? 'Scanning...' : 'Lookup'}
            </button>
          </div>
          <p className="text-[10px] font-mono text-slate-500">
            Try test barcodes: <code className="text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">8901234500001</code> (Toor Dal) or <code className="text-amber-400 bg-slate-900 px-1.5 py-0.5 rounded">8901234500002</code> (Kolam Rice)
          </p>
        </div>

        {/* Scan Result */}
        {result && isApproved && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            {result.found ? (
              <div className="p-6 rounded-2xl bg-[#0d0d18] border border-emerald-500/50 space-y-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                <div className="flex items-center gap-4">
                  <img src={result.image} alt={result.name} className="w-16 h-16 rounded-xl object-cover border border-white/10" />
                  <div className="flex-1">
                    <p className="text-[10px] font-mono text-amber-400">BARCODE: {result.barcode}</p>
                    <h3 className="font-bold text-base font-display text-white">{result.name}</h3>
                    <p className="text-xs font-mono text-slate-400">₹{result.price} · {result.stockCount} units remaining</p>
                  </div>
                </div>
                <button
                  onClick={handleSell}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-mono text-xs font-bold uppercase shadow-[0_0_15px_rgba(13,148,136,0.4)] flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" /> Log Instant Counter Sale
                </button>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 font-mono text-xs flex items-center gap-2">
                <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Barcode "{result.code}" not found in current catalog.</span>
              </div>
            )}
          </motion.div>
        )}

        {/* Recent sales */}
        {soldItems.length > 0 && (
          <div className="space-y-3">
            <h4 className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider">
              Recent Counter Transactions ({soldItems.length})
            </h4>
            <div className="space-y-2">
              {soldItems.map((item, idx) => (
                <div key={idx} className="p-3.5 rounded-xl bg-[#0d0d16] border border-white/10 flex items-center justify-between text-xs font-mono">
                  <div className="flex items-center gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <div>
                      <p className="font-bold text-white">{item.name}</p>
                      <p className="text-[10px] text-slate-500">Barcode: {item.barcode}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-emerald-400">₹{item.price}</span>
                    <p className="text-[10px] text-slate-500">{item.soldAt}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}
