import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import { faqService } from "../services/data";
import { useFranchiseModal } from "../components/common/FranchiseModal";

export default function FAQ() {
  const faqs = faqService.list();
  const rawCategories = faqService.categories();
  const categories = ["All Questions", ...rawCategories];
  const [activeCategory, setActiveCategory] = useState("All Questions");
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);
  const { openModal } = useFranchiseModal();

  const filteredFaqs =
    activeCategory === "All Questions" ? faqs : faqs.filter((f) => f.category === activeCategory);

  return (
    <PageShell>
      <div className="pt-6 pb-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
              Franchise & Quality FAQ
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2a1d2e] mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-sm sm:text-base text-[#5a4a5e] max-w-2xl mx-auto leading-relaxed">
              Clear answers regarding CakeStory Desserts' Pune expansion, franchise support, onboarding steps, and central kitchen hygiene discipline.
            </p>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap justify-center gap-2.5 mb-10">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
                  activeCategory === cat
                    ? "bg-[#2a1d2e] text-white shadow-md scale-105"
                    : "bg-white/70 text-[#5a4a5e] hover:bg-white/95 border border-white/80"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* FAQ Accordion */}
          <div className="space-y-3.5">
            {filteredFaqs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="glass rounded-3xl overflow-hidden transition-all duration-200 bg-white/85 border border-white shadow-xs hover:shadow-md"
                >
                  <button
                    className="w-full px-6 py-5 text-left flex justify-between items-center focus:outline-none gap-4"
                    onClick={() => setOpenId(isOpen ? null : faq.id)}
                  >
                    <div>
                      <span className="text-[10px] font-bold text-[#ff5c97] uppercase tracking-wider block mb-1">
                        {faq.category}
                      </span>
                      <span className="font-display font-bold text-[#2a1d2e] text-base sm:text-lg">
                        {faq.question}
                      </span>
                    </div>
                    <span
                      className={`text-[#ff5c97] text-2xl font-bold transition-transform duration-200 flex-shrink-0 ${
                        isOpen ? "rotate-45" : ""
                      }`}
                    >
                      +
                    </span>
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ease-in-out ${
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    }`}
                  >
                    <div className="px-6 pb-6 text-xs sm:text-sm text-[#5a4a5e] leading-relaxed border-t border-slate-100 pt-4">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Direct CTA */}
          <div className="mt-16 text-center glass rounded-[2.5rem] p-8 sm:p-12 bg-gradient-to-br from-pink-500/10 via-rose-300/15 to-amber-200/15 border border-white shadow-lg">
            <h3 className="text-2xl font-display font-bold text-[#2a1d2e] mb-2">
              Have a Specific Location in Mind?
            </h3>
            <p className="text-xs sm:text-sm text-[#5a4a5e] max-w-lg mx-auto mb-6">
              Our Pune territory mapping team will evaluate your proposed area and provide a preliminary viability assessment.
            </p>
            <button onClick={openModal} className="btn-primary !py-3 !px-7 font-bold shadow-md">
              Submit Franchise Enquiry →
            </button>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
