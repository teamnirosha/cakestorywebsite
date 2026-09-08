import React from "react";
import { Link } from "react-router-dom";
import { useFranchiseModal } from "../common/FranchiseModal";

export default function StoryCTA() {
  const { openModal } = useFranchiseModal();

  return (
    <section className="reveal-story-section py-14 sm:py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="max-w-5xl mx-auto relative z-10">
        <div className="glass-dark rounded-[2.5rem] sm:rounded-[3rem] p-6 sm:p-14 text-center border border-white/30 shadow-2xl relative overflow-hidden text-white">
          {/* Background Real Asset Overlay with Gradient Readability Protection */}
          <div className="absolute inset-0 z-0 opacity-30 pointer-events-none">
            <img
              src="/images/franchise-hero.png"
              alt="CakeStory Desserts Franchise Store"
              className="w-full h-full object-cover scale-105"
              style={{ imageOrientation: "from-image" }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/85 via-purple-950/75 to-slate-950/90" />
          </div>

          <div className="relative z-20">
            <div className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-6 p-2.5 rounded-2xl glass-soft border border-white/40 shadow-lg flex items-center justify-center bg-white/20 backdrop-blur-md">
              <img
                src="/assets/logo/cs-logo.png"
                alt="CakeStory Desserts"
                className="max-h-full max-w-full object-contain filter drop-shadow-md"
              />
            </div>

            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-pink-500/30 text-pink-200 border border-pink-300/30 text-xs font-bold uppercase tracking-wider mb-4">
              <span>🚀 Territorial Franchise Opportunities Open</span>
            </div>

            <h2 className="font-display text-2.5xl sm:text-4xl lg:text-5xl text-white font-bold mb-4 break-words drop-shadow-sm">
              Be Part Of The Next Chapter
            </h2>

            <p className="text-sm sm:text-lg text-pink-100/95 max-w-2xl mx-auto mb-8 leading-relaxed font-light drop-shadow-xs">
              We are actively evaluating prospective partners for upcoming territorial openings across Pune. Join a bakery brand built on craft, process, and customer trust.
            </p>

            <div className="flex flex-wrap justify-center items-center gap-4">
              <button
                onClick={openModal}
                className="btn-primary glass-shine !py-3.5 sm:!py-4 !px-8 text-sm sm:text-base font-bold shadow-xl shadow-pink-500/50"
              >
                <span>EXPLORE FRANCHISE</span>
                <span>→</span>
              </button>
              <Link
                to="/contact"
                className="btn-ghost !py-3.5 sm:!py-4 !px-8 text-sm sm:text-base font-semibold bg-white/20 text-white border-white/40 hover:bg-white/35 backdrop-blur-md"
              >
                GET IN TOUCH
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
