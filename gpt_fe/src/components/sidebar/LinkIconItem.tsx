import type { ReactNode } from "react";

const LinkIconItem = (props: { children: ReactNode; href?: string; onClick: () => void }) => (
  // <div className="flex items-center justify-center ">
  //   <span className="h-full w-full rounded-lg border border-slate-10">
  <a
    href={props.href}
    className=" group grid h-10 w-10 cursor-pointer place-items-center rounded-xl border text-2xl text-shade-200-dark hover:bg-shade-200-light group-hover:scale-110"
    onClick={(e) => {
      e.preventDefault();
      props.onClick();
    }}
  >
    {props.children}
  </a>
  //   </span>
  // </div>
);

export default LinkIconItem;
