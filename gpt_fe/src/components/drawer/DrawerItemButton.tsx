import clsx from "clsx";
import React from "react";

interface DrawerItemProps {
  text: string;
  className?: string;
  onClick?: () => Promise<void> | void;
}

export const DrawerItemButton = (props: DrawerItemProps) => {
  const { text, onClick } = props;

  return (
    <button
      type="button"
      className={clsx(
        "cursor-pointer items-center text-shade-800-light hover:bg-shade-700-dark ",
        props.className
      )}
      onClick={onClick}
    >
      <span className="line-clamp-1 text-left text-sm font-light">{text}</span>
    </button>
  );
};

export const DrawerItemButtonLoader = () => {
  return <div className="w-50 mx-1.5 h-7 animate-pulse rounded-md bg-slate-6"></div>;
};
