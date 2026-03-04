import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
const SAM_SEARCH_URL = 'https://api.sam.gov/prod/opportunities/v2/search'
function toSamDate(d: Date) {
const mm = String(d.getMonth() + 1).padStart(2, '0')
const dd = String(d.getDate()).padStart(2, '0')
const yyyy = d.getFullYear()
return `${mm}/${dd}/${yyyy}`
}
function asDate(value: any): string | null {
if (!value) return null
const d = new Date(value)
if (Number.isNaN(d.getTime())) return null
return d.toISOString()
}

function pick(...values: any[]): string | null {
for (const v of values) {
if (typeof v === 'string' && v.trim()) return v.trim()
}
return null
}
function mapSamNoticeToOpportunity(notice: Record<string, any>) {
return {
notice_id: pick(notice.noticeId, notice.solicitationNumber, notice.id) ?? crypto.randomUUID(),
title: pick(notice.title, notice.solicitationTitle, notice.description) ?? 'Untitled Opportunity',
description: pick(notice.description, notice.fullParentPathName),
agency: pick(notice.department, notice.fullParentPathName, notice.organizationType),
office: pick(notice.office, notice.subTier, notice.organizationName),
naics_code: pick(notice.naicsCode, notice.naics),
set_aside: pick(notice.typeOfSetAsideDescription, notice.typeOfSetAside),
response_deadline: asDate(notice.responseDeadLine),
posted_date: asDate(notice.postedDate),
award_amount: notice?.award?.amount ?? null,
place_of_performance: pick(notice.placeOfPerformance, notice.popAddress),
contact_name: pick(notice.pointOfContact, notice.contactName),
contact_email: pick(notice.contactEmail),
url: pick(notice.uiLink, notice.link),
opportunity_type: pick(notice.type, notice.noticeType),
status: 'active',
indexed_at: new Date().toISOString()
}
}

export async function POST(request: Request) {
try {
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const apiKey = process.env.SAM_GOV_API_KEY

if (!apiKey) {
return NextResponse.json({ error: 'SAM_GOV_API_KEY is missing' }, { status: 500 })
}

const body = await request.json().catch(() => ({}))
const daysBack = Math.min(Math.max(Number(body?.daysBack ?? 30), 1), 365)
const limit = Math.min(Math.max(Number(body?.limit ?? 100), 1), 1000)

const postedToDate = new Date()
const postedFromDate = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000)

const params = new URLSearchParams({
api_key: apiKey,
limit: String(limit),
offset: '0',
postedFrom: toSamDate(postedFromDate),
postedTo: toSamDate(postedToDate)
})

const samRes = await fetch(`${SAM_SEARCH_URL}?${params.toString()}`, {
method: 'GET',
headers: { Accept: 'application/json' },
cache: 'no-store'
})

if (!samRes.ok) {
const text = await samRes.text()
return NextResponse.json({ error: `SAM API ${samRes.status}: ${text.slice(0, 300)}` }, { status: 500 })
}

const samJson = await samRes.json()
const notices = (samJson?.opportunitiesData ?? samJson?.data ?? []) as Record<string, any>[]
const rows = notices.map(mapSamNoticeToOpportunity)

const supabase = createClient(supabaseUrl, serviceRoleKey)
const { error } = await supabase
.from('opportunities')
.upsert(rows, { onConflict: 'notice_id', ignoreDuplicates: false })

if (error) return NextResponse.json({ error: error.message }, { status: 500 })

return NextResponse.json({ ok: true, fetched: notices.length, upserted: rows.length })
} catch (err: any) {
return NextResponse.json({ error: err?.message ?? 'Unknown error' }, { status: 500 })
}
}
