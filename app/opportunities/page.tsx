import Link from "next/link";
import { listOpportunities } from "@/lib/data";

type SearchParams = {
  agency?: string;
  naics?: string;
  minValue?: string;
  maxDays?: string;
};

export default async function OpportunitiesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const filters = {
    agency: searchParams.agency?.trim() || undefined,
    naics: searchParams.naics?.trim() || undefined,
    minValue: searchParams.minValue ? Number(searchParams.minValue) : undefined,
    maxDays: searchParams.maxDays ? Number(searchParams.maxDays) : undefined,
    limit: 50,
  };

  const { rows, error } = await listOpportunities(filters);

  return (
    <main style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 20px" }}>
      <p style={{ marginTop: 0 }}>
        <Link href="/">← Back home</Link>
      </p>
      <h1 style={{ marginBottom: 8 }}>Opportunities</h1>

      <form
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
          gap: 10,
          marginBottom: 20,
        }}
      >
        <input name="agency" placeholder="Agency" defaultValue={filters.agency} />
        <input name="naics" placeholder="NAICS" defaultValue={filters.naics} />
        <input name="minValue" type="number" placeholder="Min value" defaultValue={filters.minValue} />
        <input name="maxDays" type="number" placeholder="Max days to recompete" defaultValue={filters.maxDays} />
        <button type="submit">Filter</button>
      </form>

      {error ? (
        <p style={{ color: "#ff8a8a" }}>Error: {error}</p>
      ) : rows.length === 0 ? (
        <p>No opportunities matched these filters.</p>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          {rows.map((row) => (
            <article
              key={row.id}
              style={{ border: "1px solid #2b3350", borderRadius: 10, padding: 14, background: "#131a33" }}
            >
              <h3 style={{ margin: 0 }}>
                <Link href={`/opportunities/${row.id}`}>{row.title}</Link>
              </h3>
              <p style={{ margin: "8px 0", opacity: 0.9 }}>
                {row.agency || "Unknown agency"} • NAICS {row.naics || "—"}
              </p>
              <p style={{ margin: 0, fontSize: 14, opacity: 0.85 }}>
                Priority: {row.priority_score ?? 0} • Days to recompete: {row.days_to_recompete ?? "—"}
              </p>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
