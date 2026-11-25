// Optional Supabase auth header attacher for server functions.
import { createMiddleware } from '@tanstack/react-start'
import { isSupabaseConfigured, supabase } from './client'

export const attachSupabaseAuth = createMiddleware({ type: 'function' }).client(
  async ({ next }) => {
    if (!isSupabaseConfigured()) {
      return next({ headers: {} })
    }
    try {
      const { data } = await supabase.auth.getSession()
      const token = data.session?.access_token
      return next({
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      })
    } catch {
      return next({ headers: {} })
    }
  },
)
