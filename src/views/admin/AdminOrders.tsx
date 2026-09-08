import AdminLayout from "../../components/admin/AdminLayout";
import { orderService } from "../../services/data";

export default function AdminOrders() {
  const orders = orderService.list();
  const colorMap: Record<string, string> = {
    delivered: "bg-emerald-100 text-emerald-700",
    "in-transit": "bg-blue-100 text-blue-700",
    preparing: "bg-amber-100 text-amber-700",
    cancelled: "bg-rose-100 text-rose-600",
  };
  return (
    <AdminLayout title="Orders" subtitle="Track and manage all customer orders.">
      <div className="glass rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/40 text-left text-[10px] uppercase tracking-wider text-[#5a4a5e]">
                <th className="px-4 py-3">Order ID</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Outlet</th>
                <th className="px-4 py-3">Items</th>
                <th className="px-4 py-3">Total</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-white/30 hover:bg-white/30">
                  <td className="px-4 py-3 font-mono text-xs text-[#5a4a5e]">{o.id}</td>
                  <td className="px-4 py-3 font-semibold text-[#2a1d2e]">{o.customer}</td>
                  <td className="px-4 py-3 text-[#5a4a5e]">{o.outlet}</td>
                  <td className="px-4 py-3 text-[#5a4a5e]">{o.items}</td>
                  <td className="px-4 py-3 text-[#ff5c97] font-semibold">${o.total.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${colorMap[o.status] || "bg-gray-100"}`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[#5a4a5e] text-xs">{o.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}
