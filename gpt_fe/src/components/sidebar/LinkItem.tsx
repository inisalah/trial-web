import clsx from "clsx";
import type { ReactNode } from "react";

const LinkItem = (props: {
  title: string;
  children: ReactNode;
  forceRefresh?: boolean;
  href?: string;
  onClick: () => void;
}) => (
  <li>
    <a
      href={props.href || ""}
      className={clsx(
        "group flex cursor-pointer gap-x-3 rounded-md px-2 py-1 text-sm leading-7 text-shade-200-dark hover:bg-shade-200-light ",
        !props.href && "cursor-not-allowed"
      )}
      onClick={(e) => {
        e.preventDefault();
        props.onClick();
      }}
    >
      <span className="flex h-[2em] w-[2em] shrink-0 items-center justify-center rounded-lg border text-sm font-medium text-shade-200-dark hover:bg-shade-200-light group-hover:scale-110">
        {props.children}
      </span>
      <span className="font-light">{props.title}</span>
    </a>
  </li>
);

export default LinkItem;
