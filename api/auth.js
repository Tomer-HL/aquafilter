// Step 1 of the GitHub OAuth login used by Decap CMS (/admin).
// Needs the env vars GITHUB_CLIENT_ID and GITHUB_CLIENT_SECRET (set in Vercel, never in the repo).
import crypto from 'node:crypto'

export default function handler(req, res) {
  const clientId = process.env.GITHUB_CLIENT_ID
  if (!clientId) { res.status(500).send('GITHUB_CLIENT_ID is not configured'); return }

  const state = crypto.randomBytes(16).toString('hex')
  res.setHeader('Set-Cookie', `oauth_state=${state}; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=600`)

  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.set('client_id', clientId)
  url.searchParams.set('scope', 'public_repo') // the repo is public; use "repo" if it ever becomes private
  url.searchParams.set('state', state)
  res.setHeader('Location', url.toString())
  res.status(302).end()
}
