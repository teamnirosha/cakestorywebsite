import { Link } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { eventService } from "../services/data";
import CakeImage from "../components/common/CakeImage";

export default function Events() {
  const events = eventService.list();
  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-purple-100 to-pink-100 text-[#ff5c97] text-xs font-semibold mb-3">
              🎈 CELEBRATIONS
            </div>
            <h1 className="font-display text-4xl md:text-6xl text-[#2a1d2e] mb-3">Events We Bake For</h1>
            <p className="text-[#5a4a5e]">From intimate gatherings to grand weddings — we make every event sweeter.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {events.map((e) => (
              <Link key={e.id} to={`/events/${e.id}`} className="glass rounded-3xl overflow-hidden hover:shadow-xl transition group">
                <CakeImage
                  src={e.image}
                  alt={e.title}
                  aspect="4/3"
                  fit="cover"
                  hoverZoom
                  className="w-full rounded-t-3xl"
                />
                <div className="p-5">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${e.color} flex items-center justify-center text-2xl mb-3`}>{e.icon}</div>
                  <h3 className="font-display text-xl text-[#2a1d2e]">{e.title}</h3>
                  <p className="text-sm text-[#5a4a5e] mt-1.5 leading-relaxed">{e.description}</p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-[#5a4a5e]">📅 {e.date}</span>
                    <span className="text-sm font-semibold text-[#ff5c97]">{e.package}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </PageShell>
  );
}
