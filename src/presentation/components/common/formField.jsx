/* eslint-disable react/prop-types */
import React from 'react';
import { Input } from '../../../components/ui/input.tsx'
import { Label } from '../../../components/ui/label.tsx'
import { cn } from '../../../lib/utils.ts'

const FormField = ({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  error,
  required = false,
  className,
  ...props
}) => {
  return (
    <div className="space-y-2 w-full">
      <Label className="text-sm font-medium text-neutral-200">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          "h-12 bg-neutral-900 border-neutral-700 text-neutral-200",
          "placeholder:text-neutral-500",
          "focus:border-primary-500 focus:ring-1 focus:ring-primary-500/20",
          error && "border-red-500 focus:border-red-500",
          className
        )}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}
    </div>
  );
};

export default FormField;