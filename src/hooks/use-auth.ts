'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/store/auth-store'
import { createClient } from '@/lib/supabase/client'

export function useAuth() {
  const { user, isAuthenticated, isLoading, userType, setUser, setUserType, signOut } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(({ data: { user } }: { data: { user: import('@supabase/supabase-js').User | null } }) => {
      setUser(user)
      if (user?.user_metadata?.user_type) {
        setUserType(user.user_metadata.user_type as 'developer' | 'company')
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: string, session: import('@supabase/supabase-js').Session | null) => {
      setUser(session?.user ?? null)
      if (session?.user?.user_metadata?.user_type) {
        setUserType(session.user.user_metadata.user_type as 'developer' | 'company')
      }
    })

    return () => subscription.unsubscribe()
  }, [setUser, setUserType])

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    signOut()
    router.push('/')
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    userType,
    signOut: handleSignOut,
  }
}

export function useRequireAuth() {
  const { isAuthenticated, isLoading } = useAuthStore()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/auth/login')
    }
  }, [isLoading, isAuthenticated, router])

  return { isAuthenticated, isLoading }
}
