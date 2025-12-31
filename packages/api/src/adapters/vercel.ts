import { handle } from 'hono/vercel'
import { createApp } from '../core/http/app'

const app = createApp({
  basePath: '/api',
})

export const GET = handle(app)
export const POST = handle(app)
export const PUT = handle(app)
export const PATCH = handle(app)
export const DELETE = handle(app)
