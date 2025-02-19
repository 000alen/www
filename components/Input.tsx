"use client";

import { ComponentProps } from "react";

interface InputProps extends ComponentProps<"input"> {
  loading?: boolean;
  action?: {
    label: string;
    onClick?: () => void;
  };
}

export function Input({ loading, action, className = "", ...props }: InputProps) {
  return (
    <div className="relative">
      <input
        {...props}
        disabled={loading || props.disabled}
        className={`w-full bg-[#111111] dark:bg-[#111111] border border-[#333333] text-[#909090] p-2 rounded-md text-xs focus:outline-none focus:border-[#555555] transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      />
      {action && (
        <button
          type="submit"
          onClick={action.onClick}
          disabled={loading}
          className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 rounded-md text-xs bg-[#222222] text-[#909090] hover:bg-[#333333] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <span className="inline-block animate-spin">⟳</span>
          ) : (
            action.label
          )}
        </button>
      )}
    </div>
  );
} 