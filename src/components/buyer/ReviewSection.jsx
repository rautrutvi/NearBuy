import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Star, User, ThumbsUp, Send } from 'lucide-react'

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
                : 'text-slate-600'
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
    <div className="space-y-6 text-white">
      {/* Rating Summary */}
      <div className="flex items-center gap-6 p-6 bg-slate-900/80 rounded-2xl border border-white/10">
        <div className="text-center">
          <p className="text-5xl font-extrabold font-display text-white">{avgRating}</p>
          <div className="mt-1 flex justify-center">
            <StarRating value={Math.round(avgRating)} size="sm" />
          </div>
          <p className="text-xs font-mono text-slate-400 mt-1">{reviews.length} reviews</p>
        </div>
        <div className="flex-1 space-y-1.5">
          {[5, 4, 3, 2, 1].map((star) => {
            const count = reviews.filter((r) => r.rating === star).length
            const pct = Math.round((count / reviews.length) * 100)
            return (
              <div key={star} className="flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="w-3 text-right font-medium text-slate-300">{star}</span>
                <Star className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />
                <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
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
      <form onSubmit={handleSubmitReview} className="bg-slate-900/90 rounded-2xl border border-white/10 p-5 space-y-4">
        <h4 className="font-bold text-sm font-display text-white">Write a Verified Review</h4>
        <div className="flex items-center gap-3">
          <StarRating value={newRating} onChange={setNewRating} />
          <span className="text-xs font-mono text-amber-400">
            {newRating === 0 ? 'Tap stars to rate' : ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent'][newRating]}
          </span>
        </div>
        <textarea
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          placeholder="Share your experience — was the stock count accurate? Was pickup smooth?"
          rows={3}
          className="w-full bg-[#0a0a12] border border-white/15 rounded-xl px-4 py-3 text-xs font-mono text-white placeholder:text-slate-500 resize-none focus:outline-none focus:border-amber-400"
        />
        <div className="flex items-center justify-between">
          {submitted && (
            <span className="text-xs font-mono font-semibold text-emerald-400">✓ Review posted successfully!</span>
          )}
          <button
            type="submit"
            disabled={newRating === 0 || !newText.trim() || isSubmitting}
            className="ml-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-amber-500 text-white font-mono text-xs font-bold shadow-[0_0_15px_rgba(224,82,54,0.4)] disabled:opacity-50 hover:scale-105 transition-all flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Posting...' : 'Post Review'}</span>
          </button>
        </div>
      </form>

      {/* Reviews List */}
      <div className="space-y-3">
        {reviews.map((review) => (
          <motion.div
            key={review.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/60 rounded-2xl border border-white/10 p-4 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-primary-950 text-primary-400 border border-primary-500/30 flex items-center justify-center font-bold text-xs">
                  {review.author[0]}
                </div>
                <div>
                  <h5 className="font-bold text-xs text-white">{review.author}</h5>
                  <p className="text-[10px] font-mono text-slate-500">{review.date}</p>
                </div>
              </div>
              <StarRating value={review.rating} size="sm" />
            </div>
            <p className="text-xs text-slate-300 font-mono leading-relaxed pl-10">{review.text}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
