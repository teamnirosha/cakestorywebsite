import { useState, useMemo } from "react";
import { enquiryService, franchiseService, FranchiseEnquiry } from "../../services/data";

interface LeadAnalyticsGraphProps {
  totalOutlets?: number;
  enquiries?: FranchiseEnquiry[];
  className?: string;
}

export default function LeadAnalyticsGraph({
  totalOutlets: propTotalOutlets,
  enquiries: propEnquiries,
  className = "",
}: LeadAnalyticsGraphProps) {
  const [timeframe, setTimeframe] = useState<"This Month" | "Last 30 Days" | "All Time">("This Month");
  const [hoveredPoint, setHoveredPoint] = useState<{
    label: string;
    count: number;
    cumulative: number;
    x: number;
    y: number;
  } | null>(null);

  // Dynamic data loading if not passed via props
  const allEnquiries = useMemo(() => {
    return propEnquiries || enquiryService.list();
  }, [propEnquiries]);

  const totalOutlets = useMemo(() => {
    return propTotalOutlets !== undefined ? propTotalOutlets : franchiseService.list().length;
  }, [propTotalOutlets]);

  // Filter enquiries dynamically by timeframe
  const filteredEnquiries = useMemo(() => {
    const now = Date.now();
    if (timeframe === "Last 30 Days") {
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      return allEnquiries.filter((e) => {
        const t = new Date(e.submittedAt).getTime();
        return !isNaN(t) && t >= thirtyDaysAgo;
      });
    }

    if (timeframe === "This Month") {
      const currentYear = new Date().getFullYear();
      const currentMonth = new Date().getMonth();
      const monthLeads = allEnquiries.filter((e) => {
        const d = new Date(e.submittedAt);
        return !isNaN(d.getTime()) && d.getFullYear() === currentYear && d.getMonth() === currentMonth;
      });
      // If early in the month or seed leads span the 30-day window, fall back to recent 30-day leads
      if (monthLeads.length > 0) return monthLeads;
      return allEnquiries;
    }

    // All Time
    return allEnquiries;
  }, [allEnquiries, timeframe]);

  // Status breakdown counts
  const statusCounts = useMemo(() => {
    return {
      new: filteredEnquiries.filter((e) => e.status === "new").length,
      contacted: filteredEnquiries.filter((e) => e.status === "contacted").length,
      qualified: filteredEnquiries.filter((e) => e.status === "qualified").length,
      closed: filteredEnquiries.filter((e) => e.status === "closed").length,
    };
  }, [filteredEnquiries]);

  // Dynamic distribution of leads into 5 time buckets
  const bucketData = useMemo(() => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // Bucket definitions (relative to now in days)
    // Week 1: 22 - 28 days ago
    // Week 2: 15 - 21 days ago
    // Week 3: 8 - 14 days ago
    // Week 4: 2 - 7 days ago
    // Live Today: 0 - 1 day ago
    let w1 = 0;
    let w2 = 0;
    let w3 = 0;
    let w4 = 0;
    let today = 0;

    filteredEnquiries.forEach((e) => {
      const t = new Date(e.submittedAt).getTime();
      if (isNaN(t)) {
        w1++;
        return;
      }
      const daysAgo = Math.max(0, Math.floor((now - t) / oneDay));
      if (daysAgo <= 1) {
        today++;
      } else if (daysAgo <= 7) {
        w4++;
      } else if (daysAgo <= 14) {
        w3++;
      } else if (daysAgo <= 21) {
        w2++;
      } else {
        w1++;
      }
    });

    // Cumulative sums for progression curve
    const c1 = w1;
    const c2 = c1 + w2;
    const c3 = c2 + w3;
    const c4 = c3 + w4;
    const c5 = c4 + today;

    return {
      counts: [w1, w2, w3, w4, today],
      cumulative: [c1, c2, c3, c4, c5],
      total: c5,
    };
  }, [filteredEnquiries]);

  // SVG dimensions and curve points calculation
  const { linePath, areaPath, points } = useMemo(() => {
    const { counts, cumulative, total } = bucketData;
    const maxVal = Math.max(total, 1);

    const getY = (val: number) => {
      if (total === 0) return 96;
      // Map 0 to 98 and maxVal to 20
      return 98 - (val / maxVal) * 78;
    };

    // 8 milestone nodes across the 1000-width canvas
    const rawPoints = [
      { x: 0, y: total === 0 ? 98 : getY(counts[0] * 0.4), label: "Start", count: 0, cumulative: 0 },
      { x: 150, y: getY(cumulative[0]), label: "Week 1", count: counts[0], cumulative: cumulative[0] },
      { x: 300, y: getY(cumulative[1]), label: "Week 2", count: counts[1], cumulative: cumulative[1] },
      { x: 450, y: getY((cumulative[1] + cumulative[2]) / 2), label: "Mid-Period", count: Math.round((counts[1] + counts[2]) / 2), cumulative: Math.round((cumulative[1] + cumulative[2]) / 2) },
      { x: 600, y: getY(cumulative[2]), label: "Week 3", count: counts[2], cumulative: cumulative[2] },
      { x: 750, y: getY(cumulative[3]), label: "Week 4", count: counts[3], cumulative: cumulative[3] },
      { x: 880, y: getY(cumulative[3] + counts[4] * 0.5), label: "Recent", count: Math.round(counts[4] * 0.5), cumulative: Math.round(cumulative[3] + counts[4] * 0.5) },
      { x: 1000, y: getY(cumulative[4]), label: "Live Today", count: counts[4], cumulative: cumulative[4] },
    ];

    // Spline curve generation (smooth Catmull-Rom to Cubic Bézier)
    let d = `M ${rawPoints[0].x},${rawPoints[0].y.toFixed(1)}`;
    for (let i = 0; i < rawPoints.length - 1; i++) {
      const p0 = i > 0 ? rawPoints[i - 1] : rawPoints[i];
      const p1 = rawPoints[i];
      const p2 = rawPoints[i + 1];
      const p3 = i < rawPoints.length - 2 ? rawPoints[i + 2] : p2;

      const cp1x = p1.x + (p2.x - p0.x) / 6;
      const cp1y = p1.y + (p2.y - p0.y) / 6;
      const cp2x = p2.x - (p3.x - p1.x) / 6;
      const cp2y = p2.y - (p3.y - p1.y) / 6;

      d += ` C ${cp1x.toFixed(1)},${cp1y.toFixed(1)} ${cp2x.toFixed(1)},${cp2y.toFixed(1)} ${p2.x.toFixed(1)},${p2.y.toFixed(1)}`;
    }

    const area = `${d} L 1000,120 L 0,120 Z`;

    return { linePath: d, areaPath: area, points: rawPoints };
  }, [bucketData]);

  return (
    <div className={`bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative ${className}`}>
      {/* ----------------- HEADER AREA ----------------- */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div>
          <div className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
            Total Network & Lead Pipeline
          </div>
          <div className="flex flex-wrap items-baseline gap-3 mt-1">
            <span className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
              {totalOutlets} Outlets • {bucketData.total} Leads
            </span>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
              <span>↗</span> 100% Operational
            </span>
          </div>

          {/* Quick status breakdown chips */}
          <div className="flex flex-wrap items-center gap-2 mt-2 text-xs">
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-100">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              New: {statusCounts.new}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-100">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Contacted: {statusCounts.contacted}
            </span>
            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-100">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Qualified: {statusCounts.qualified}
            </span>
            {statusCounts.closed > 0 && (
              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                Closed: {statusCounts.closed}
              </span>
            )}
          </div>
        </div>

        {/* Timeframe Selector Dropdown */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value as any)}
            className="text-xs font-semibold px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-700 cursor-pointer focus:outline-none focus:border-[#ff5c97] hover:bg-slate-100/70 transition shadow-xs"
          >
            <option value="This Month">This Month</option>
            <option value="Last 30 Days">Last 30 Days</option>
            <option value="All Time">All Time</option>
          </select>
        </div>
      </div>

      {/* ----------------- SMOOTH DYNAMIC SPLINE SVG GRAPH ----------------- */}
      <div className="pt-6 relative">
        {/* Floating Tooltip on Node Hover */}
        {hoveredPoint && (
          <div
            className="absolute z-20 pointer-events-none transform -translate-x-1/2 -translate-y-full mb-3 px-3 py-1.5 rounded-lg bg-slate-900 text-white text-[11px] font-medium shadow-xl border border-slate-800 flex flex-col items-center animate-fade-in"
            style={{
              left: `${(hoveredPoint.x / 1000) * 100}%`,
              top: `${(hoveredPoint.y / 120) * 100}%`,
            }}
          >
            <span className="font-bold text-[#ff5c97]">{hoveredPoint.label}</span>
            <span className="text-slate-200">
              +{hoveredPoint.count} leads (Cumulative: {hoveredPoint.cumulative})
            </span>
            <div className="w-2 h-2 bg-slate-900 transform rotate-45 -mb-1 mt-0.5" />
          </div>
        )}

        <div className="relative h-28 sm:h-36 w-full">
          <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 1000 120">
            <defs>
              <linearGradient id="leadAnalyticsGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ff5c97" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#ff5c97" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Reference Grid Lines */}
            <line x1="0" y1="20" x2="1000" y2="20" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="60" x2="1000" y2="60" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />
            <line x1="0" y1="100" x2="1000" y2="100" stroke="#f1f5f9" strokeDasharray="4 4" strokeWidth="1" />

            {/* Shaded Area Fill */}
            <path d={areaPath} fill="url(#leadAnalyticsGradient)" />

            {/* Pink Smooth Spline Stroke Line */}
            <path
              d={linePath}
              fill="none"
              stroke="#ff5c97"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Interactive Circular Nodes */}
            {points.map((pt, i) => (
              <g key={i}>
                {/* Invisible larger hover target */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="14"
                  fill="transparent"
                  className="cursor-pointer"
                  onMouseEnter={() =>
                    setHoveredPoint({
                      label: pt.label,
                      count: pt.count,
                      cumulative: pt.cumulative,
                      x: pt.x,
                      y: pt.y,
                    })
                  }
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Visible Data Node Circle */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="4.5"
                  fill="#ffffff"
                  stroke="#ff5c97"
                  strokeWidth="2.5"
                  className="transition duration-150 pointer-events-none"
                  style={{
                    filter:
                      hoveredPoint?.x === pt.x
                        ? "drop-shadow(0 0 6px rgba(255, 92, 151, 0.8))"
                        : undefined,
                  }}
                />
              </g>
            ))}
          </svg>
        </div>

        {/* ----------------- TIMELINE LABELS (MATCHING SCREENSHOT) ----------------- */}
        <div className="flex justify-between text-[10px] font-semibold text-slate-400 mt-3 px-1 uppercase tracking-wider">
          <span>Week 1</span>
          <span>Week 2</span>
          <span>Week 3</span>
          <span>Week 4</span>
          <span>Live Today</span>
        </div>
      </div>
    </div>
  );
}
