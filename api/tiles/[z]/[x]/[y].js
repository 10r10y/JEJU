const TILE_RE = /^\d+$/

export default async function handler(req, res) {
  const { z, x, y } = req.query
  const yValue = Array.isArray(y) ? y[0] : y
  const tileY = String(yValue || '').replace(/\.png$/i, '')
  const tileZ = Array.isArray(z) ? z[0] : z
  const tileX = Array.isArray(x) ? x[0] : x

  if (!TILE_RE.test(String(tileZ)) || !TILE_RE.test(String(tileX)) || !TILE_RE.test(tileY)) {
    res.status(400).send('Invalid tile coordinates')
    return
  }

  const zoom = Number(tileZ)
  if (zoom < 0 || zoom > 18) {
    res.status(400).send('Unsupported zoom')
    return
  }

  const host = req.headers.host || 'jeju-itinerary'
  const upstreamUrl = `https://tile.openstreetmap.org/${tileZ}/${tileX}/${tileY}.png`

  try {
    const upstream = await fetch(upstreamUrl, {
      headers: {
        'User-Agent': `jeju-itinerary-tile-proxy/1.0 (${host})`,
      },
    })

    if (!upstream.ok) {
      res.status(upstream.status).send('Tile unavailable')
      return
    }

    const body = Buffer.from(await upstream.arrayBuffer())
    res.setHeader('Content-Type', 'image/png')
    res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=604800')
    res.send(body)
  } catch {
    res.status(502).send('Tile proxy failed')
  }
}
