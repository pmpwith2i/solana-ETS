import { withApiAuthRequired, getSession } from '@auth0/nextjs-auth0';

export default withApiAuthRequired(async function myApiRoute(req, res) {
  const session = await getSession(req, res);
  if (!session) {
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }
  const { user } = session;

  res.json({ protected: 'My Secret', id: user.sub, user });
});
