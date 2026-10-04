import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { QrCode, Camera, CheckCircle2, ShieldAlert, RotateCcw } from 'lucide-react'
import { productService } from '../../api/productService'

export const BarcodeScanner = () => {
  const [manualCode, setManualCode] = useState('')
  const [result, setResult] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [soldItems, setSoldItems] = useState([])

  const handleLookup = async (code) => {
    if (!code.trim()) return
    setIsScanning(true)
    await new Promise((r) => setTimeout(r, 500))
    const product = await productService.getProductByBarcode(code.trim())
    setResult(product ? { ...product, found: true } : { found: false, code })
    setIsScanning(false)
  }

  const handleSell = () => {
    if (!result?.found) return
    setSoldItems([{ ...result, soldAt: new Date().toLocaleTimeString() }, ...soldItems])
    setResult(null)
    setManualCode('')
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-safety-500 to-safety-700 text-white flex items-center justify-center mx-auto shadow-safety">
          <QrCode className="w-8 h-8" />
        </div>
        <h1 className="text-2xl font-extrabold font-display text-slate-900">Barcode Scanner</h1>
        <p className="text-xs text-slate-500">Scan or type a product barcode to log a sale and update live stock.</p>
      </div>

      {/* Simulated Camera Viewfinder */}
      <motion.div
        className="relative w-full h-56 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl border border-slate-700"
      >
        {/* Corner brackets */}
        {['top-4 left-4', 'top-4 right-4 rotate-90', 'bottom-4 left-4 -rotate-90', 'bottom-4 right-4 rotate-180'].map((pos, i) => (
          <div key={i} className={`absolute ${pos} w-8 h-8 border-l-4 border-t-4 border-primary-400 rounded-tl-lg`} />
        ))}

        {/* Animated scan line */}
        <motion.div
          animate={{ y: [-80, 80, -80] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: 'linear' }}
          className="absolute w-3/4 h-0.5 bg-gradient-to-r from-transparent via-primary-400 to-transparent opacity-80"
        />

        <div className="text-center z-10">
          <Camera className="w-10 h-10 text-slate-500 mx-auto mb-2" />
          <p className="text-xs text-slate-400 font-medium">
            Camera scanning available in production build<br />
            <span className="text-primary-400 font-semibold">Use manual input below to simulate</span>
          </p>
        </div>
      </motion.div>

      {/* Manual Input */}
      <Card hoverEffect={false} className="space-y-4">
        <h3 className="font-bold text-sm font-display text-slate-900">Manual Barcode Entry</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLookup(manualCode)}
            placeholder="Type barcode (e.g. 8901234567890)"
            className="flex-1 rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-safety-200 focus:border-safety-500 placeholder:text-slate-400 font-mono"
          />
          <Button variant="safety" icon={QrCode} isLoading={isScanning} onClick={() => handleLookup(manualCode)}>
            Lookup
          </Button>
        </div>
        <p className="text-[11px] text-slate-400">
          Try: <code className="bg-slate-100 px-1.5 py-0.5 rounded">8901234567890</code> (Umbrella) &nbsp;
          <code className="bg-slate-100 px-1.5 py-0.5 rounded">8901234567891</code> (Rice) &nbsp;
          <code className="bg-slate-100 px-1.5 py-0.5 rounded">8901234567894</code> (Torch)
        </p>
      </Card>

      {/* Scan Result */}
      {result && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {result.found ? (
            <Card hoverEffect={false} className="space-y-4 border-2 border-emerald-300 bg-emerald-50">
              <div className="flex items-center gap-3">
                <img src={result.image} alt={result.name} className="w-16 h-16 rounded-xl object-cover shrink-0" />
                <div className="flex-1">
                  <p className="text-[10px] font-mono text-slate-400">{result.barcode}</p>
                  <h3 className="font-bold text-base font-display text-slate-900">{result.name}</h3>
                  <p className="text-xs text-slate-500">₹{result.price} · {result.stockCount} in stock</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" icon={RotateCcw} onClick={() => { setResult(null); setManualCode('') }} className="flex-1">
                  Rescan
                </Button>
                <Button variant="safety" size="sm" icon={CheckCircle2} onClick={handleSell} className="flex-1">
                  Confirm Sale — ₹{result.price}
                </Button>
              </div>
            </Card>
          ) : (
            <Card hoverEffect={false} className="border-2 border-rose-200 bg-rose-50 flex items-center gap-3 p-4">
              <ShieldAlert className="w-8 h-8 text-rose-500 shrink-0" />
              <div>
                <p className="font-bold text-rose-800">Barcode Not Found</p>
                <p className="text-xs text-rose-600">Code <code className="font-mono">{result.code}</code> is not in your product catalog.</p>
              </div>
            </Card>
          )}
        </motion.div>
      )}

      {/* Sales Log */}
      {soldItems.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-bold text-sm font-display text-slate-900">Today's Sales Log</h3>
          {soldItems.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between bg-white rounded-2xl border border-slate-100 p-3 shadow-soft"
            >
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{item.name}</p>
                  <p className="text-[10px] text-slate-400">{item.soldAt}</p>
                </div>
              </div>
              <span className="text-sm font-extrabold text-slate-900 font-display">₹{item.price}</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
