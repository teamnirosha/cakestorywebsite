import AdminLayout from "../../components/admin/AdminLayout";
import { eventService } from "../../services/data";
import CakeImage from "../../components/common/CakeImage";

export default function AdminEvents() {
  const events = eventService.list();
  return (
    <AdminLayout title="Events" subtitle="Browse all event packages offered by CakeStory.">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.map((e) => (
          <div key={e.id} className="glass rounded-3xl overflow-hidden">
            <CakeImage
              src={e.image}
              alt={e.title}
              aspect="16/9"
              fit="cover"
              className="w-full"
            />
            <div className="p-4">
              <div className={`inline-flex w-10 h-10 rounded-2xl bg-gradient-to-br ${e.color} items-center justify-center text-xl`}>{e.icon}</div>
              <h3 className="font-display text-lg text-[#2a1d2e] mt-2">{e.title}</h3>
              <p className="text-xs text-[#5a4a5e] mt-1 line-clamp-2">{e.description}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-[#5a4a5e]">{e.date}</span>
                <span className="text-sm font-semibold text-[#ff5c97]">{e.package}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
}
