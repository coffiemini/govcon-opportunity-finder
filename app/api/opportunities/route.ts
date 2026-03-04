import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
try {
const { searchParams } = new URL(request.url)
const limit = Math.min(Math.max(Number(searchParams.get('limit') ?? 20), 1), 100)
const agency = searchParams.get('agency')?.trim()
const naics = searchParams.get('naics')?.trim()
const q = searchParams.get('q')?.trim()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, serviceRoleKey)

let query = supabase
.from('opportunities')
.select('*')
.order('posted_date', { ascending: false, nullsFirst: false })
.limit(limit)

if (agency) query = query.ilike('agency', `%${agency}%`)
if (naics) query = query.eq('naics_code', naics)
if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`)

const { data, error } = await query
if (error) return NextResponse.json({ error: error.message }, { status: 500 })

return NextResponse.json({ opportunities: data ?? [] })
} catch (err: any) {
return NextResponse.json({ error: err?.message || 'Unknown error' }, { status: 500 })
}
}
