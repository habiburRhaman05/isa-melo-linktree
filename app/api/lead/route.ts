import { NextResponse } from 'next/server'

const GO_HIGH_LEVEL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/iGbC817rCzAfj7HtPYRs/webhook-trigger/acb94afa-4246-416c-a726-9c048def03d9'

export async function POST(request: Request) {
  try {
    const payload = await request.json()

    if (!payload || typeof payload !== 'object' || !payload.answers) {
      return NextResponse.json({ error: 'Invalid lead payload' }, { status: 400 })
    }

    const response = await fetch(GO_HIGH_LEVEL_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      cache: 'no-store',
    })

    if (!response.ok) {
      console.error('[v0] GoHighLevel webhook failed:', response.status)
      return NextResponse.json({ error: 'Webhook delivery failed' }, { status: 502 })
    }

    return NextResponse.json({ delivered: true })
  } catch (error) {
    console.error('[v0] Lead webhook error:', error)
    return NextResponse.json({ error: 'Unable to submit lead' }, { status: 500 })
  }
}
