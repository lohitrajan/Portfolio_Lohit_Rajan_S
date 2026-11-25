// Supabase client — optional. App works without env vars using static portfolio content
// and hardcoded admin login (src/lib/admin/auth.ts).
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Database } from './types';
import { brokeredPreviewStorage } from './previewAuthStorage';

function isNewSupabaseApiKey(value: string): boolean {
  return value.startsWith('sb_publishable_') || value.startsWith('sb_secret_');
}

function serverSupabaseUrl(publicUrl: string, supabaseKey: string): string | undefined {
  if (typeof window !== 'undefined' || typeof process === 'undefined') return undefined;
  const serverUrl = process.env['SUPABASE_URL']?.replace(/\/+$/, '');
  if (!serverUrl || serverUrl === publicUrl || process.env['SUPABASE_PUBLISHABLE_KEY'] !== supabaseKey) return undefined;
  return serverUrl;
}

function createSupabaseFetch(supabaseUrl: string, supabaseKey: string): typeof fetch {
  const publicUrl = supabaseUrl.replace(/\/+$/, '');
  const serverUrl = serverSupabaseUrl(publicUrl, supabaseKey);
  return (input, init) => {
    const headers = new Headers(
      typeof Request !== 'undefined' && input instanceof Request ? input.headers : undefined,
    );

    if (init?.headers) {
      new Headers(init.headers).forEach((value, key) => headers.set(key, value));
    }

    if (isNewSupabaseApiKey(supabaseKey) && headers.get('Authorization') === `Bearer ${supabaseKey}`) {
      headers.delete('Authorization');
    }

    headers.set('apikey', supabaseKey);
    if (serverUrl) {
      const url = typeof input === 'string' ? input : input instanceof URL ? input.href : input.url;
      if (url.startsWith(`${publicUrl}/`)) {
        const target = serverUrl + url.slice(publicUrl.length);
        const request = typeof input === 'string' || input instanceof URL ? target : new Request(target, input);
        return fetch(request, { ...init, headers });
      }
    }
    return fetch(input, { ...init, headers });
  };
}

export function getSupabaseEnv(): { url: string; key: string } | null {
  const SUPABASE_URL =
    (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_SUPABASE_URL']) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_URL'] : undefined);
  const SUPABASE_PUBLISHABLE_KEY =
    (typeof import.meta !== 'undefined' && import.meta.env?.['VITE_SUPABASE_PUBLISHABLE_KEY']) ||
    (typeof process !== 'undefined' ? process.env['SUPABASE_PUBLISHABLE_KEY'] : undefined);

  if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) return null;
  return { url: SUPABASE_URL, key: SUPABASE_PUBLISHABLE_KEY };
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseEnv() !== null;
}

function createSupabaseClient(): SupabaseClient<Database> {
  const env = getSupabaseEnv();

  // No Supabase: return a inert client so imports don't crash.
  // Portfolio uses staticContent; admin login uses local auth.
  if (!env) {
    console.warn(
      '[Supabase] SUPABASE_URL / SUPABASE_PUBLISHABLE_KEY not set. Using static content and local admin auth.',
    );
    return createClient<Database>('https://placeholder.supabase.co', 'public-anon-key', {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });
  }

  return createClient<Database>(env.url, env.key, {
    global: {
      fetch: createSupabaseFetch(env.url, env.key),
    },
    auth: {
      storage: brokeredPreviewStorage(),
      persistSession: true,
      autoRefreshToken: true,
    },
  });
}

let _supabase: SupabaseClient<Database> | undefined;

export const supabase = new Proxy({} as SupabaseClient<Database>, {
  get(_, prop, receiver) {
    if (!_supabase) _supabase = createSupabaseClient();
    return Reflect.get(_supabase, prop, receiver);
  },
});
