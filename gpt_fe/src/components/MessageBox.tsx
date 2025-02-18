import clsx from "clsx";
import React from "react";

interface MessageBoxProps {
  className?: string;
  children: React.ReactNode;
}

const MessageBox = ({ className, children }: MessageBoxProps) => {
  return (
    <div className="transform-none opacity-100">
      <div
        className={clsx(
          "mx-2 my-1 rounded-lg border border-white/10 bg-white/20 p-2 font-mono text-xs hover:border-white/40 sm:mx-4 sm:my-1.5 sm:p-3 sm:text-sm",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
};

export default MessageBox;
