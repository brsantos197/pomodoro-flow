import { Hono } from 'hono';
import { auth } from '../../lib/auth';
import authRoutes from '../../routes/auth.routes';
import { users } from '../../routes/users.routes';

export const createApp = ({
  basePath = '',
}) => {
  const app = new Hono<{
	Variables: {
		user: typeof auth.$Infer.Session.user | null;
		session: typeof auth.$Infer.Session.session | null
	}
}>().basePath(basePath);

app.use("*", async (c, next) => {
	const session = await auth.api.getSession({ headers: c.req.raw.headers });
  if (c.req.path.includes('auth')) {
    return await next();
  }
  console.log("session middleware:", session);
  	if (!session) {
    	c.set("user", null);
    	c.set("session", null);
        return c.json({ error: "Unauthorized" }, 401);
  	}
  	c.set("user", session.user);
  	c.set("session", session.session);
  	await next();
});

app.route(`/`, authRoutes);
app.route('/users', users)


  return app
}
