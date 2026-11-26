import { sendMetaEvent } from '@/lib/meta-events'

export async function POST(request: Request) {
  if (request.headers.get('sec-fetch-site') === 'cross-site') {
    return new Response(null, { status: 403 })
  }
  if (!request.headers.get('content-type')?.startsWith('application/json')) {
    return new Response(null, { status: 415 })
  }

  const payload = await request.json().catch(() => null)
  if (typeof payload?.eventId !== 'string' || !/^[\w-]{1,80}$/.test(payload.eventId) ||
      typeof payload.path !== 'string' || !payload.path.startsWith('/')) {
    return new Response(null, { status: 400 })
  }

  const pageUrl = new URL(request.url)
  pageUrl.pathname = payload.path
  pageUrl.search = ''
  await sendMetaEvent(request, 'PageView', { eventId: payload.eventId, pageUrl: pageUrl.href })
  return new Response(null, { status: 204 })
}
