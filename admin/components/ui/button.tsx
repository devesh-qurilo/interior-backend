import * as React from "react";

export function Button({
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={
        "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium " +
        "bg-amber-700 text-white hover:bg-amber-800 disabled:opacity-50 " +
        className
      }
      {...props}
    />
  );
}
