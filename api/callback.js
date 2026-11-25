// Step 2 of the GitHub OAuth login used by Decap CMS: exchanges the code for a token
// and hands it to the /admin window that opened this popup.
export default async function handler(req, res) {
  const { code, state } = req.query
  const cookie = Object.fromEntries((req.headers.cookie || '').split(/;\s*/).filter(Boolean).map(c => c.split('=')))
  res.setHeader('Set-Cookie', 'oauth_state=; HttpOnly; Secure; SameSite=Lax; Path=/api; Max-Age=0')
  res.setHeader('Content-Type', 'text/html; charset=utf-8')

  if (!code || !state || cookie.oauth_state !== state) { res.status(400).send('Invalid login request. Close this window and try again.'); return }

  let msg
  try {
    const r = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: process.env.GITHUB_CLIENT_ID, client_secret: process.env.GITHUB_CLIENT_SECRET, code }),
    })
    const d = await r.json()
    msg = d.access_token
      ? `authorization:github:success:${JSON.stringify({ token: d.access_token, provider: 'github' })}`
      : `authorization:github:error:${JSON.stringify({ error: d.error || 'unknown' })}`
  } catch {
    msg = 'authorization:github:error:{"error":"request_failed"}'
  }

  const safe = JSON.stringify(msg).replace(/</g, '\\u003c')
  res.status(200).send(`<!doctype html><meta charset="utf-8"><title>Login</title><script>
(function () {
  var msg = ${safe};
  function receive(e) { window.opener.postMessage(msg, e.origin); window.removeEventListener('message', receive, false); }
  window.addEventListener('message', receive, false);
  window.opener.postMessage('authorizing:github', '*');
})();
</script>`)
}
