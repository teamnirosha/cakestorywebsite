import { Link, useParams } from "react-router-dom";
import PageShell from "../components/layout/PageShell";
import { eventService } from "../services/data";
import CakeImage from "../components/common/CakeImage";

export default function EventDetail() {
  const { id } = useParams();
  const event = id ? eventService.get(id) : undefined;
  if (!event) {
    return (
      <PageShell>
        <div className="max-w-md mx-auto glass rounded-3xl p-10 text-center">
          <div className="text-5xl mb-3">🎈</div>
          <h2 className="font-display text-2xl text-[#2a1d2e] mb-2">Event not found</h2>
          <Link to="/events" className="btn-primary mt-4">All Events</Link>
        </div>
      </PageShell>
    );
  }
  return (
    <PageShell>
      <section className="px-6">
        <div className="max-w-5xl mx-auto">
          <Link to="/events" className="text-sm text-[#5a4a5e] hover:text-[#ff5c97] mb-6 inline-block">← Back to events</Link>
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <CakeImage
              src={event.image}
              alt={event.title}
              aspect="4/3"
              fit="cover"
              priority={true}
              className="w-full rounded-[2rem] shadow-lg border border-white max-h-[420px]"
            />
            <div>
              <div className={`inline-flex w-16 h-16 rounded-2xl bg-gradient-to-br ${event.color} items-center justify-center text-3xl mb-4`}>{event.icon}</div>
              <h1 className="font-display text-4xl md:text-5xl text-[#2a1d2e]">{event.title}</h1>
              <p className="text-[#5a4a5e] mt-4 leading-relaxed">{event.description}</p>
              <div className="grid grid-cols-2 gap-3 mt-6">
                <div className="glass-soft rounded-2xl p-3">
                  <div className="text-[10px] uppercase text-[#5a4a5e]">Availability</div>
                  <div className="text-sm font-semibold mt-1">{event.date}</div>
                </div>
                <div className="glass-soft rounded-2xl p-3">
                  <div className="text-[10px] uppercase text-[#5a4a5e]">Starting From</div>
                  <div className="text-sm font-semibold text-[#ff5c97] mt-1">{event.package}</div>
                </div>
              </div>
              <ul className="mt-6 space-y-2 text-sm">
                {["Custom theme design", "On-site delivery available", "Dedicated event manager", "Tasting session included"].map((t) => (
                  <li key={t} className="flex items-center gap-2"><span className="text-emerald-500">✓</span> {t}</li>
                ))}
              </ul>
              <div className="mt-6 flex gap-3">
                <Link to="/outlets" className="btn-ghost">Find Nearest Outlet</Link>
                <Link to="/custom-cake" className="btn-primary">Plan Now →</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}
