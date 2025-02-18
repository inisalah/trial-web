import React from "react";

export const ExampleAgentButton = ({
  name,
  children,
  setAgentRun,
}: {
  name: string;
  children: string;
  setAgentRun?: (name: string, goal: string) => void;
}) => {
  const handleClick = () => {
    if (setAgentRun) {
      setAgentRun(name, children);
    }
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg border border-white/20 bg-gradient-to-t from-sky-500 to-sky-600 p-2 font-mono text-sm transition-all hover:bg-gradient-to-t hover:from-sky-400 hover:to-sky-600 sm:text-base"
      onClick={handleClick}
    >
      <p className="text-lg font-black">{name}</p>
      <p className="mt-2 text-sm">{children}</p>
    </div>
  );
};
