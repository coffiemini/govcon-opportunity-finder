import Link from "next/link";
import { getOpportunityById } from "@/lib/data";

type Params = { id: string };

export default async function OpportunityDetailPage({ params }: { params: Params }) {
  const { row, error } = await getOpportunityById(params.id);

  if (error) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <p>
          <Link href="/opportunities">← Back to opportunities</Link>
        </p>
        <h1>Opportunity</h1>
        <p style={{ color: "#ff8a8a" }}>Error: {error}</p>
      </main>
    );
  }

  if (!row) {
    return (
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
        <p>
          <Link href="/opportunities">← Back to opportunities</Link>
        </p>
        <h1>Not found</h1>
      </main>
    );
  }

  return (
    <main style={{ maxWidth: 900, margin: "0 auto", padding: "32px 20px" }}>
      <p>
        <Link href="/opportunities">← Back to opportunities</Link>
      </p>

      <h1 style={{ marginBottom: 8 }}>{row.title}</h1>
      <p style={{ marginTop: 0, opacity: 0.85 }}>{row.agency || "Unknown agency"}</p>

      <section style={{ border: "1px solid #2b3350", borderRadius: 10, padding: 16, background: "#131a33" }}>
        <p><strong>NAICS:</strong> {row.naics || "—"}</p>
        <p><strong>PSC:</strong> {row.psc || "—"}</p>
        <p><strong>Estimated value:</strong> {row.estimated_value ?? "—"}</p>
        <p><strong>Incumbent:</strong> {row.incumbent_name || "—"}</p>
        <p><strong>Priority score:</strong> {row.priority_score ?? 0}</p>
        <p><strong>Days to recompete:</strong> {row.days_to_recompete ?? "—"}</p>
        <p><strong>Estimated recompete date:</strong> {row.estimated_recompete_date || "—"}</p>
        <p><strong>Status:</strong> {row.status || "—"}</p>
        <p><strong>Source:</strong> {row.source_name || "—"}</p>
      </section>
    </main>
  );
}
