import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, User, ThumbsUp, Send } from 'lucide-react'
import { Button } from '../ui/Button'

const MOCK_REVIEWS = [
  { id: 1, author: 'Priya M.', rating: 5, text: 'Stock is always updated! Reserved rice yesterday and it was ready in 10 minutes. Very reliable.', date: '2 days ago', helpful: 12 },
  { id: 2, author: 'Rohan K.', rating: 4, text: 'Great local shop. Flood map warning helped me know the road was safe before heading out during the rains.', date: '5 days ago', helpful: 8 },
  { id: 3, author: 'Sneha D.', rating: 5, text: 'Umbrellas were in stock when every other place was sold out! This app saved the monsoon season.', date: '1 week ago', helpful: 21 },
]

const StarRating = ({ value, onChange, size = 'md' }) => {
  const [hover, setHover] = useState(null)
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-6 h-6'

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange && onChange(star)}
          onMouseEnter={() => onChange && setHover(star)}
          onMouseLeave={() => onChange && setHover(null)}
          className={`transition-colors ${onChange ? 'cursor-pointer' : 'cursor-default'}`}
        >
          <Star
            className={`${sizeClass} ${
              star <= (hover ?? value)
                ? 'text-amber-400 fill-amber-400'
                : 'text-slate-300'
            } transition-colors`}
          />
        </button>
      ))}
    </div>
  )
}

export const ReviewSection = ({ shopId }) => {
  const [reviews, setReviews] = useState(MOCK_REVIEWS)
  const [newRating, setNewRating] = useState(0)
  const [newText, setNewText] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)

  const handleSubmitReview = async (e) => {
    e.preventDefault()
    if (newRating === 0 || !newText.trim()) return
    setIsSubmitting(true)
    await new Promise((r) => setTimeout(r, 700))
    setReviews([
      {
        id: Date.now(),
        author: 'You',
        rating: newRating,
        text: newText,
        date: 'Just now',
        helpful: 0,
      },
      ...reviews,
    ])
    setNewText('')
    setNewRating(0)
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="flex items-center gap-4 p-5 bg-surface-50 rounded-2xl border border-slate-100">
        <div className="text-center">
          <p className="text-5xl font-extrabold font-display text-slate-900">{avgRating}</p>
          <StarRating value={Math.round(avgRating)} size="sm" />
          <p className="text-xs text-slate-500 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const pct = Math.round((count / reviews.length) * 100)
            return (
              <div key={star} className="flex items-center gap-2 text-xs text-slate-600">
                <span className="w-3 text-right font-medium">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="h-full bg-amber-400 rounded-full"
                  />
                </div>
                <span className="w-6 text-slate-500">{count}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* Write a Review */}
      <form onSubmit={handleSubmitReview} className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3">
        <h4 className="font-bold text-sm font-display text-slate-900">Write a Review</h4>
        <div className="flex items-center gap-3">
          <StarRating value={newRating} onChange={setNewRating} />
          <span className="text-xs text-slate-500">{newRating === 0 ? 'Tap to rate' : ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][newRating]}</span>
        </div>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Share your experience — was the stock accurate? Was pickup smooth?"
          rows={3}
          className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-500 placeholder:text-slate-400"
        />
        <div className="flex items-center justify-between">
          {submitted && (
            <span className="text-xs font-semibold text-emerald-700">✓ Review posted! Thank you.</span>
          )}
          <Button type="submit" variant="primary" size="sm" icon={Send} isLoading={isSubmitting}
            disabled={newRating === 0 || !newText.trim()} className="ml-auto">
            Post Review
          </Button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl border border-slate-100 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-900">{review.author}</p>
                  <p className="text-[10px] text-slate-400">{review.date}</p>
                </div>
              </div>
              <StarRating value={review.rating} size="sm" />
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">{review.text}</p>
            <button className="text-[10px] text-slate-400 hover:text-slate-600 flex items-center gap-1 font-medium">
              <ThumbsUp className="w-3 h-3" /> Helpful ({review.helpful})
            </button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
