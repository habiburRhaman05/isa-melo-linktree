import { createHash } from 'node:crypto'

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1442980507901810'
const META_CAPI_TOKEN = process.env.META_CONVERSIONS_API_TOKEN

const sha256 = (value: string) => createHash('sha256').update(value.trim().toLowerCase()).digest('hex')

export async function sendMetaEvent(request: Request, eventName: 'PageView' | 'Lead', payload: Record<string, unknown>) {
  if (!META_PIXEL_ID || !META_CAPI_TOKEN) return

  const answers = (payload.answers ?? {}) as Record<string, string>
  const userData: Record<string, unknown> = {}

  if (answers.email) userData.em = [sha256(answers.email)]
  const localPhone = (answers.phone || '').replace(/\D/g, '')
  const phoneDigits = localPhone ? `${answers.phoneCode || '971'}${localPhone.replace(/^0+/, '')}` : ''
  if (phoneDigits) userData.ph = [sha256(phoneDigits)]

  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
  if (ip) userData.client_ip_address = ip
  const ua = request.headers.get('user-agent')
  if (ua) userData.client_user_agent = ua

  const cookie = request.headers.get('cookie') || ''
  const fbp = cookie.match(/_fbp=([^;]+)/)?.[1]
  const fbc = cookie.match(/_fbc=([^;]+)/)?.[1]
  if (fbp) userData.fbp = fbp
  if (fbc) userData.fbc = fbc

  const body = {
    data: [{
      event_name: eventName,
      event_time: Math.floor(Date.now() / 1000),
      event_id: typeof payload.eventId === 'string' ? payload.eventId : undefined,
      action_source: 'website',
      event_source_url: typeof payload.pageUrl === 'string' ? payload.pageUrl : undefined,
      user_data: userData,
    }],
  }

  try {
    const res = await fetch(`https://graph.facebook.com/v27.0/${META_PIXEL_ID}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${META_CAPI_TOKEN}` },
      signal: AbortSignal.timeout(5000),
      body: JSON.stringify(body),
      cache: 'no-store',
    })
    if (!res.ok) console.error('[meta-capi]', eventName, res.status)
  } catch {
    console.error('[meta-capi] Delivery failed', eventName)
  }
}
