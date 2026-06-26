import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createServerSupabaseClient() {
  const cookieStore = await cookies()
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key || url === '' || url.includes('your_supabase') || key === '' || key.includes('your_supabase')) {
    console.warn(
      'Server Supabase credentials are not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your .env.local file.'
    )

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

    return {
      from: () => dummyQueryBuilder,
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
        signOut: async () => {},
      },
      channel: () => {},
      rpc: () => {},
      schema: () => {},
    } as any
  }

  const client = createServerClient(
    url,
    key,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Can ignore
          }
        },
      },
    }
  )

  return client as unknown as {
    from: (table: string) => any
    auth: typeof client.auth
    channel: typeof client.channel
    rpc: typeof client.rpc
    schema: typeof client.schema
  }
}

