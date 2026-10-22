import React from 'react'

// Skeleton block - just an animated gray rectangle
export const SkeletonBlock = ({ className = '' }) => (
  <div className={`animate-pulse bg-slate-200 rounded-xl ${className}`} />
)

// Skeleton card matching product card layout
export const SkeletonProductCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 space-y-3 shadow-soft">
    <SkeletonBlock className="h-44 w-full rounded-xl" />
    <SkeletonBlock className="h-3 w-20 rounded-full" />
    <SkeletonBlock className="h-5 w-3/4 rounded-full" />
    <SkeletonBlock className="h-3 w-1/2 rounded-full" />
    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
      <SkeletonBlock className="h-7 w-16 rounded-full" />
      <SkeletonBlock className="h-8 w-24 rounded-xl" />
    </div>
  </div>
)

// Skeleton shop card
export const SkeletonShopCard = () => (
  <div className="bg-white rounded-2xl border border-slate-100 p-4 flex gap-4 shadow-soft">
    <SkeletonBlock className="w-20 h-20 rounded-xl shrink-0" />
    <div className="flex-1 space-y-2 py-1">
      <SkeletonBlock className="h-4 w-3/4 rounded-full" />
      <SkeletonBlock className="h-3 w-1/2 rounded-full" />
      <SkeletonBlock className="h-3 w-2/3 rounded-full" />
    </div>
  </div>
)
