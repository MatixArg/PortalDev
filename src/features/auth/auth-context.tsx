'use client'

import { createContext, useContext, type ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { User } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  userType: 'developer' | 'company' | null
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  userType: null,
  signOut: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export const useAuthContext = () => useContext(AuthContext)
