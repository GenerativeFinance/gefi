import express from 'express';
import crypto from 'crypto';

// NOTE: This router uses Node 18+ global fetch. If your runtime < 18, add node-fetch.
const router = express.Router();

// Minimal in-memory store for demo/MVP
// In production, replace with DB or encrypted KV
const githubTokens = new Map<string, string>(); // userId -> accessToken
const githubStates = new Map<string, string>(); // state -> userId

// Helper: best-effort user id resolution across common auth shapes
function getUserId(req: any): string {
  return (
    req?.user?.claims?.sub ||
    req?.user?.id ||
    req?.auth?.userId ||
    (req.headers['x-user-id'] as string) ||
    'demo-user'
  );
}

function getOrigin(req: any): string {
  // Try to reconstruct origin for callback URL
  const proto = (req.headers['x-forwarded-proto'] as string) || 'http';
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  return `${proto}://${host}`;
}

function requireToken(req: any, res: any, next: any) {
  const userId = getUserId(req);
  const token = githubTokens.get(userId);
  if (!token) {
    return res.status(401).json({ connected: false, message: 'GitHub not connected' });
  }
  (req as any).githubToken = token;
  (req as any).githubUserId = userId;
  next();
}

// GET /api/integrations/github/status
router.get('/status', (req, res) => {
  const userId = getUserId(req);
  const connected = githubTokens.has(userId);
  res.json({ connected });
});

// GET /api/integrations/github/install-url
router.get('/install-url', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  if (!clientId) {
    return res.status(500).json({ error: 'Missing GITHUB_CLIENT_ID' });
  }

  const userId = getUserId(req);
  const state = crypto.randomBytes(16).toString('hex');
  githubStates.set(state, userId);

  const origin = getOrigin(req);
  const redirectUri = `${origin}/api/integrations/github/callback`;

  const scope = [
    'repo',          // full repo scope for MVP (private/public). Narrow for prod.
    'read:user',
    'user:email'
  ].join(' ');

  const url = new URL('https://github.com/login/oauth/authorize');
  url.searchParams.set('client_id', clientId);
  url.searchParams.set('redirect_uri', redirectUri);
  url.searchParams.set('scope', scope);
  url.searchParams.set('state', state);

  res.json({ url: url.toString() });
});

// GET /api/integrations/github/callback
router.get('/callback', async (req, res) => {
  try {
    const code = String(req.query.code || '');
    const state = String(req.query.state || '');
    const expectedUserId = githubStates.get(state);
    if (!code || !state || !expectedUserId) {
      return res.status(400).send('Invalid OAuth callback');
    }
    githubStates.delete(state);

    const clientId = process.env.GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;
    if (!clientId || !clientSecret) {
      return res.status(500).send('Missing GitHub OAuth env vars');
    }

    const tokenResp = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
      })
    });

    if (!tokenResp.ok) {
      const txt = await tokenResp.text();
      return res.status(500).send(`Failed to exchange token: ${txt}`);
    }

    const tokenJson: any = await tokenResp.json();
    if (!tokenJson.access_token) {
      return res.status(500).send('No access_token in response');
    }

    githubTokens.set(expectedUserId, tokenJson.access_token);

    // Redirect user back to Version Control UI
    const origin = getOrigin(req);
    return res.redirect(`${origin}/developer/develop/version-control?connected=github`);
  } catch (err) {
    console.error('GitHub OAuth callback error', err);
    return res.status(500).send('GitHub OAuth failed');
  }
});

// POST /api/integrations/github/disconnect
router.post('/disconnect', (req, res) => {
  const userId = getUserId(req);
  githubTokens.delete(userId);
  res.json({ success: true });
});

// GET /api/integrations/github/repos
router.get('/repos', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const ghResp = await fetch('https://api.github.com/user/repos?per_page=50&sort=updated', {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      }
    });
    const data = await ghResp.json();
    if (!ghResp.ok) return res.status(ghResp.status).json(data);
    res.json(data);
  } catch (e) {
    console.error('List repos error', e);
    res.status(500).json({ error: 'Failed to list repos' });
  }
});

// GET /api/integrations/github/repos/:owner/:repo/branches
router.get('/repos/:owner/:repo/branches', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const { owner, repo } = req.params;
    const ghResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/branches?per_page=100`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      }
    });
    const data = await ghResp.json();
    if (!ghResp.ok) return res.status(ghResp.status).json(data);
    res.json(data);
  } catch (e) {
    console.error('List branches error', e);
    res.status(500).json({ error: 'Failed to list branches' });
  }
});

// POST /api/integrations/github/repos/:owner/:repo/branches
// body: { from: string; newBranch: string }
router.post('/repos/:owner/:repo/branches', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const { owner, repo } = req.params;
    const { from, newBranch } = req.body || {};
    if (!from || !newBranch) {
      return res.status(400).json({ error: 'Missing from or newBranch' });
    }

    // Get base ref SHA
    const refResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/ref/heads/${encodeURIComponent(from)}`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      }
    });
    const refJson = await refResp.json();
    if (!refResp.ok || !refJson.object?.sha) {
      return res.status(refResp.status || 500).json(refJson);
    }

    // Create new ref
    const createResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/refs`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      },
      body: JSON.stringify({
        ref: `refs/heads/${newBranch}`,
        sha: refJson.object.sha
      })
    });
    const createJson = await createResp.json();
    if (!createResp.ok) return res.status(createResp.status).json(createJson);
    res.json(createJson);
  } catch (e) {
    console.error('Create branch error', e);
    res.status(500).json({ error: 'Failed to create branch' });
  }
});

// POST /api/integrations/github/repos/:owner/:repo/pulls
// body: { title: string; head: string; base: string; body?: string }
router.post('/repos/:owner/:repo/pulls', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const { owner, repo } = req.params;
    const { title, head, base, body } = req.body || {};
    if (!title || !head || !base) {
      return res.status(400).json({ error: 'Missing title, head or base' });
    }

    const prResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls`, {
      method: 'POST',
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      },
      body: JSON.stringify({ title, head, base, body })
    });
    const prJson = await prResp.json();
    if (!prResp.ok) return res.status(prResp.status).json(prJson);
    res.json(prJson);
  } catch (e) {
    console.error('Create PR error', e);
    res.status(500).json({ error: 'Failed to create pull request' });
  }
});

// GET /api/integrations/github/repos/:owner/:repo/pulls
router.get('/repos/:owner/:repo/pulls', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const { owner, repo } = req.params;
    const ghResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/pulls?per_page=50&state=all`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      }
    });
    const data = await ghResp.json();
    if (!ghResp.ok) return res.status(ghResp.status).json(data);
    res.json(data);
  } catch (e) {
    console.error('List pull requests error', e);
    res.status(500).json({ error: 'Failed to list pull requests' });
  }
});

// GET /api/integrations/github/repos/:owner/:repo/commits
router.get('/repos/:owner/:repo/commits', requireToken, async (req: any, res) => {
  try {
    const token = req.githubToken;
    const { owner, repo } = req.params;
    const ghResp = await fetch(`https://api.github.com/repos/${owner}/${repo}/commits?per_page=50`, {
      headers: {
        Accept: 'application/vnd.github+json',
        Authorization: `Bearer ${token}`,
        'X-GitHub-Api-Version': '2022-11-28',
        'User-Agent': 'GeFi-Integration'
      }
    });
    const data = await ghResp.json();
    if (!ghResp.ok) return res.status(ghResp.status).json(data);
    res.json(data);
  } catch (e) {
    console.error('List commits error', e);
    res.status(500).json({ error: 'Failed to list commits' });
  }
});

export default router;