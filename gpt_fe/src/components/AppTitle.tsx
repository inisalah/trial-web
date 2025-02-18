import React from "react";

import BannerBadge from "./BannerBadge";
import Badge from "./Badge";

const AppTitle = () => {
  return (
    <div id="title" className="relative flex flex-col items-center font-mono">
      <div className="flex flex-row items-start">
        <span
          className="font-bold text-slate-12 xs:text-5xl sm:text-7xl md:text-6xl"
          style={{
            textShadow: "0px 5px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <span className="text-4xl font-bold text-[#C0C0C0] xs:text-5xl sm:text-6xl">Agent</span>
          <span className="text-4xl font-bold text-white xs:text-5xl sm:text-6xl">GPT</span>
        </span>
        <Badge className="translate-y-2 border-2 border-white/20 bg-gradient-to-t from-sky-500 to-sky-600">
          Beta 🚀
        </Badge>
      </div>
      <div className="mt-3 text-center font-mono text-[0.7em] font-bold text-white">
        <div>
          <BannerBadge
            className="md:hidden"
            onClick={() => {
              window.open("", "_blank");
            }}
          >
            Automate your business with Agents
          </BannerBadge>
        </div>
        <div
          className="hidden md:flex"
          onClick={() => {
            window.open("", "_blank");
          }}
        >
          <BannerBadge>Interested in automating businesses with AI Agents? Apply here</BannerBadge>
        </div>
      </div>
      <div className="fading-hr dark:fading-hr-dark my-2"></div>
    </div>
  );
};

export default AppTitle;
