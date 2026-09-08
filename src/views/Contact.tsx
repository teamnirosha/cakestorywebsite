import { useState } from "react";
import PageShell from "../components/layout/PageShell";
import { useFranchiseModal } from "../components/common/FranchiseModal";
import { sendLeadToWebhook } from "../services/webhook";

export default function Contact() {
  const { openModal } = useFranchiseModal();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);

    // Dump lead/contact message to n8n webhook
    sendLeadToWebhook({
      fullName: formData.name,
      email: formData.email,
      mobile: "N/A",
      cityArea: "General Contact Form",
      subject: formData.subject,
      message: formData.message,
      source: "CakeStory Website — General Contact Form",
    });

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 3000);
  };

  return (
    <PageShell>
      <div className="pt-6 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-pink-100 text-[#ff5c97] text-xs font-bold uppercase tracking-wider mb-3">
              Corporate & Franchise Office
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-[#2a1d2e] mb-4">
              Get in Touch
            </h1>
            <p className="text-sm sm:text-base text-[#5a4a5e] leading-relaxed">
              Contact our central Pune corporate office for franchise partnership discussions, media inquiries, or corporate vendor alignments.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-start">
            {/* Corporate Information & Franchise Focus */}
            <div className="space-y-6">
              <div className="glass rounded-3xl p-6 sm:p-8 bg-white/80 border border-white shadow-sm">
                <h2 className="text-xl font-display font-bold text-[#2a1d2e] mb-6">
                  Pune Central Operations Hub
                </h2>
                <div className="space-y-5 text-xs sm:text-sm text-[#5a4a5e]">
                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-pink-50 border border-pink-100 flex items-center justify-center shrink-0 text-lg shadow-xs">
                      📍
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2a1d2e] mb-0.5">Corporate Headquarters</h4>
                      <p>
                        CakeStory Desserts Hub, Commercial Tower 3,<br />
                        Near Pancard Club Road, Baner, Pune, Maharashtra 411045
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center shrink-0 text-lg shadow-xs">
                      📞
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2a1d2e] mb-0.5">Franchise Desk</h4>
                      <p>+91 98230 45600 / +91 20 6789 0123</p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center shrink-0 text-lg shadow-xs">
                      ✉️
                    </div>
                    <div>
                      <h4 className="font-bold text-[#2a1d2e] mb-0.5">Official Communications</h4>
                      <p>franchise@cakestory.com • corporate@cakestory.com</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Franchise Action Box */}
              <div className="glass rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-pink-500/10 via-rose-300/15 to-amber-200/15 border border-white shadow-md text-center sm:text-left">
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-pink-500 text-white">
                  Priority Channel
                </span>
                <h3 className="text-xl font-display font-bold text-[#2a1d2e] mt-3 mb-2">
                  Interested in a Franchise Territory?
                </h3>
                <p className="text-xs text-[#5a4a5e] mb-5 leading-relaxed">
                  For franchise enquiries, please use our designated 4-field application for guaranteed direct 24-hour phone follow-up.
                </p>
                <button onClick={openModal} className="btn-primary w-full !py-3 font-bold shadow-md">
                  Start Your Franchise Journey →
                </button>
              </div>
            </div>

            {/* General Corporate Message Form */}
            <div className="glass rounded-3xl p-6 sm:p-10 bg-white/85 border border-white shadow-sm">
              <h2 className="text-xl font-display font-bold text-[#2a1d2e] mb-2">General Corporate Inquiry</h2>
              <p className="text-xs text-[#5a4a5e] mb-6">For administrative, vendor, or general brand communications.</p>

              {submitted ? (
                <div className="bg-emerald-50 text-emerald-800 p-8 rounded-2xl border border-emerald-200 text-center">
                  <div className="text-4xl mb-3">✅</div>
                  <h4 className="font-bold text-base mb-1">Message Received</h4>
                  <p className="text-xs">Thank you for reaching out. Our administrative team will respond shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                  <div>
                    <label className="block font-semibold text-[#2a1d2e] mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="input-field"
                      placeholder="e.g. Rajesh Sharma"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2a1d2e] mb-1">Official Email Address</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="input-field"
                      placeholder="rajesh@example.com"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2a1d2e] mb-1">Subject</label>
                    <input
                      type="text"
                      required
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      className="input-field"
                      placeholder="Corporate inquiry / Vendor inquiry"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-[#2a1d2e] mb-1">Message</label>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="input-field resize-none"
                      placeholder="Please write your inquiry here..."
                    />
                  </div>
                  <button type="submit" className="btn-primary w-full !py-3.5 text-xs sm:text-sm font-bold shadow-md">
                    Send Message
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
