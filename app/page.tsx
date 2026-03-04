import { supabase } from "@/lib/supabase";

async function getOpportunityCount() {
if (!supabase) return { count: null, error: "Missing Supabase env vars" };
const { count, error } = await supabase.from("opportunities").select("id", { count: "exact", head: true });
return { count: count ?? 0, error: error?.message ?? null };
}

export default async function HomePage() {
const { count, error } = await getOpportunityCount();

return (
<main style={{ maxWidth: 960, margin: "0 auto", padding: "64px 24px" }}>
<h1>GovCon Opportunity Finder</h1>
{error ? (
<p style={{ color: "#ff8a8a" }}>{error}</p>
) : (
<p style={{ color: "#8ff0a4" }}>Connected. Opportunities: {count}</p>
)}
</main>
);
}
