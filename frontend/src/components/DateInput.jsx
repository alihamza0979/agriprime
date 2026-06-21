import React from 'react';

export default function DateInput({
  label,
  name,
  value,
  onChange,
  required = false,
  min,
  max,
  className = '',
}) {
  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={name} className="block text-sm font-medium text-gray-600">
          {label}
        </label>
      )}
      <div className="relative">
        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg pointer-events-none">
          calendar_today
        </span>
        <input
          id={name}
          type="date"
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          min={min}
          max={max}
          className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        />
      </div>
    </div>
  );
}
