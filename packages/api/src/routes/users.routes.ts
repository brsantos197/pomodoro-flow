import { Hono } from "hono";

export const users = new Hono();

users.get("/", (c) => {
  return c.json([{ id: 1, name: "John Doe" }]);
});

users.post("/", async (c) => {
  const body = await c.req.json();
  // Here you would normally add the user to your database
  return c.json({ id: 2, ...body });
});
