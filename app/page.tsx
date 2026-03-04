import Link from "next/link";
import { listOpportunities } from "@/lib/data";

type SearchParams = {
  agency?: string;
  naics?: string;
  minValue?: string;
  maxDays?: string;
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    agency: searchParams.agency?.trim() || undefined,
    naics: searchParams.naics?.trim() || undefined,
    minValue: searchParams.minValue ? Number(searchParams.minValue) : undefined,
    maxDays: searchParams.maxDays ? Number(searchParams.maxDays) : undefined,
    limit: 10,
  };

  const { rows, error } = await listOpportunities(filters);

  return (
    <main style={{ maxWidth: 1000, margin: "0 auto", padding: "40px 20px" }}>
      <h1 style={{ marginBottom: 4 }}>GovCon Opportunity Finder</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>
        Recompete-first pipeline. Filter active opportunities and subscribe for alerts.
      </p>

      <form
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 10,
          margin: "20px 0",
        }}
      >
        <input name="agency" placeholder="Agency (e.g. Army)" defaultValue={filters.agency} />
        <input name="naics" placeholder="NAICS (e.g. 541511)" defaultValue={filters.naics} />
        <input name="minValue" placeholder="Min value" type="number" defaultValue={filters.minValue} />
        <input
          name="maxDays"
          placeholder="Max days to recompete"
          type="number"
          defaultValue={filters.maxDays}
        />
        <button type="submit">Apply Filters</button>
      </form>

      <div style={{ marginBottom: 20 }}>
        <Link href="/opportunities">Open full opportunities page →</Link>
      </div>

      {error ? (
        <p style={{ color: "#ff8a8a" }}>Supabase error: {error}</p>
      ) : (
        <>
          <p style={{ opacity: 0.8 }}>Showing {rows.length} results</p>
          <div style={{ display: "grid", gap: 12 }}>
            {rows.map((row) => (
              <article
                key={row.id}
                style={{ border: "1px solid #2b3350", borderRadius: 10, padding: 14, background: "#131a33" }}
              >
                <h3 style={{ margin: 0 }}>
                  <Link href={`/opportunities/${row.id}`}>{row.title}</Link>
                </h3>
                <p style={{ margin: "8px 0", opacity: 0.9 }}>
                  {row.agency || "Unknown agency"} • NAICS {row.naics || "—"} • Priority {row.priority_score ?? 0}
                </p>
                <p style={{ margin: "6px 0", fontSize: 14, opacity: 0.85 }}>
                  Days to recompete: <strong>{row.days_to_recompete ?? "—"}</strong>
                </p>
              </article>
            ))}
          </div>
        </>
      )}
    </main>
  );
}
