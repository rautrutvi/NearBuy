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
        <label htmlFor={inputId} className="text-xs font-semibold uppercase tracking-wider text-slate-600">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-slate-800 transition-all placeholder:text-slate-400 focus:outline-none focus:ring-2 ${
            Icon ? 'pl-10' : ''
          } ${RightIcon ? 'pr-10' : ''} ${
            error
              ? 'border-rose-400 focus:ring-rose-200 focus:border-rose-500'
              : 'border-slate-200 focus:ring-primary-200 focus:border-primary-500'
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <button
            type="button"
            onClick={onRightIconClick}
            className="absolute right-3.5 text-slate-400 hover:text-slate-600 focus:outline-none"
          >
            <RightIcon className="w-4 h-4" />
          </button>
        )}
      </div>
      {error && <p className="text-xs font-medium text-rose-500 mt-0.5">{error}</p>}
    </div>
  )
}
