import { createBrowserClient } from '@supabase/ssr'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SupabaseDb = ReturnType<typeof createBrowserClient> & { from: (table: string) => any }

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === '' || url.includes('your_supabase') || key === '' || key.includes('your_supabase')) {
    if (typeof window !== 'undefined') {
      console.warn(
        'Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
      )
    }

    // Return a dummy client proxy to prevent crashing on initialization
    const dummyQueryBuilder: any = new Proxy(
      Object.assign(
        () => dummyQueryBuilder,
        {
          then: (onfulfilled: any) => {
            return Promise.resolve({ data: [], error: new Error('Supabase is not configured') }).then(onfulfilled)
          }
        }
      ),
      {
        get(target, prop) {
          if (prop === 'then') {
            return target.then
          }
          return () => dummyQueryBuilder
        }
      }
    )

    return new Proxy({}, {
      get(target, prop) {
        if (prop === 'auth') {
          return {
            getUser: async () => ({ data: { user: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
            signOut: async () => {},
          }
        }
        if (prop === 'from') {
          return () => dummyQueryBuilder
        }
        return () => {}
      }
    }) as unknown as SupabaseDb
  }

  return createBrowserClient(url, key) as unknown as SupabaseDb
}

