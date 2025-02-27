import React from 'react';


const TextArea = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  required = false,
  rows = 4
}) => {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <textarea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={rows}
        className={`
          w-full bg-gray-800 border rounded px-4 py-2 text-white
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-700'}
          resize-none
        `}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1">{error}</p>
      )}
    </div>
  );
};

export default TextArea;