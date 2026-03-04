import { supabase } from "@/lib/supabase";

export type OpportunityRow = {
  id: string;
  title: string;
  agency: string | null;
  naics: string | null;
  priority_score: number | null;
  days_to_recompete: number | null;
  estimated_value: number | null;
};

export async function listOpportunities(filters: {
  agency?: string;
  naics?: string;
  minValue?: number;
  maxDays?: number;
  limit?: number;
}) {
  if (!supabase) return { rows: [] as OpportunityRow[], error: "Missing Supabase env vars" };

  let query = supabase
    .from("opportunities")
    .select("id,title,agency,naics,priority_score,days_to_recompete,estimated_value")
    .eq("status", "active")
    .order("priority_score", { ascending: false })
    .limit(filters.limit ?? 25);

  if (filters.agency) query = query.ilike("agency", `%${filters.agency}%`);
  if (filters.naics) query = query.eq("naics", filters.naics);
  if (typeof filters.minValue === "number" && !Number.isNaN(filters.minValue)) {
    query = query.gte("estimated_value", filters.minValue);
  }
  if (typeof filters.maxDays === "number" && !Number.isNaN(filters.maxDays)) {
    query = query.lte("days_to_recompete", filters.maxDays);
  }

  const { data, error } = await query;
  return { rows: (data ?? []) as OpportunityRow[], error: error?.message ?? null };
}

export async function getOpportunityById(id: string) {
  if (!supabase) return { row: null, error: "Missing Supabase env vars" };

  const { data, error } = await supabase
    .from("opportunities")
    .select("*")
    .eq("id", id)
    .single();

  return { row: data, error: error?.message ?? null };
}
