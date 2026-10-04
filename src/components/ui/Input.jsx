import React from 'react'

export const Input = ({
  label,
  error,
  icon: Icon,
  rightIcon: RightIcon,
  onRightIconClick,
  type = 'text',
  className = '',
  id,
  placeholder,
  value,
  onChange,
  ...props
}) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

  return (
    <div className="w-full flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-500 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-slate-900/90 px-4 py-2.5 text-sm text-white font-mono transition-all placeholder:text-slate-500 focus:outline-none focus:ring-1 ${
            Icon ? 'pl-10' : ''
          } ${RightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-500 focus:ring-rose-500 focus:border-rose-500'
              : 'border-white/15 focus:ring-amber-400 focus:border-amber-400 shadow-inner'
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 text-slate-400 hover:text-white focus:outline-none"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs font-mono font-medium text-rose-400 mt-0.5">{error}</p>}
    </div>
  )
}
